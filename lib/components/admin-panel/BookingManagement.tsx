'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/lib/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/components/ui/Card';
import { Badge } from '@/lib/components/ui/Badge';
import { 
  Calendar,
  Search,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  User,
  MapPin,
  IndianRupee,
  ChevronLeft,
  ChevronRight,
  Grid3x3,
  List,
  Filter,
  TrendingUp,
  Clock
} from 'lucide-react';

interface Booking {
  id: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: string;
  pricing: any;
  guest: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  homestay: {
    id: string;
    name: string;
    owner: {
      id: string;
      name: string;
      email: string;
    };
  };
  payments?: Array<{
    id: string;
    amount: number;
    status: string;
    method: string;
    createdAt: string;
  }>;
  createdAt: string;
}

export function BookingManagement() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);

  useEffect(() => {
    loadBookings();
  }, [statusFilter, startDate, endDate]);

  const loadBookings = async () => {
    try {
      setError(null);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      if (startDate) {
        params.append('startDate', startDate);
      }
      if (endDate) {
        params.append('endDate', endDate);
      }

      const response = await fetch(`/api/admin/bookings?${params}`);
      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || []);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to load bookings');
      }
    } catch (error) {
      console.error('Failed to load bookings:', error);
      setError('Network error loading bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/admin/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, status: newStatus }),
      });

      if (response.ok) {
        await loadBookings();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to update booking');
      }
    } catch (error) {
      console.error('Failed to update booking:', error);
      alert('Network error updating booking');
    }
  };

  // Export bookings to CSV
  const exportToCSV = () => {
    const csvData = filteredBookings.map(booking => ({
      'Booking ID': booking.id,
      'Guest Name': booking.guest.name,
      'Guest Email': booking.guest.email,
      'Homestay': booking.homestay.name,
      'Owner': booking.homestay.owner.name,
      'Check-in': new Date(booking.checkIn).toLocaleDateString(),
      'Check-out': new Date(booking.checkOut).toLocaleDateString(),
      'Nights': calculateNights(booking.checkIn, booking.checkOut),
      'Guests': booking.guests,
      'Status': booking.status,
      'Total Amount': booking.pricing?.total || 0,
      'Payment Status': booking.payments?.[0]?.status || 'N/A',
      'Created': new Date(booking.createdAt).toLocaleDateString(),
    }));

    const headers = Object.keys(csvData[0] || {});
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => 
        headers.map(header => {
          const value = row[header as keyof typeof row];
          // Escape commas and quotes
          return typeof value === 'string' && value.includes(',') 
            ? `"${value.replace(/"/g, '""')}"` 
            : value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `bookings_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Quick date filters
  const applyQuickFilter = (filterType: string) => {
    const today = new Date();
    const start = new Date();
    const end = new Date();

    switch (filterType) {
      case 'today':
        setStartDate(today.toISOString().split('T')[0]);
        setEndDate(today.toISOString().split('T')[0]);
        break;
      case 'week':
        start.setDate(today.getDate() - today.getDay());
        end.setDate(start.getDate() + 6);
        setStartDate(start.toISOString().split('T')[0]);
        setEndDate(end.toISOString().split('T')[0]);
        break;
      case 'month':
        start.setDate(1);
        end.setMonth(end.getMonth() + 1, 0);
        setStartDate(start.toISOString().split('T')[0]);
        setEndDate(end.toISOString().split('T')[0]);
        break;
      case 'next7':
        end.setDate(today.getDate() + 7);
        setStartDate(today.toISOString().split('T')[0]);
        setEndDate(end.toISOString().split('T')[0]);
        break;
      case 'next30':
        end.setDate(today.getDate() + 30);
        setStartDate(today.toISOString().split('T')[0]);
        setEndDate(end.toISOString().split('T')[0]);
        break;
      case 'clear':
        setStartDate('');
        setEndDate('');
        break;
    }
  };

  // Calculate nights between dates
  const calculateNights = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = end.getTime() - start.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  // Calculate statistics
  const calculateStats = () => {
    const pending = filteredBookings.filter(b => b.status === 'PENDING').length;
    const confirmed = filteredBookings.filter(b => b.status === 'CONFIRMED').length;
    const checkedIn = filteredBookings.filter(b => b.status === 'CHECKED_IN').length;
    const totalRevenue = filteredBookings.reduce((sum, b) => sum + (b.pricing?.total || 0), 0);
    
    return {
      total: filteredBookings.length,
      pending,
      confirmed,
      checkedIn,
      revenue: totalRevenue
    };
  };

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days: (Date | null)[] = [];
    
    // Add empty slots for days before the first day of month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getBookingsForDate = (date: Date | null) => {
    if (!date) return [];
    
    return bookings.filter(booking => {
      const checkIn = new Date(booking.checkIn);
      const checkOut = new Date(booking.checkOut);
      const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const checkInOnly = new Date(checkIn.getFullYear(), checkIn.getMonth(), checkIn.getDate());
      const checkOutOnly = new Date(checkOut.getFullYear(), checkOut.getMonth(), checkOut.getDate());
      
      return dateOnly >= checkInOnly && dateOnly <= checkOutOnly;
    });
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CHECKED_IN': return 'bg-blue-100 text-blue-800';
      case 'CHECKED_OUT': return 'bg-gray-100 text-gray-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusDotColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-500';
      case 'PENDING': return 'bg-yellow-500';
      case 'CHECKED_IN': return 'bg-blue-500';
      case 'CHECKED_OUT': return 'bg-gray-500';
      case 'CANCELLED': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredBookings = bookings.filter(booking =>
    booking.guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.homestay.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = calculateStats();
  const calendarDays = getDaysInMonth(currentMonth);
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Booking Management</h2>
          <p className="text-gray-600">Manage homestay bookings and reservations</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4 mr-2" />
            List
          </Button>
          <Button
            variant={viewMode === 'calendar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('calendar')}
          >
            <Grid3x3 className="h-4 w-4 mr-2" />
            Calendar
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase">Confirmed</p>
                <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase">Checked In</p>
                <p className="text-2xl font-bold text-blue-600">{stats.checkedIn}</p>
              </div>
              <User className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase">Revenue</p>
                <p className="text-2xl font-bold text-purple-600">₹{stats.revenue.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CHECKED_IN">Checked In</option>
              <option value="CHECKED_OUT">Checked Out</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            
            <div className="flex gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Start date"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="End date"
              />
            </div>
            
            <Button
              variant="outline"
              onClick={exportToCSV}
              disabled={filteredBookings.length === 0}
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV ({filteredBookings.length})
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => applyQuickFilter('today')}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={() => applyQuickFilter('week')}>
              This Week
            </Button>
            <Button variant="outline" size="sm" onClick={() => applyQuickFilter('month')}>
              This Month
            </Button>
            <Button variant="outline" size="sm" onClick={() => applyQuickFilter('next7')}>
              Next 7 Days
            </Button>
            <Button variant="outline" size="sm" onClick={() => applyQuickFilter('next30')}>
              Next 30 Days
            </Button>
            {(startDate || endDate) && (
              <Button variant="outline" size="sm" onClick={() => applyQuickFilter('clear')}>
                Clear Filter
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <CardTitle className="text-lg">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentMonth(new Date())}
              >
                Today
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((date, index) => {
                const dayBookings = getBookingsForDate(date);
                return (
                  <div
                    key={index}
                    className={`
                      min-h-20 p-2 border rounded-lg cursor-pointer transition-colors
                      ${date ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'}
                      ${isToday(date) ? 'border-blue-500 border-2' : 'border-gray-200'}
                      ${selectedDate && date?.toDateString() === selectedDate.toDateString() ? 'ring-2 ring-primary-500' : ''}
                    `}
                    onClick={() => date && setSelectedDate(date)}
                  >
                    {date && (
                      <>
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          {date.getDate()}
                        </div>
                        <div className="space-y-1">
                          {dayBookings.slice(0, 3).map(booking => (
                            <div
                              key={booking.id}
                              className={`text-xs px-1 py-0.5 rounded truncate ${getStatusColor(booking.status)}`}
                              title={`${booking.guest.name} - ${booking.homestay.name}`}
                            >
                              <div className={`h-1.5 w-1.5 rounded-full inline-block mr-1 ${getStatusDotColor(booking.status)}`}></div>
                              {booking.guest.name.split(' ')[0]}
                            </div>
                          ))}
                          {dayBookings.length > 3 && (
                            <div className="text-xs text-gray-500">
                              +{dayBookings.length - 3} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected Date Bookings */}
      {viewMode === 'calendar' && selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle>
              Bookings for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getBookingsForDate(selectedDate).map(booking => (
                <div key={booking.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{booking.homestay.name}</h4>
                      <p className="text-sm text-gray-600">{booking.guest.name} - {booking.guest.email}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                  </div>
                </div>
              ))}
              {getBookingsForDate(selectedDate).length === 0 && (
                <p className="text-center text-gray-500 py-8">No bookings for this date</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bookings Grid */}
      {viewMode === 'list' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredBookings.map((booking) => {
            const isExpanded = expandedBooking === booking.id;
            return (
              <Card key={booking.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{booking.homestay.name}</h3>
                      <p className="text-sm text-gray-500 flex items-center mt-1">
                        <User className="inline h-3 w-3 mr-1" />
                        {booking.guest.name}
                      </p>
                      <p className="text-xs text-gray-400">{booking.guest.email}</p>
                    </div>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                      </span>
                      <span className="ml-2 text-gray-500">
                        ({calculateNights(booking.checkIn, booking.checkOut)} nights)
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="h-4 w-4 mr-2" />
                      <span>{booking.guests} guest(s)</span>
                    </div>
                    <div className="flex items-center text-sm font-semibold text-gray-900">
                      <IndianRupee className="h-4 w-4 mr-1" />
                      {booking.pricing?.total?.toLocaleString() || 0}
                    </div>
                  </div>

                  {/* Expandable Details */}
                  {isExpanded && (
                    <div className="border-t pt-4 mb-4 space-y-2">
                      <div className="text-sm">
                        <p className="font-semibold text-gray-700">Homestay Owner:</p>
                        <p className="text-gray-600">{booking.homestay.owner.name}</p>
                        <p className="text-xs text-gray-500">{booking.homestay.owner.email}</p>
                      </div>
                      {booking.payments && booking.payments.length > 0 && (
                        <div className="text-sm">
                          <p className="font-semibold text-gray-700">Payment:</p>
                          <p className="text-gray-600">
                            ₹{booking.payments[0].amount.toLocaleString()} - {booking.payments[0].status}
                          </p>
                          <p className="text-xs text-gray-500">Method: {booking.payments[0].method}</p>
                        </div>
                      )}
                      <div className="text-sm">
                        <p className="font-semibold text-gray-700">Booking Created:</p>
                        <p className="text-gray-600">{new Date(booking.createdAt).toLocaleString()}</p>
                      </div>
                      {booking.pricing?.adminNotes && (
                        <div className="text-sm">
                          <p className="font-semibold text-gray-700">Admin Notes:</p>
                          <p className="text-gray-600">{booking.pricing.adminNotes}</p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setExpandedBooking(isExpanded ? null : booking.id)}
                      className="flex-1"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      {isExpanded ? 'Less' : 'More'}
                    </Button>
                    {booking.status === 'PENDING' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateBookingStatus(booking.id, 'CONFIRMED')}
                          className="flex-1"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Confirm
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateBookingStatus(booking.id, 'CANCELLED')}
                          className="flex-1"
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          Cancel
                        </Button>
                      </>
                    )}
                    {booking.status === 'CONFIRMED' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateBookingStatus(booking.id, 'CHECKED_IN')}
                        className="flex-1"
                      >
                        Check In
                      </Button>
                    )}
                    {booking.status === 'CHECKED_IN' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateBookingStatus(booking.id, 'CHECKED_OUT')}
                        className="flex-1"
                      >
                        Check Out
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {viewMode === 'list' && filteredBookings.length === 0 && !error && (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' || startDate || endDate
                ? 'Try adjusting your search or filter criteria' 
                : 'No bookings have been made yet'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
