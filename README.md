
# **HomeFinder Kenya**

Welcome to **HomeFinder Kenya** – a web application designed to help users easily find rental properties across Kenya. Whether you're searching for a new home or managing property listings, HomeFinder provides a seamless experience.

## **Table of Contents**

- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [User Roles](#user-roles)
- [Contributing](#contributing)

## **Project Overview**

HomeFinder Kenya is a platform that connects property seekers with available rental properties. Users can search for properties, book viewings, and manage their accounts, while property owners and agents can list and manage properties.

## **Features**

- **User Authentication**
  - Secure registration and login with email verification.
  
- **Property Search**
  - Advanced search filters by location, price, property type, and amenities.
  - View properties in list or map view.
  
- **Property Listings**
  - Add and manage property listings with images and detailed descriptions.
  - Verified property status for trustworthy listings.
  
- **Booking System**
  - Schedule viewings and manage bookings.
  
- **Admin Dashboard**
  - Manage users, properties, and track admin activities.

## **Technology Stack**

- **Frontend:** React.js, Tailwind CSS, Redux Toolkit
- **Backend:** Node.js, Hono Framework, Drizzle ORM
- **Database:** PostgreSQL
- **Authentication:** JSON Web Tokens (JWT)
- **Optional Payments:** Stripe

## **Getting Started**

### **Prerequisites**

- Node.js (v14+)
- PostgreSQL

### **Installation**

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/homefinder-kenya.git
   cd homefinder-kenya
   ```

2. **Frontend Setup:**

   Navigate to the `frontend` directory and install dependencies:

   ```bash
   cd frontend
   npm install
   ```

   Start the development server:

   ```bash
   npm start
   ```

3. **Backend Setup:**

   Navigate to the `backend` directory and install dependencies:

   ```bash
   cd backend
   npm install
   ```

   Set up your PostgreSQL database and update the `.env` file with your credentials.

   Run database migrations:

   ```bash
   npm run migrate
   ```

   Start the backend server:

   ```bash
   npm run dev
   ```

## **API Documentation**

### **User Authentication**

- `POST /register`: Register a new user.
- `POST /login`: Log in and receive a JWT token.
- `POST /verify-email`: Verify a user's email with a token.

### **Property Management**

- `GET /properties`: Get all properties with filters.
- `POST /properties`: Create a new property listing.
- `PUT /properties/:id`: Update a property listing.
- `DELETE /properties/:id`: Delete a property listing.

### **Booking Management**

- `POST /bookings`: Book a viewing for a property.
- `GET /bookings`: Get all bookings for a user.

### **Admin Activity Logs**

- `GET /admin/logs`: Retrieve admin activity logs.

## **User Roles**

- **Admin:** Full control over the platform, including managing users, properties, and bookings.
- **Agent:** Can manage property listings and confirm bookings.
- **User:** Can search for properties, book viewings, and manage their profile.

## **Contributing**

We welcome contributions to HomeFinder Kenya! To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add feature'`).
4. Push to your branch (`git push origin feature/your-feature`).
5. Open a Pull Request.
