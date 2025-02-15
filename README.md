Here’s a comprehensive `README.md` file tailored to your project. It includes instructions for setting up and running the project locally, an overview of the architecture and design decisions.

---

# Task Management Application

This is a full-stack task management application built with Next.js, React, and MongoDB. It allows users to create, update, delete, and view tasks with features like search, filtering, and sorting. The application also includes user authentication and toast notifications for a seamless user experience.

---

## Table of Contents

1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Setup and Installation](#setup-and-installation)
4. [Project Architecture](#project-architecture)
5. [Design Decisions](#design-decisions)

---

## Features

- **User Authentication**: Users can sign up, log in, and log out. Authentication is handled using JSON Web Tokens (JWT).
- **Task Management**:
  - Create, update, and delete tasks.
  - Mark tasks as completed or pending.
  - Search tasks by title or description.
  - Filter tasks by status (pending/completed).
  - Sort tasks by title, date, or status.
- **Responsive Design**: The application is fully responsive and works seamlessly on all devices.
- **Toast Notifications**: Users receive visual feedback for actions like adding, updating, or deleting tasks.

---

## Technologies Used

- **Frontend**:
  - Next.js (App Router)
  - React
  - Tailwind CSS (for styling)
  - React Toastify (for toast notifications)
- **Backend**:
  - Next.js API Routes
  - MongoDB (for database)
  - Mongoose (for MongoDB object modeling)
- **Authentication**:
  - JSON Web Tokens (JWT)
  - bcrypt (for password hashing)
- **Deployment**:
  - Vercel (for hosting)
  - MongoDB Atlas (for cloud database)

---

## Setup and Installation

Follow these steps to set up and run the project locally:

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- MongoDB Atlas account (or a local MongoDB instance)

### Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/NeerajaGurram/todolist.git
   cd todolist
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env.local` file in the root directory and add the following variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Run the Application**:
   ```bash
   npm run dev
   ```

5. **Access the Application**:
   Open your browser and navigate to `http://localhost:3000`.

---

## Project Architecture

The project follows a modular and scalable architecture:

### Frontend
- **Pages**:
  - `home`: Displays the list of tasks with search, filter, and sort functionality.
  - `add-task`: Allows users to create a new task.
  - `edit-task/[id]`: Allows users to update an existing task.
  - `profile`: Displays and updates user profile information.
- **Components**:
  - Reusable UI components like buttons, inputs, and task cards.
- **State Management**:
  - React's `useState` and `useEffect` hooks for managing local state.

### Backend
- **API Routes**:
  - `/api/auth`: Handles user authentication (signup, login, profile).
  - `/api/tasks`: Handles CRUD operations for tasks.
- **Database**:
  - MongoDB is used to store user and task data.
  - Mongoose schemas define the structure of the data.

### Authentication
- JWT is used for secure user authentication.
- Passwords are hashed using bcrypt before storing them in the database.

---

## Design Decisions

1. **Next.js App Router**:
   - The App Router is used for routing, which provides better performance and flexibility compared to the Pages Router.
   - API routes are colocated with the frontend for better organization.

2. **Tailwind CSS**:
   - Tailwind CSS is used for styling due to its utility-first approach, which makes it easy to build responsive and consistent UIs.

3. **React Toastify**:
   - Toast notifications are used to provide immediate feedback to users for actions like adding, updating, or deleting tasks.

4. **MongoDB Atlas**:
   - MongoDB Atlas is used as the cloud database for its scalability and ease of use.

5. **Modular Code Structure**:
   - The code is organized into reusable components and modules, making it easy to maintain and extend.

---


## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Feel free to explore the code and contribute to the project! If you have any questions or feedback, please open an issue on GitHub.

---

This `README.md` file provides a clear and concise overview of your project, making it easy for reviewers and contributors to understand and work with your code. Let me know if you need further adjustments! 🚀
