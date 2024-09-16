import { Hono } from "hono";
import { createPropertyPhotos, getPropertyPhotos } from "./photos.controller";

export const propertyPhotosRoutes = new Hono();

propertyPhotosRoutes.get("property/photos/:id", getPropertyPhotos);

propertyPhotosRoutes.post("property/photos", createPropertyPhotos);
