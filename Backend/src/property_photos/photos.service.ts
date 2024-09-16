import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import {
  property_photos,
  TIPropertyPhotos,
  TSPropertyPhotos,
} from "../drizzle/schema";

export async function servePropertyPhotos(
  propertyId: number
): Promise<null | TSPropertyPhotos[]> {
  return db.query.property_photos.findMany({
    orderBy: property_photos.created_at,
    where: eq(property_photos.property_id, propertyId),
  });
}

export async function createPropertyPhotoService(
  photo: TIPropertyPhotos
): Promise<{ id: number }[] | null> {
  return db.insert(property_photos).values(photo).returning({
    id: property_photos.id,
  });
}
