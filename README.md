# MSE-343-Milestone-4

# MedScheduler – Hospital OR & Staff Scheduling System

MedScheduler is a role-based scheduling system designed for hospitals to efficiently manage Operating Room (OR) availability, staff schedules, appointments, and alerts. The system provides dedicated dashboards for administrators, nurses, and doctors with clear workflows and strong emphasis on usability, visibility, and clean interface design.

The application allows users to schedule appointments, view OR status in real-time, broadcast alerts, and interact with a modern, responsive calendar that supports day, week, and month views. The UI is intentionally polished and follows human-centered design principles to ensure a seamless experience for first-time and returning users.

# How to Run the Application

Follow the steps below to run the application on your local machine.

## 1. Download or Clone the Project

You may download the ZIP from GitHub and extract it, or clone using this command:

git clone https://github.com/Abhid927/MSE-343-Milestone-4

Then open the project folder.

## 2. Install Node.js

Ensure Node.js version 16 or higher is installed.

Check with this command:

node -v

npm -v

If Node is not installed, download it from: https://nodejs.org

## 3. Navigate Into the Project

Move into the main project folder by typing this in the terminal:

cd Hospital-scheduler

## 4. Install Project Dependencies

Install frontend dependencies and type the following:

cd client

npm install

Install backend dependencies (in a second terminal so split the terminal):

cd server

npm install

## 5. Start the Backend Server

Inside the server folder, type:

node index.js

The backend will start on or a similar URL:

http://localhost:5000

## 6. Start the Frontend (React App)

Inside the client folder, type:

npm run dev

The terminal will show a URL similar to:

http://localhost:5173/

Open this link in your browser.

# Contact

For any issues running the project, feel free to reach out:

Email: a2dikshi@uwaterloo.ca

# Login Accounts

Use any of the following emails to log in.
The password field accepts any value (authentication is mocked for demo purposes).

Admin: 
alice.admin@hospital.com

Nurse: 
nina.nurse@hospital.com

Doctors: 
dan.smith@hospital.com, priya.patel@hospital.com, miguel.rodriguez@hospital.com

# Project Features

• Role-based dashboards (Admin, Nurse, Doctor)

• Modern calendar with day/week/month views

• Appointment creation and editing

• OR rooms with automatic live status updates

• Alerts system with persistent notification panel

• Hover feedback and improved event visibility

• Dedicated “New Appointment” floating button

• Clean, modern login page with gradient design

• Fully improved UI for consistent HCI principles

# Troubleshooting

If errors occur during installation or startup, the following common solutions may help:

• If “npm is not recognized” → Reinstall Node.js

• If the frontend shows a blank screen → reinstall dependencies in the client folder using: npm install

• If the backend does not start, ensure port 5000 is free or restart your terminal

• If the calendar UI looks misaligned, refresh the browser after startup

