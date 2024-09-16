import { Context, Hono, Next } from "hono";
import { authRoutes } from "./auth/auth.routes";
import { propertiesRoutes } from "./properties/properties.routes";
import { serve } from "@hono/node-server";
import { Server } from "socket.io";
import "dotenv/config";
import { notificationRoutes } from "./notification/notification.routes";
import { bookingRoutes } from "./bookings/booking.routes";
import { propertyPhotosRoutes } from "./property_photos/photos.routes";

const app = new Hono();

const server = serve({ fetch: app.fetch, port: Number(process.env.PORT) });

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL as string,
  },
});

io.on("connection", (socket) => {
  console.log("socket connected");

  socket.on("locationRoom", (location) => {
    socket.join(location);
    console.log(`user joined location room ${location}`);
  });

  socket.on("agentRoom", (agent) => {
    socket.join(agent);
    console.log("agent joined the room");
  });

  socket.on("userRoom", (user) => {
    socket.join(user);
    console.log("user joined the room");
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });
});

//passing socket to handlers
app.use(async (c: Context, next: Next) => {
  c.set("io", io);
  await next();
});
app.route("/", authRoutes);
app.route("/", notificationRoutes);
app.route("/", propertiesRoutes);
app.route("/", bookingRoutes);
app.route("/", propertyPhotosRoutes);
console.log(`Server is running on port ${process.env.PORT}`);
