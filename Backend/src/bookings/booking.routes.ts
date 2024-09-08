import { Hono } from "hono";
import { createBooking, updateBooking } from "./booking.controller";

export const bookingRoutes = new Hono();

bookingRoutes.post("/bookings", createBooking);

bookingRoutes.put("/bookings/:id", updateBooking);
