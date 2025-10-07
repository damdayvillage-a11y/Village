import { v4 as uuidv4 } from 'uuid';

export interface OfflineBooking {
  id: string;
  homestayId: string;
  userId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalAmount: number;
  currency: string;
  guestDetails: {
    name: string;
    email: string;
    phone: string;
    specialRequests?: string;
  };
  status: 'pending' | 'syncing' | 'confirmed' | 'failed';
  timestamp: number;
  retryCount: number;
  lastError?: string;
}

export interface BookingConflict {
  localBooking: OfflineBooking;
  remoteBooking: any;
  conflictType: 'date_overlap' | 'capacity_exceeded' | 'pricing_changed';
  resolution: 'keep_local' | 'keep_remote' | 'manual_review';
}

export class OfflineBookingSync {
  private readonly STORAGE_KEY = 'village_offline_bookings';
  private readonly MAX_RETRY_COUNT = 3;
  private syncInProgress = false;

  constructor() {
    this.setupServiceWorkerSync();
    this.setupOnlineEventListeners();
  }

  /**
   * Add a booking to the offline queue
   */
  async queueBooking(bookingData: Omit<OfflineBooking, 'id' | 'status' | 'timestamp' | 'retryCount'>): Promise<string> {
    const booking: OfflineBooking = {
      ...bookingData,
      id: uuidv4(),
      status: 'pending',
      timestamp: Date.now(),
      retryCount: 0
    };

    const existingBookings = this.getOfflineBookings();
    existingBookings.push(booking);
    this.saveOfflineBookings(existingBookings);

    // Request background sync if service worker is available
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      try {
        const registration = await navigator.serviceWorker.ready;
        // Check if sync is supported
        if ('sync' in registration) {
          await (registration as any).sync.register('booking-sync');
        }
      } catch (error) {
        console.error('Background sync registration failed:', error);
        // Fallback to immediate sync attempt
        this.syncBookings();
      }
    } else {
      // Fallback for browsers without background sync
      this.syncBookings();
    }

    return booking.id;
  }

  /**
   * Get all offline bookings
   */
  getOfflineBookings(): OfflineBooking[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load offline bookings:', error);
      return [];
    }
  }

  /**
   * Get pending bookings count
   */
  getPendingBookingsCount(): number {
    return this.getOfflineBookings().filter(b => b.status === 'pending' || b.status === 'syncing').length;
  }

  /**
   * Sync all pending bookings with the server
   */
  async syncBookings(): Promise<void> {
    if (this.syncInProgress || !navigator.onLine) {
      return;
    }

    this.syncInProgress = true;
    const bookings = this.getOfflineBookings();
    const pendingBookings = bookings.filter(b => b.status === 'pending' || b.status === 'failed');

    for (const booking of pendingBookings) {
      await this.syncSingleBooking(booking);
    }

    this.syncInProgress = false;
  }

  /**
   * Sync a single booking with conflict resolution
   */
  private async syncSingleBooking(booking: OfflineBooking): Promise<void> {
    try {
      // Mark as syncing
      this.updateBookingStatus(booking.id, 'syncing');

      // Check for conflicts first
      const conflicts = await this.checkForConflicts(booking);
      
      if (conflicts.length > 0) {
        const resolvedBooking = await this.resolveConflicts(booking, conflicts);
        if (!resolvedBooking) {
          throw new Error('Booking conflicts could not be resolved');
        }
        // Update booking with resolved data
        Object.assign(booking, resolvedBooking);
      }

      // Submit to server
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          homestayId: booking.homestayId,
          checkIn: booking.checkIn,
          checkOut: booking.checkOut,
          guests: booking.guests,
          guestDetails: booking.guestDetails,
          offlineId: booking.id,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Mark as confirmed and store server ID
      this.updateBookingStatus(booking.id, 'confirmed', { serverId: result.id });
      
      // Remove from offline storage after successful sync
      setTimeout(() => this.removeBooking(booking.id), 5000);

    } catch (error) {
      console.error('Failed to sync booking:', error);
      
      booking.retryCount++;
      booking.lastError = error instanceof Error ? error.message : 'Unknown error';
      
      if (booking.retryCount >= this.MAX_RETRY_COUNT) {
        this.updateBookingStatus(booking.id, 'failed');
      } else {
        this.updateBookingStatus(booking.id, 'pending');
        // Exponential backoff for retry
        const retryDelay = Math.pow(2, booking.retryCount) * 1000;
        setTimeout(() => this.syncSingleBooking(booking), retryDelay);
      }
    }
  }

  /**
   * Check for booking conflicts using CRDT-style conflict detection
   */
  private async checkForConflicts(booking: OfflineBooking): Promise<BookingConflict[]> {
    try {
      const response = await fetch(`/api/bookings/check-conflicts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          homestayId: booking.homestayId,
          checkIn: booking.checkIn,
          checkOut: booking.checkOut,
          guests: booking.guests,
        }),
      });

      if (!response.ok) {
        throw new Error('Conflict check failed');
      }

      const conflicts = await response.json();
      return conflicts.map((conflict: any) => ({
        localBooking: booking,
        remoteBooking: conflict,
        conflictType: this.determineConflictType(booking, conflict),
        resolution: this.determineResolution(booking, conflict),
      }));

    } catch (error) {
      console.error('Conflict check failed:', error);
      return [];
    }
  }

  /**
   * Resolve booking conflicts using CRDT principles
   */
  private async resolveConflicts(booking: OfflineBooking, conflicts: BookingConflict[]): Promise<OfflineBooking | null> {
    for (const conflict of conflicts) {
      switch (conflict.conflictType) {
        case 'date_overlap':
          // Last-writer-wins based on timestamp
          if (booking.timestamp > conflict.remoteBooking.createdAt) {
            // Our booking is newer, try to proceed
            continue;
          } else {
            // Remote booking is newer, we need to handle this
            return await this.handleDateConflict(booking, conflict.remoteBooking);
          }

        case 'capacity_exceeded':
          // Try to adjust guest count or find alternative
          return await this.handleCapacityConflict(booking, conflict.remoteBooking);

        case 'pricing_changed':
          // Update pricing and continue
          return await this.handlePricingConflict(booking, conflict.remoteBooking);
      }
    }

    return booking;
  }

  private determineConflictType(local: OfflineBooking, remote: any): BookingConflict['conflictType'] {
    // Check for date overlap
    const localCheckIn = new Date(local.checkIn);
    const localCheckOut = new Date(local.checkOut);
    const remoteCheckIn = new Date(remote.checkIn);
    const remoteCheckOut = new Date(remote.checkOut);

    if (localCheckIn < remoteCheckOut && localCheckOut > remoteCheckIn) {
      return 'date_overlap';
    }

    // Check for capacity issues
    if (local.guests + remote.guests > remote.homestay.maxGuests) {
      return 'capacity_exceeded';
    }

    // Default to pricing change
    return 'pricing_changed';
  }

  private determineResolution(local: OfflineBooking, remote: any): BookingConflict['resolution'] {
    // Use timestamp-based resolution (last-writer-wins)
    return local.timestamp > remote.createdAt ? 'keep_local' : 'keep_remote';
  }

  private async handleDateConflict(booking: OfflineBooking, remoteBooking: any): Promise<OfflineBooking | null> {
    // Try to suggest alternative dates
    const response = await fetch('/api/bookings/suggest-alternatives', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        homestayId: booking.homestayId,
        originalCheckIn: booking.checkIn,
        originalCheckOut: booking.checkOut,
        guests: booking.guests,
      }),
    });

    if (response.ok) {
      const alternatives = await response.json();
      if (alternatives.length > 0) {
        // For now, automatically select the first alternative
        // In a real app, this would prompt the user
        const alternative = alternatives[0];
        return {
          ...booking,
          checkIn: alternative.checkIn,
          checkOut: alternative.checkOut,
          totalAmount: alternative.totalAmount,
        };
      }
    }

    return null; // No resolution possible
  }

  private async handleCapacityConflict(booking: OfflineBooking, remoteBooking: any): Promise<OfflineBooking | null> {
    const maxGuests = remoteBooking.homestay.maxGuests;
    const availableCapacity = maxGuests - remoteBooking.guests;

    if (booking.guests <= availableCapacity) {
      // We can fit, proceed with booking
      return booking;
    }

    // Try to find alternative homestays
    const response = await fetch('/api/homestays/search-alternatives', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        guests: booking.guests,
        excludeId: booking.homestayId,
      }),
    });

    if (response.ok) {
      const alternatives = await response.json();
      if (alternatives.length > 0) {
        const alternative = alternatives[0];
        return {
          ...booking,
          homestayId: alternative.id,
          totalAmount: alternative.estimatedPrice,
        };
      }
    }

    return null;
  }

  private async handlePricingConflict(booking: OfflineBooking, remoteBooking: any): Promise<OfflineBooking> {
    // Update with current pricing
    return {
      ...booking,
      totalAmount: remoteBooking.currentPrice,
    };
  }

  private updateBookingStatus(bookingId: string, status: OfflineBooking['status'], extra?: any): void {
    const bookings = this.getOfflineBookings();
    const bookingIndex = bookings.findIndex(b => b.id === bookingId);
    
    if (bookingIndex !== -1) {
      bookings[bookingIndex].status = status;
      if (extra) {
        Object.assign(bookings[bookingIndex], extra);
      }
      this.saveOfflineBookings(bookings);
    }
  }

  private removeBooking(bookingId: string): void {
    const bookings = this.getOfflineBookings();
    const filteredBookings = bookings.filter(b => b.id !== bookingId);
    this.saveOfflineBookings(filteredBookings);
  }

  private saveOfflineBookings(bookings: OfflineBooking[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(bookings));
    } catch (error) {
      console.error('Failed to save offline bookings:', error);
    }
  }

  private setupServiceWorkerSync(): void {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SYNC_BOOKINGS') {
          this.syncBookings();
        }
      });
    }
  }

  private setupOnlineEventListeners(): void {
    window.addEventListener('online', () => {
      console.log('Connection restored, syncing offline bookings...');
      this.syncBookings();
    });

    window.addEventListener('offline', () => {
      console.log('Connection lost, bookings will be queued offline');
    });
  }
}

// Global instance
export const offlineBookingSync = new OfflineBookingSync();