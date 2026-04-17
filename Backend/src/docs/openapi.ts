export const openAPISpec = {
  openapi: "3.0.0",
  info: {
    title: "Real Estate API",
    version: "1.0.0",
    description:
      "REST API for a real estate platform. Handles authentication, property listings, bookings, notifications, and property photos. Built with Hono.js, Drizzle ORM, and PostgreSQL. Real-time notifications powered by Socket.IO.",
    contact: {
      name: "API Support",
    },
  },
  servers: [
    {
      url: "http://localhost:{port}",
      description: "Local development server",
      variables: {
        port: {
          default: "3000",
          description: "Port from .env PORT variable",
        },
      },
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "JWT token returned from the /login endpoint",
      },
    },
    schemas: {
      // --- Shared ---
      Error: {
        type: "object",
        properties: {
          error: { type: "string", example: "Server error" },
        },
      },
      Message: {
        type: "object",
        properties: {
          message: { type: "string", example: "Operation successful" },
        },
      },

      // --- Auth ---
      RegisterRequest: {
        type: "object",
        required: ["full_name", "email", "contact_phone", "password"],
        properties: {
          full_name: { type: "string", example: "Jane Doe" },
          email: {
            type: "string",
            format: "email",
            example: "jane@example.com",
          },
          contact_phone: { type: "string", example: "+254700000000" },
          password: {
            type: "string",
            minLength: 8,
            example: "Secure@123",
            description:
              "Min 8 chars, must include uppercase, lowercase, number, and special character",
          },
          role: {
            type: "string",
            enum: ["user", "agent", "admin"],
            default: "user",
          },
        },
      },
      RegisterResponse: {
        type: "object",
        properties: {
          token: {
            type: "string",
            example: "a7f3b2c1-...",
            description: "Verification token (UUID) sent to user email",
          },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "jane@example.com",
          },
          password: { type: "string", example: "Secure@123" },
        },
      },
      LoginResponse: {
        type: "object",
        properties: {
          token: {
            type: "string",
            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            description: "JWT token for authenticated requests",
          },
          user: {
            type: "object",
            properties: {
              id: { type: "integer", example: 1 },
              full_name: { type: "string", example: "Jane Doe" },
              email: { type: "string", example: "jane@example.com" },
              contact_phone: { type: "string", example: "+254700000000" },
              role: {
                type: "string",
                enum: ["user", "agent", "admin"],
                example: "user",
              },
              address: { type: "string", example: "Nairobi, Kenya" },
              created_at: {
                type: "string",
                format: "date-time",
                example: "2024-01-01T00:00:00.000Z",
              },
              updated_at: {
                type: "string",
                format: "date-time",
                example: "2024-01-01T00:00:00.000Z",
              },
            },
          },
        },
      },
      ResendVerificationRequest: {
        type: "object",
        required: ["email"],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "jane@example.com",
          },
        },
      },
      ResetPasswordRequest: {
        type: "object",
        required: ["email"],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "jane@example.com",
          },
        },
      },
      SetPasswordRequest: {
        type: "object",
        required: ["password"],
        properties: {
          password: {
            type: "string",
            minLength: 8,
            example: "NewSecure@456",
            description:
              "Min 8 chars, must include uppercase, lowercase, number, and special character",
          },
        },
      },

      // --- Properties ---
      PropertyRequest: {
        type: "object",
        required: [
          "owner_id",
          "title",
          "description",
          "property_type",
          "price_type",
          "price",
          "address",
          "city",
          "area",
          "bedrooms",
          "has_parking",
          "furnished",
          "property_status",
        ],
        properties: {
          owner_id: { type: "integer", example: 5 },
          title: { type: "string", example: "Modern 2BR Apartment in Westlands" },
          description: {
            type: "string",
            example: "Spacious apartment with great city views",
          },
          property_type: {
            type: "string",
            enum: ["apartment", "house", "townhouse", "studio"],
            example: "apartment",
          },
          price_type: {
            type: "string",
            enum: ["monthly", "yearly", "purchase"],
            example: "monthly",
          },
          price: { type: "number", example: 75000 },
          address: { type: "string", example: "123 Westlands Road" },
          city: { type: "string", example: "Nairobi" },
          area: { type: "string", example: "Westlands" },
          bedrooms: { type: "integer", example: 2 },
          has_parking: { type: "boolean", example: true },
          furnished: { type: "boolean", example: false },
          property_status: {
            type: "string",
            enum: ["available", "unavailable", "pending"],
            example: "available",
          },
        },
      },
      Property: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          owner_id: { type: "integer", example: 5 },
          title: { type: "string", example: "Modern 2BR Apartment in Westlands" },
          description: {
            type: "string",
            example: "Spacious apartment with great city views",
          },
          property_type: {
            type: "string",
            enum: ["apartment", "house", "townhouse", "studio"],
          },
          price_type: {
            type: "string",
            enum: ["monthly", "yearly", "purchase"],
          },
          price: { type: "string", example: "75000" },
          address: { type: "string", example: "123 Westlands Road" },
          city: { type: "string", example: "Nairobi" },
          area: { type: "string", example: "Westlands" },
          bedrooms: { type: "string", example: "2" },
          has_parking: { type: "boolean", example: true },
          furnished: { type: "boolean", example: false },
          property_status: {
            type: "string",
            enum: ["available", "unavailable", "pending"],
          },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },
      PropertiesListResponse: {
        type: "object",
        properties: {
          result: {
            type: "array",
            items: { $ref: "#/components/schemas/Property" },
          },
        },
      },

      // --- Bookings ---
      BookingRequest: {
        type: "object",
        required: ["user_id", "property_id", "viewing_date"],
        properties: {
          user_id: { type: "integer", example: 3 },
          property_id: { type: "integer", example: 7 },
          viewing_date: {
            type: "string",
            format: "date-time",
            example: "2025-06-15T10:00:00.000Z",
            description: "Must be a future date",
          },
        },
      },
      BookingUpdateRequest: {
        type: "object",
        properties: {
          viewing_date: {
            type: "string",
            format: "date-time",
            example: "2025-06-20T10:00:00.000Z",
            description: "Provide to reschedule (resets status to 'pending')",
          },
          status: {
            type: "string",
            enum: ["pending", "confirmed", "cancelled"],
            example: "confirmed",
            description:
              "Provide to update booking status (agent confirms or cancels)",
          },
        },
      },
      Booking: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          userId: { type: "integer", example: 3 },
          propertyId: { type: "integer", example: 7 },
          viewing_date: { type: "string", format: "date-time" },
          status: {
            type: "string",
            enum: ["pending", "confirmed", "cancelled"],
          },
          created_at: { type: "string", format: "date-time" },
        },
      },
      BookingsListResponse: {
        type: "object",
        properties: {
          result: {
            type: "array",
            items: { $ref: "#/components/schemas/Booking" },
          },
        },
      },

      // --- Notifications ---
      Notification: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          user_id: { type: "integer", example: 3 },
          message: { type: "string", example: "New booking was made" },
          entity_type: {
            type: "string",
            example: "booking",
            enum: ["booking", "property"],
          },
          entity_id: { type: "integer", example: 5 },
          is_read: { type: "boolean", example: false },
          created_at: { type: "string", format: "date-time" },
        },
      },
      NotificationsListResponse: {
        type: "object",
        properties: {
          result: {
            type: "array",
            items: { $ref: "#/components/schemas/Notification" },
          },
        },
      },

      // --- Photos ---
      PhotoRequest: {
        type: "object",
        required: ["property_id", "photo_url"],
        properties: {
          property_id: { type: "integer", example: 7 },
          photo_url: {
            type: "string",
            example: "https://cdn.example.com/photos/prop7_main.jpg",
          },
        },
      },
      Photo: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          property_id: { type: "integer", example: 7 },
          photo_url: {
            type: "string",
            example: "https://cdn.example.com/photos/prop7_main.jpg",
          },
          created_at: { type: "string", format: "date-time" },
        },
      },
      PhotosListResponse: {
        type: "object",
        properties: {
          result: {
            type: "array",
            items: { $ref: "#/components/schemas/Photo" },
          },
        },
      },
    },
  },

  tags: [
    {
      name: "Auth",
      description:
        "User registration, email verification, login, and password management",
    },
    {
      name: "Properties",
      description: "CRUD operations for property listings",
    },
    {
      name: "Bookings",
      description: "Create and manage property viewing bookings",
    },
    {
      name: "Notifications",
      description: "Real-time notifications for users and agents",
    },
    {
      name: "Property Photos",
      description: "Upload and retrieve property photos",
    },
  ],

  paths: {
    // ======================== AUTH ========================
    "/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        description:
          "Creates a new user account and sends a UUID verification token. The token expires in 1 hour.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "User registered. Verification token returned.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/RegisterResponse" },
              },
            },
          },
          404: {
            description: "Validation failed or unable to register user",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Message" },
              },
            },
          },
          500: {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },

    "/verify-user": {
      post: {
        tags: ["Auth"],
        summary: "Verify user email",
        description:
          "Validates the UUID token sent to the user's email. Token must not be expired.",
        parameters: [
          {
            name: "token",
            in: "query",
            required: true,
            schema: {
              type: "string",
              example: "a7f3b2c1-4e5d-4f6a-8b9c-1d2e3f4a5b6c",
            },
            description: "UUID verification token from registration email",
          },
        ],
        responses: {
          200: {
            description: "User verified successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Message" },
                example: { message: "user verification successful" },
              },
            },
          },
          401: {
            description: "Token has expired",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Message" },
              },
            },
          },
          404: {
            description: "Invalid token",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },

    "/resend-verification": {
      post: {
        tags: ["Auth"],
        summary: "Resend email verification token",
        description:
          "Generates a new verification token and sends it to the provided email.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ResendVerificationRequest",
              },
            },
          },
        },
        responses: {
          200: {
            description: "New token issued",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/RegisterResponse" },
              },
            },
          },
          404: {
            description: "User not found or server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },

    "/login": {
      post: {
        tags: ["Auth"],
        summary: "Login user",
        description:
          "Authenticates a user and returns a JWT token alongside user details (password and account_status excluded).",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Login successful",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginResponse" },
              },
            },
          },
          404: {
            description: "User not found or incorrect password",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Message" },
              },
            },
          },
          500: {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },

    "/reset-password": {
      post: {
        tags: ["Auth"],
        summary: "Request password reset",
        description:
          "Sends a password reset token to the user's email. Token expires in 1 hour.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ResetPasswordRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Reset email sent",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Message" },
                example: { message: "Confirm your email" },
              },
            },
          },
          404: {
            description: "User not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Message" },
              },
            },
          },
        },
      },
    },

    "/set-password": {
      post: {
        tags: ["Auth"],
        summary: "Set new password",
        description:
          "Updates the user's password using the reset token. Token must not be expired.",
        parameters: [
          {
            name: "token",
            in: "query",
            required: true,
            schema: {
              type: "string",
              example: "a7f3b2c1-4e5d-4f6a-8b9c-1d2e3f4a5b6c",
            },
            description: "Password reset token received via email",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SetPasswordRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Password updated successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Message" },
                example: { message: "Password updated successfully" },
              },
            },
          },
          401: {
            description: "Token has expired",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Message" },
              },
            },
          },
          404: {
            description: "Invalid token or validation failed",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },

    // ======================== PROPERTIES ========================
    "/properties": {
      get: {
        tags: ["Properties"],
        summary: "Get all properties",
        description: "Returns a list of all property listings in the platform.",
        responses: {
          200: {
            description: "List of all properties",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PropertiesListResponse" },
              },
            },
          },
          404: {
            description: "No properties found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          500: {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      post: {
        tags: ["Properties"],
        summary: "Create a new property",
        description:
          "Creates a new property listing. When created by an agent, nearby users are notified via Socket.IO. Pass `?id=<adminId>` if an admin is performing this action — the action will be logged.",
        parameters: [
          {
            name: "id",
            in: "query",
            required: false,
            schema: { type: "integer", example: 1 },
            description:
              "Admin ID — include only if an admin is creating the property on behalf of an agent",
          },
        ],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PropertyRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Property created successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Message" },
                example: { message: "Property added successful" },
              },
            },
          },
          404: {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Message" },
              },
            },
          },
          500: {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },

    "/properties/{id}": {
      get: {
        tags: ["Properties"],
        summary: "Get a single property",
        description: "Returns details of a specific property by its ID.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer", example: 7 },
            description: "Property ID",
          },
        ],
        responses: {
          200: {
            description: "Property found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PropertiesListResponse" },
              },
            },
          },
          404: {
            description: "Property not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      put: {
        tags: ["Properties"],
        summary: "Update a property",
        description:
          "Updates property details. Pass any subset of property fields. Pass `?id=<adminId>` to log an admin action.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer", example: 7 },
            description: "Property ID",
          },
          {
            name: "id",
            in: "query",
            required: false,
            schema: { type: "integer", example: 1 },
            description: "Admin ID (optional, for admin action logging)",
          },
        ],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                description:
                  "Any subset of property fields to update",
                properties: {
                  title: { type: "string" },
                  price: { type: "number" },
                  property_status: {
                    type: "string",
                    enum: ["available", "unavailable", "pending"],
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Property updated successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Message" },
              },
            },
          },
          404: {
            description: "Property not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Properties"],
        summary: "Delete a property",
        description:
          "Removes a property listing. Pass `?id=<adminId>` to log an admin action.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer", example: 7 },
            description: "Property ID",
          },
          {
            name: "id",
            in: "query",
            required: false,
            schema: { type: "integer", example: 1 },
            description: "Admin ID (optional)",
          },
        ],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Property deleted successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Message" },
              },
            },
          },
          404: {
            description: "Property not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },

    // ======================== BOOKINGS ========================
    "/bookings": {
      post: {
        tags: ["Bookings"],
        summary: "Create a booking",
        description:
          "Creates a property viewing booking. The property's owner (agent) is notified via Socket.IO. Pass `?id=<adminId>` if an admin is creating the booking.",
        parameters: [
          {
            name: "id",
            in: "query",
            required: false,
            schema: { type: "integer", example: 1 },
            description: "Admin ID (optional)",
          },
        ],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/BookingRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Booking created successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Message" },
                example: { message: "Booking created successfully" },
              },
            },
          },
          404: {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Message" },
              },
            },
          },
          500: {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },

    "/bookings/{id}": {
      get: {
        tags: ["Bookings"],
        summary: "Get user bookings",
        description: "Returns all bookings for a specific user by user ID.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer", example: 3 },
            description: "User ID",
          },
        ],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "List of user bookings",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/BookingsListResponse" },
              },
            },
          },
          404: {
            description: "No bookings found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Message" },
              },
            },
          },
        },
      },
      put: {
        tags: ["Bookings"],
        summary: "Update a booking",
        description:
          "Update booking viewing date (user action — resets status to pending, notifies agent) or update booking status (agent action — notifies user). Pass only one field at a time.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer", example: 1 },
            description: "Booking ID",
          },
          {
            name: "id",
            in: "query",
            required: false,
            schema: { type: "integer", example: 1 },
            description: "Admin ID (optional)",
          },
        ],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/BookingUpdateRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Booking updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Message" },
              },
            },
          },
          404: {
            description: "Booking not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Message" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Bookings"],
        summary: "Delete a booking",
        description: "Permanently removes a booking by its ID.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer", example: 1 },
            description: "Booking ID",
          },
        ],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Booking deleted successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Message" },
                example: { message: "Booking deleted successfully" },
              },
            },
          },
          404: {
            description: "Booking not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Message" },
              },
            },
          },
        },
      },
    },

    // ======================== NOTIFICATIONS ========================
    "/notification/{id}": {
      get: {
        tags: ["Notifications"],
        summary: "Get user notifications",
        description: "Returns all notifications for a specific user.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer", example: 3 },
            description: "User ID",
          },
        ],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "List of notifications",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/NotificationsListResponse",
                },
              },
            },
          },
          404: {
            description: "No notifications found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Message" },
              },
            },
          },
        },
      },
      put: {
        tags: ["Notifications"],
        summary: "Mark notification as read",
        description: "Updates a notification's read status to true.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer", example: 5 },
            description: "Notification ID",
          },
        ],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Notification marked as read",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Message" },
                example: { message: "notification opened" },
              },
            },
          },
          404: {
            description: "Notification not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Message" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Notifications"],
        summary: "Delete a notification",
        description: "Permanently removes a notification by its ID.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer", example: 5 },
            description: "Notification ID",
          },
        ],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Notification deleted",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Message" },
                example: { message: "Notification deleted successfully" },
              },
            },
          },
          404: {
            description: "Notification not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Message" },
              },
            },
          },
        },
      },
    },

    // ======================== PROPERTY PHOTOS ========================
    "property/photos/{id}": {
      get: {
        tags: ["Property Photos"],
        summary: "Get property photos",
        description: "Returns all photos associated with a specific property.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer", example: 7 },
            description: "Property ID",
          },
        ],
        responses: {
          200: {
            description: "List of property photos",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PhotosListResponse" },
              },
            },
          },
          404: {
            description: "Photos not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Message" },
              },
            },
          },
        },
      },
    },

    "property/photos": {
      post: {
        tags: ["Property Photos"],
        summary: "Upload a property photo",
        description:
          "Adds a photo URL to a property. Pass `?id=<adminId>` to log an admin action.",
        parameters: [
          {
            name: "id",
            in: "query",
            required: false,
            schema: { type: "integer", example: 1 },
            description: "Admin ID (optional)",
          },
        ],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PhotoRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Photo added successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Message" },
                example: { message: "Photo added successfully" },
              },
            },
          },
          404: {
            description: "Unable to add photo",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Message" },
              },
            },
          },
        },
      },
    },
  },
};
