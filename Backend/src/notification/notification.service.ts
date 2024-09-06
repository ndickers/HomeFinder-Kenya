import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import {
  notification,
  TINotification,
  TSNotification,
} from "../drizzle/schema";

export async function createNotificationService(
  notifyDetails: TINotification[]
): Promise<{ id: number }[] | null> {
  return await db
    .insert(notification)
    .values(notifyDetails)
    .returning({ id: notification.id });
}

export async function getUserNotificationService(
  userId: number
): Promise<TSNotification[] | null> {
  return await db
    .select()
    .from(notification)
    .where(eq(notification.user_id, userId))
    .orderBy(notification.created_at);
}

export async function updateNotificationService(
  id: number,
  updateDetails: TINotification
) {
  return await db
    .update(notification)
    .set(updateDetails)
    .where(eq(notification.id, id))
    .returning({ id: notification.id });
}

export async function deleteNotificationService(
  id: number
): Promise<{ id: number }[] | null> {
  return await db
    .delete(notification)
    .where(eq(notification.id, id))
    .returning({ id: notification.id });
}
