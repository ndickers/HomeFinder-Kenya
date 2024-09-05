import db from "../drizzle/db";
import { notification, TINotification } from "../drizzle/schema";

export async function createNotificationService(
  notifyDetails: TINotification
): Promise<{ id: number }[] | null> {
  return db
    .insert(notification)
    .values(notifyDetails)
    .returning({ id: notification.id });
}
