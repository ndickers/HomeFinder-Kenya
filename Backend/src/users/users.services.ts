import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { users } from "../drizzle/schema";

export async function serveUsersOfSpecificLocation(
  location: string
): Promise<{ id: number }[] | null> {
  return db.query.users.findMany({
    columns: {
      id: true,
    },
    where: eq(users.address, location),
  });
}
