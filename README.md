🎓 Campus Placement Tracker

A full-stack campus placement management system that helps students track job applications, enables admins to manage company postings, and streamlines the overall placement workflow.

Built using React, Node.js, Express, and MongoDB, with secure authentication and role-based access.

🌟 Why This Project?

Campus placement processes are often fragmented and difficult to track.
This project provides a centralized platform where:

Students can view companies and track applications

Admins can manage companies and student applications

The entire placement flow is secure, structured, and scalable

🧩 Tech Stack
Frontend

React.js

Tailwind CSS

JavaScript (ES6+)

Axios

Backend

Node.js

Express.js

RESTful APIs

Database

MongoDB

Mongoose

Authentication & Security

JWT (JSON Web Tokens)

Protected routes

Environment variables

✨ Core Features
👨‍🎓 Student Features

Register & login securely

View available companies

Apply to companies

Track applied applications

🏢 Admin Features

Add and manage companies

View student applications

Control application flow

Secure admin-only routes

🔐 Security

JWT-based authentication

Role-based access control

Sensitive data protected via .env

📁 Project Structure
campus-placement-tracker/
│
├── frontend/        # React application
├── backend/         # Node + Express API
│
├── .gitignore
├── README.md

⚙️ Environment Variables

Create a .env file inside the backend folder:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000


Note: Environment files are excluded from version control for security.

▶️ Run Locally
Backend
cd backend
npm install
npm run dev

Frontend
cd frontend
npm install
npm run dev


Frontend and backend run independently during development.

🔗 API Overview (Sample)
Method	Endpoint	Description
POST	/api/auth/register	Register user
POST	/api/auth/login	Login user
GET	/api/companies	Fetch companies
POST	/api/applications	Apply for a company
🌍 Deployment

Frontend: Vercel

Backend: Render

Database: MongoDB Atlas

Deployment steps will be added after hosting.

🚧 Future Improvements

Resume upload and management

Email notifications

Placement analytics dashboard

Multi-role support (HR, Placement Cell)

Mobile responsiveness improvements

👨‍💻 Author

Anmol Gupta
Bachelor of Engineering – Information Technology
Full-Stack Developer

GitHub: (add link)

LinkedIn: (add link)

📄 License

This project is created for learning and educational purposes.
