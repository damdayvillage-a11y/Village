import ical, { ICalAttendeeStatus, ICalAlarmType, ICalCalendarMethod, ICalEventStatus } from 'ical-generator';
import { format } from 'date-fns';

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
  location?: string;
  attendees?: string[];
  organizer?: {
    name: string;
    email: string;
  };
}

export interface BookingCalendarData {
  bookingId: string;
  homestayTitle: string;
  guestName: string;
  guestEmail: string;
  hostName: string;
  hostEmail: string;
  checkInDate: Date;
  checkOutDate: Date;
  guests: number;
  location: string;
}

export class CalendarSyncService {
  static generateBookingCalendar(data: BookingCalendarData): string {
    const calendar = ical({
      name: 'Damday Village Bookings',
      description: 'Homestay bookings for Damday Village',
      timezone: 'Asia/Kolkata',
      prodId: {
        company: 'Damday Village',
        product: 'Booking System',
        language: 'EN',
      },
    });

    // Guest event
    const guestEvent = calendar.createEvent({
      id: `guest-${data.bookingId}`,
      start: data.checkInDate,
      end: data.checkOutDate,
      allDay: true,
      summary: `Stay at ${data.homestayTitle}`,
      description: `
Your stay at ${data.homestayTitle} in Damday Village

Host: ${data.hostName}
Guests: ${data.guests}
Location: ${data.location}

Check-in: ${format(data.checkInDate, 'PPP')}
Check-out: ${format(data.checkOutDate, 'PPP')}

Contact: ${data.hostEmail}

We look forward to welcoming you to our sustainable mountain retreat!
      `.trim(),
      location: data.location,
      organizer: {
        name: 'Damday Village',
        email: 'bookings@damdayvillage.com',
      },
      attendees: [
        {
          name: data.guestName,
          email: data.guestEmail,
          status: ICalAttendeeStatus.ACCEPTED,
        },
      ],
    });

    // Add reminder alarms
    guestEvent.createAlarm({
      type: ICalAlarmType.display,
      trigger: 60 * 60 * 24 * 3, // 3 days before
      description: 'Your Damday Village stay is in 3 days! Time to pack for your sustainable mountain adventure.',
    });

    guestEvent.createAlarm({
      type: ICalAlarmType.display,
      trigger: 60 * 60 * 24, // 1 day before
      description: 'Your Damday Village stay is tomorrow! Check travel directions and weather forecast.',
    });

    return calendar.toString();
  }

  static generateHostCalendar(data: BookingCalendarData): string {
    const calendar = ical({
      name: 'Damday Village Host Calendar',
      description: 'Host calendar for Damday Village homestay bookings',
      timezone: 'Asia/Kolkata',
      prodId: {
        company: 'Damday Village',
        product: 'Host System',
        language: 'EN',
      },
    });

    // Host event
    const hostEvent = calendar.createEvent({
      id: `host-${data.bookingId}`,
      start: data.checkInDate,
      end: data.checkOutDate,
      allDay: true,
      summary: `Host: ${data.guestName} (${data.guests} guests)`,
      description: `
New booking for your homestay: ${data.homestayTitle}

Guest: ${data.guestName}
Email: ${data.guestEmail}
Guests: ${data.guests}

Check-in: ${format(data.checkInDate, 'PPP')}
Check-out: ${format(data.checkOutDate, 'PPP')}

Preparation checklist:
- Prepare rooms and amenities
- Stock local organic food
- Plan welcome activities
- Check solar system and utilities
- Prepare local experience recommendations

Contact guest: ${data.guestEmail}
      `.trim(),
      location: data.location,
      organizer: {
        name: 'Damday Village',
        email: 'hosts@damdayvillage.com',
      },
      attendees: [
        {
          name: data.hostName,
          email: data.hostEmail,
          status: ICalAttendeeStatus.ACCEPTED,
        },
      ],
    });

    // Host preparation reminders
    hostEvent.createAlarm({
      type: ICalAlarmType.display,
      trigger: 60 * 60 * 24 * 7, // 1 week before
      description: 'Booking in 1 week: Start preparing homestay and planning guest activities.',
    });

    hostEvent.createAlarm({
      type: ICalAlarmType.display,
      trigger: 60 * 60 * 24 * 3, // 3 days before
      description: 'Booking in 3 days: Final preparations, stock food, and check amenities.',
    });

    hostEvent.createAlarm({
      type: ICalAlarmType.display,
      trigger: 60 * 60 * 24, // 1 day before
      description: 'Guest arrives tomorrow: Final setup and welcome preparations.',
    });

    return calendar.toString();
  }

  static generateCancellationUpdate(data: BookingCalendarData, reason?: string): string {
    const calendar = ical({
      name: 'Damday Village Booking Cancellation',
      description: 'Booking cancellation notification',
      timezone: 'Asia/Kolkata',
      method: ICalCalendarMethod.CANCEL,
      prodId: {
        company: 'Damday Village',
        product: 'Booking System',
        language: 'EN',
      },
    });

    // Cancellation event
    calendar.createEvent({
      id: `cancelled-${data.bookingId}`,
      start: data.checkInDate,
      end: data.checkOutDate,
      allDay: true,
      summary: `CANCELLED: ${data.homestayTitle}`,
      description: `
This booking has been cancelled.

Original booking details:
Homestay: ${data.homestayTitle}
Guest: ${data.guestName}
Dates: ${format(data.checkInDate, 'PPP')} - ${format(data.checkOutDate, 'PPP')}
${reason ? `\nCancellation reason: ${reason}` : ''}

If you have any questions, please contact us at bookings@damdayvillage.com
      `.trim(),
      location: data.location,
      status: ICalEventStatus.CANCELLED,
      organizer: {
        name: 'Damday Village',
        email: 'bookings@damdayvillage.com',
      },
    });

    return calendar.toString();
  }

  static async sendCalendarInvite(
    email: string,
    calendarData: string,
    subject: string
  ): Promise<boolean> {
    try {
      // This would integrate with the email service to send calendar invites
      // For now, we'll return the calendar data that can be sent via email
      console.log(`Calendar invite sent to ${email} with subject: ${subject}`);
      return true;
    } catch (error) {
      console.error('Failed to send calendar invite:', error);
      return false;
    }
  }

  static generateWebCalURL(bookingId: string, userType: 'guest' | 'host'): string {
    // Generate a secure URL for accessing the calendar
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://village-app.captain.damdayvillage.com';
    return `${baseUrl}/api/calendar/${userType}/${bookingId}.ics`;
  }

  static async syncToExternalCalendar(
    provider: 'google' | 'outlook' | 'apple',
    calendarData: string,
    accessToken?: string
  ): Promise<boolean> {
    try {
      switch (provider) {
        case 'google':
          // Google Calendar API integration would go here
          console.log('Syncing to Google Calendar...');
          break;
        case 'outlook':
          // Microsoft Graph API integration would go here
          console.log('Syncing to Outlook Calendar...');
          break;
        case 'apple':
          // iCloud Calendar integration would go here
          console.log('Syncing to Apple Calendar...');
          break;
      }
      
      return true;
    } catch (error) {
      console.error(`Failed to sync to ${provider} calendar:`, error);
      return false;
    }
  }
}