import { relations } from "drizzle-orm";
import {
  pgTable,
  serial,
  text,
  varchar,
  index,
  pgEnum,
  timestamp,
  numeric,
  boolean,
  integer,
} from "drizzle-orm/pg-core";

export const status = pgEnum("account_status", [
  "verified",
  "unverified",
  "banned",
]);
export const role = pgEnum("role", ["user", "admin", "agent"]);
export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    full_name: varchar("full_name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).unique().notNull(),
    password: varchar("password", { length: 255 }).notNull(),
    contact_phone: varchar("contact_phone", { length: 20 }).notNull(),
    role: role("role").default("user"),
    account_status: status("account_status").default("unverified"),
    address: text("address"),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    emailIndex: index("idx_users_email").on(table.email),
    phoneIndex: index("idx_users_contact_phone").on(table.contact_phone),
  })
);

export const usersRelations = relations(users, ({ many }) => ({
  verification_tokens: many(verification_tokens),
  properties: many(properties),
  notification: many(notification),
}));

export const verification_tokens = pgTable("verification_tokens", {
  token_id: serial("token_id").primaryKey(),
  user_id: integer("user_id")
    .notNull()
    .references(() => users.id),
  token: varchar("token").notNull(),
  expires_at: timestamp("expires_at").notNull(),
  created_at: timestamp("updated_at").defaultNow(),
});
export const verificationRelations = relations(
  verification_tokens,
  ({ one }) => ({
    users: one(users, {
      fields: [verification_tokens.user_id],
      references: [users.id],
    }),
  })
);

export const propertyType = pgEnum("property_type", [
  "apartment",
  "house",
  "townhouse",
  "studio",
]);

export const propertyStatus = pgEnum("property-status", [
  "available",
  "unavailable",
  "pending",
]);
export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  owner_id: integer("owner_id")
    .notNull()
    .references(() => users.id),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  property_type: propertyType("property_type").notNull(),
  price: numeric("price").notNull(),
  address: varchar("address").notNull(),
  city: varchar("city").notNull(),
  area: varchar("area").notNull(),
  bedrooms: numeric("bedrooms").notNull(),
  has_parking: boolean("has_parking").notNull(),
  furnished: boolean("furnished").notNull(),
  listed_at: timestamp("listed_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  status: propertyStatus("status").default("available"),
  verified: boolean("verified").notNull(),
});
export const propertiesRelations = relations(properties, ({ one, many }) => ({
  users: one(users, {
    fields: [properties.owner_id],
    references: [users.id],
  }),
  property_photos: many(property_photos),
  bookings: many(bookings),
}));

export const property_photos = pgTable("property_photos", {
  id: serial("id").primaryKey(),
  property_id: integer("property_id")
    .notNull()
    .references(() => properties.id),
  photo_url: text("photo_url").notNull(),
  property_type: propertyType("property_type").notNull(),
  is_primary: boolean("is_primary").default(false).notNull(),
  created_at: timestamp("updated_at").defaultNow(),
});
export const propertyPhotosRelations = relations(
  property_photos,
  ({ one }) => ({
    properties: one(properties, {
      fields: [property_photos.property_id],
      references: [properties.id],
    }),
  })
);

export const bookingStatus = pgEnum("status", [
  "confirmed",
  "pending",
  "canceled",
]);

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id")
    .notNull()
    .references(() => users.id),
  property_id: integer("property_id")
    .notNull()
    .references(() => properties.id),
  booking_date: timestamp("booking_date").defaultNow(),
  viewing_date: timestamp("viewing_date").defaultNow(),
  status: bookingStatus("status").default("pending"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const bookingRelations = relations(bookings, ({ one }) => ({
  users: one(users, {
    fields: [bookings.user_id],
    references: [users.id],
  }),
  properties: one(properties, {
    fields: [bookings.property_id],
    references: [properties.id],
  }),
}));

export const entityAction = pgEnum("entity_action", [
  "create",
  "update",
  "delete",
  "approve",
  "reject",
  "confirm",
  "cancel",
  "login",
  "logout",
  "resolve",
  "assign",
  "send_notification",
]);

export const entityType = pgEnum("entity_type", [
  "property",
  "booking",
  "user",
  "payment",
  "notification",
  "agent",
  "admin",
  "report",
  "support_ticket",
]);

export const admin_activity_log = pgTable("admin_activity_log", {
  id: serial("id").primaryKey(),
  admin_id: integer("user_id")
    .notNull()
    .references(() => users.id),
  entity_action: entityAction("entity_action"),
  entity_type: entityType("entity_type"),
  entity_id: numeric("entity_id").notNull(),
  description: text("description").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export const adminLogRelations = relations(admin_activity_log, ({ many }) => ({
  users: many(users),
}));

export const notificationEntityType = pgEnum("entity_type", [
  "property",
  "booking",
  "user",
  "payment",
  "support_ticket",
]);

export const notification = pgTable("notification", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull(),
  message: text("message").notNull(),
  read_status: boolean("read_status").default(false).notNull(),
  entity_type: notificationEntityType("entity_type").notNull(),
  entity_id: numeric("entity_id").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export const notificationRelations = relations(notification, ({ one }) => ({
  users: one(users, {
    fields: [notification.user_id],
    references: [users.id],
  }),
}));

export type TSToken = typeof verification_tokens.$inferSelect;
export type TIToken = typeof verification_tokens.$inferInsert;
