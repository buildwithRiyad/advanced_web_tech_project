import { Injectable } from '@nestjs/common';

@Injectable()
export class CustomerService {
  
  private rooms = [
    { id: 101, name: 'Deluxe Room', price: 3000 },
    { id: 201, name: 'Suite Room', price: 5000 },
    { id: 301, name: 'Single Room', price: 1500 },
    { id: 401, name: 'Single AC Room', price: 1500 },
  ];

  
  private bookings: any[] = [];

  
  getRoomsByExactPrice(price?: number) {
  if (price !== undefined) {
    const filtered = this.rooms.filter(room => room.price === price);
    return { success: true, data: filtered };
  }
  return { success: true, data: this.rooms };
}

  
  getRoomById(id: number) {
    const room = this.rooms.find(r => r.id === id);
    return room 
      ? { success: true, data: room }
      : { success: false, message: 'Room not found' };
  }

 
  createBooking(dto: any) {
    const booking = { id: Date.now(), ...dto, status: 'Booked' };
    this.bookings.push(booking);
    return { 
      success: true, message: 'Room booked successfully',
       data: booking };
  }

 
  updateBooking(id: number, dto: any) {
    const booking = this.bookings.find(b => b.id === id);
    if (!booking) return { success: false, message: 'Booking not found' };

    Object.assign(booking, dto); 
    return { success: true, message: 'Booking updated', data: booking };
  }

  
  cancelBooking(id: number) {
    this.bookings = this.bookings.filter(b => b.id !== id);
    return { success: true, message: 'Booking cancelled' };
  }

  
  getBookingHistory() {
  if (this.bookings.length === 0) {
    return { success: false, message: 'No bookings found' };
  }
  return { success: true, data: this.bookings };
}

  
  makePayment(id: number) {
  const booking = this.bookings.find(b => b.id === id);

  if (!booking) {
    return { success: false, message: 'Booking not found' };
  }

  if (booking.status === 'Paid') {
    return { success: false, message: 'Already paid' };
  }

  booking.status = 'Paid';

  return {
    success: true,
    message: 'Payment successful',
  };
}

 
  addReview(dto: any) {
    return { success: true, message: 'Review Added', data: dto };
  }
}