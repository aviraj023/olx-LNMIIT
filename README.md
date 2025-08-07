# OLX LNMIIT

olx LNMIIT is a full-stack web application built for students of LNMIIT to buy and sell used items within the campus. Inspired by OLX, this marketplace makes it easy and safe for students to connect and trade directly with each other.

## Features

- User Authentication (Login, Signup with JWT and cookie-based auth)
- Add Items with title, description, image, category, price, and condition
- View Items by categories (books, electronics, etc.)
- Item Details Page with owner contact information
- My Profile Page to manage listed items (edit/delete)
- Image Upload using file input and sharp library for latency optimization
- Fully responsive UI built with React and Tailwind

## Tech Stack

Frontend:
- React.js
- Redux Toolkit
- Tailwind CSS
- Axios

Backend:
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication

## Installation

Clone the repository
cd backend
npm install

Create a .env file in the backend directory:
PORT=5000
MONGO_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

Start server:
npm start

Frontend Setup:
cd ../frontend
npm install
npm start

#Author
Aviraj Vijay Deshmukh
