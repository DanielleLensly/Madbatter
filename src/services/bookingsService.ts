// Bookings Service — CRUD operations via Supabase
import { supabase } from '../utils/supabaseClient';

export interface Booking {
  id: string;
  name: string;
  phone: string;
  email?: string;
  eventDate: string;
  description: string;
  status: string;
  submittedAt: string;
}

// Helper: convert DB row to Booking type
const rowToBooking = (row: any): Booking => ({
  id: row.id,
  name: row.name,
  phone: row.phone,
  email: row.email || undefined,
  eventDate: row.event_date,
  description: row.description,
  status: row.status || 'pending',
  submittedAt: row.submitted_at
});

// Get all bookings (for admin view)
export const getBookings = async (): Promise<Booking[]> => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('submitted_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(rowToBooking);
};

// Submit a new booking (from the public form)
export const submitBooking = async (booking: {
  name: string;
  phone: string;
  email?: string;
  date: string;
  description: string;
}): Promise<Booking> => {
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      name: booking.name,
      phone: booking.phone,
      email: booking.email || null,
      event_date: booking.date,
      description: booking.description,
      status: 'pending'
    })
    .select()
    .single();

  if (error) throw error;
  return rowToBooking(data);
};

// Update booking status (admin)
export const updateBookingStatus = async (id: string, status: string): Promise<void> => {
  const { error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', id);

  if (error) throw error;
};

// Delete a booking (admin)
export const deleteBookingFromDb = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
