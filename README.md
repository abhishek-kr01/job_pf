# Job Application Portal – AImploy Assignment

This is a full-stack web application built as a take-home assignment for the Full Stack Intern role at AImploy. It allows candidates to submit their job application, upload a resume, and answer a behavioral question with text and optional audio/video input.

---

## Features

### Candidate Details
- Collects Name, Email, and Phone Number
- Simple text input fields

### Resume Upload
- Accepts PDF, TXT, and DOCX formats
- Stores files securely on the server

### Behavioral Question
- Displays: _“Why are you interested in joining this organisation?”_
- Candidates can answer via:
  - Text
  - Optional audio or video file

---

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js, Multer
- **Database**: MongoDB

---

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/abhishek-kr01/job_pf.git
cd job_pf

Install Dependencies
Frontend:
cd client
npm install

Backend:
cd ../server
npm install

Environment Variables
Create a .env file inside the server/ directory with the following:
# Server configuration
PORT=5000
NODE_ENV=development

# MongoDB connection
MONGO_URI=mongodb://localhost:27017/job_applications

# Application settings
MAX_FILE_SIZE=10485760

Make sure MongoDB is running locally.

Run the Application
Start the Backend Server
cd server
node server.js or nodemon server.js

Start the Frontend
cd client
npm run dev
```

Folder Structure

JOB_PF/client/     → React frontend (Vite)

JOB_PF/server/     → Express backend with MongoDB

File Uploads
Uploaded resumes is saved in the server/uploads/ directory.

Notes
This app runs locally and is not deployed.

Deployment can be added later using Vercel (frontend) and Render/Railway (backend).

Author
Abhishek Kumar
Email: abhishekmdp11@gmail.com
