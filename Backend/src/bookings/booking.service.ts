import { status, TSBooking } from "./../drizzle/schema";
import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { bookings, TIBooking } from "../drizzle/schema";

export async function serveUserBooking(
  id: number
): Promise<TSBooking[] | null> {
  return db.query.bookings.findMany({
    where: eq(bookings.user_id, id),
  });
}

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
  details: { viewing_date: Date; status: string } | { status: string }
): Promise<{ id: number; propertyId: number; userId: number }[] | null> {
  return await db
    .update(bookings)
    .set(details as TIBooking)
    .where(eq(bookings.id, id))
    .returning({
      id: bookings.id,
      propertyId: bookings.property_id,
      userId: bookings.user_id,
    });
}

export async function deleteBookingService(
  id: number
): Promise<{ id: number }[] | null> {
  return await db
    .delete(bookings)
    .where(eq(bookings.id, id))
    .returning({ id: bookings.id });
}
