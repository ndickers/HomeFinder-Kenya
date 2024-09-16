import { Hono } from "hono";
import {
  createBooking,
  deleteBooking,
  getUserBookings,
  updateBooking,
} from "./booking.controller";

export const bookingRoutes = new Hono();

bookingRoutes.post("/bookings", createBooking);

bookingRoutes.put("/bookings/:id", updateBooking);

bookingRoutes.get("/bookings/:id", getUserBookings);

bookingRoutes.delete("/bookings/:id", deleteBooking);
