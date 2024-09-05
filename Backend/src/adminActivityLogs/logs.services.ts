import db from "../drizzle/db";
import { TIAdminLogs, admin_activity_log } from "./../drizzle/schema";

export async function createAdminLogs(
  logsDetails: TIAdminLogs
): Promise<{ id: number }[] | null> {
  return db
    .insert(admin_activity_log)
    .values(logsDetails)
    .returning({ id: admin_activity_log.id });
}
