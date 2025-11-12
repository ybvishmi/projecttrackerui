# Research Project Tracker - Frontend

This is the **React + TypeScript** frontend for the Research Project Tracker system.  
It connects with the Spring Boot backend to manage projects, milestones, and documents with role-based access and JWT authentication.

## Features

- User authentication (Sign Up / Login) with JWT
- Project list and details
- Milestone management
- Document upload and management
- Role-based access (Admin, PI, Member)
- Responsive UI using Bootstrap

## Tech Stack

- React + TypeScript
- React Router (SPA navigation)
- Axios (API calls)
- Context API (Global state & auth)
- Bootstrap (Responsive design)

## Getting Started

1. Clone the repo:
   ```bash
   git clone https://github.com/your-username/research-tracker-frontend.git
   cd research-tracker-frontend
Install dependencies:

bash
Copy code
npm install
Run the development server:

bash
Copy code
npm start
Open http://localhost:3000 in your browser.

Folder Structure
src/components → Reusable UI components

src/pages → Page components (Login, Projects, Milestones, Documents)

src/context → Authentication & global state

src/api → Axios API setup

Usage
Login using your account

Navigate to Projects, Milestones, or Documents

Only Admin users can access the Admin panel
