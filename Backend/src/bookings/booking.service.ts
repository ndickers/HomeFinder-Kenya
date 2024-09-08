import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { bookings, TIBooking } from "../drizzle/schema";

export async function createBookingService(
  bookingDetails: TIBooking
): Promise<{ id: number; propertyId: number }[] | null> {
  return db.insert(bookings).values(bookingDetails).returning({
    id: bookings.id,
    propertyId: bookings.property_id,
  });
}

export async function updateBookingService(
  id: number,
  details: { viewing_date: Date }
): Promise<{ id: number; propertyId: number; userId: number }[] | null> {
  return await db
    .update(bookings)
    .set(details)
    .where(eq(bookings.id, id))
    .returning({
      id: bookings.id,
      propertyId: bookings.property_id,
      userId: bookings.user_id,
    });
}
