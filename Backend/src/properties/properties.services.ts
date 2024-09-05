import {
  admin_activity_log,
  properties,
  property_photos,
  TIAdminLogs,
  TIProperties,
  TSProperties,
  users,
} from "./../drizzle/schema";
import db from "../drizzle/db";
import { eq } from "drizzle-orm";

type TSPropertiesWithoutOwnerId = Omit<TSProperties, "owner_id">;

type TINewProperty = Omit<
  TIProperties,
  "id" | "updated_at" | "listed_at" | "verified"
>;

export async function serveAllProperties(): Promise<
  null | TSPropertiesWithoutOwnerId[]
> {
  return db.query.properties.findMany({
    columns: {
      owner_id: false,
    },
    with: {
      property_photos: true,
    },
    orderBy: properties.listed_at,
  });
}

export async function serveAgentProperties(
  userId: number
): Promise<TSPropertiesWithoutOwnerId[] | null> {
  return db.query.properties.findMany({
    columns: {
      owner_id: false,
    },
    with: {
      property_photos: true,
    },
    orderBy: properties.listed_at,
    where: eq(properties.owner_id, userId),
  });
}

export async function createPropertyService(
  propertyDetails: any
): Promise<
  | { id: number; ownerId: number; propertyName: string; location: string }[]
  | null
> {
  return db.insert(properties).values(propertyDetails).returning({
    id: properties.id,
    ownerId: properties.owner_id,
    propertyName: properties.title,
    location: properties.address,
  });
}

export async function updatePropertyService(
  id: number,
  details: TIProperties
): Promise<{ id: number }[] | null> {
  return await db
    .update(properties)
    .set(details)
    .where(eq(properties.id, id))
    .returning({ id: properties.id });
}

export async function deletePropertyService(
  id: number
): Promise<{ id: number }[] | null> {
  return await db
    .delete(properties)
    .where(eq(properties.id, id))
    .returning({ id: properties.id });
}
