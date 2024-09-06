import { Hono } from "hono";
import { getUserNotification } from "./notification.controller";

export const notificationRoutes = new Hono();

notificationRoutes.get("/notification/:id", getUserNotification);
