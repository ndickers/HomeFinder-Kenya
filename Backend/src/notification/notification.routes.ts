import { Hono } from "hono";
import {
  deleteNotification,
  getUserNotification,
  updateNotificationToRead,
} from "./notification.controller";

export const notificationRoutes = new Hono();

notificationRoutes.get("/notification/:id", getUserNotification);

notificationRoutes.put("/notification/:id", updateNotificationToRead);
notificationRoutes.delete("/notification/:id", deleteNotification);
