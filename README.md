# SongPlaylistProject
<img width="1562" height="1052" alt="Screenshot 2025-09-02 at 2 06 18 PM" src="https://github.com/user-attachments/assets/8e2b9b8e-5e4a-4761-9624-e1911ff7ae7b" />

This project is a simple application that allows users to create a playlist and add songs based on the artist name and the title of their songs.

## 🏗️ Project Structure
```
music-playlist-app/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Playlist.js
│   │   └── Song.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── playlists.js
│   │   └── songs.js
│   ├── middleware/
│   │   └── auth.js
│   ├── config/
│   │   └── db.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── auth.js
│   │   ├── dashboard.js
│   │   └── playlist.js
│   ├── index.html
│   ├── login.html
│   ├── signup.html
│   └── dashboard.html
└── README.md
├── sample-songs.js
```

## Features
- ☑️ Authentication(User Sign in && Sign Up)
- ▶️ Playlist Management: Create, edit, and delete songs
- 𝌮 Responsive UI
- ➕ Add songs from Recommended List
- 📢 Add customs songs

## Design Choice
I chose this tech stack and design for this project because there were many more resources and a lot more people use this tech stack for projects. This made it easier for me to get help from online sources, such as Stack Overflow, when I encountered a block or challenge during my development sessions.

## Tech Stack
- **Frontend:** HTML, CSS, and JavaScript
- **Backend:** NodeJS, ExpressJS
- **Database:** MongoDB

## Installation and Setup
**Pre-requisite**
Ensure the following are installed
- Node.js v22.0.0 or higher
- npm v10.0.0 or higher
- MongoDB Atlas account (free tier)

**1. Clone the Repository**
```
git clone https://github.com/niiadu/SongPlaylistProject-DLBCSPJWD01.git
cd SongPlaylistProject-DLBCSPJWD01
```

**2. Environment Setup**

Create a .env file in backend/ with the following requirements
```
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET="your-secret"
PORT=2000
```
**Set up your MongoDB Atlas Connection**
1. Sign up on <a href="https://www.mongodb.com/products/platform">MongoDB Atlas Account</a>
2. Create a new Cluster.
3. Atlas allows access from your computer IP. You have an option to allow access from anywhere
4. Go to Database Access → Add Database User
5. Go to Network Access → Add IP Address (add 0.0.0.0/0 for all IPs)
6. Go to Clusters → Connect → Choose Drivers
7. Copy the connection string under **Add your connection string into your application code**
8. Go to the .env file in your backend/ and paste it after **MONGO_URI=**

**3. Backend Setup**
```
cd backend/
npm install
```

**4. Recommended Song Setup**

Go back to the main directory **SongPlaylistProject-DLBCSPJWD01** from the backend directory.
To run a script to populate the database with the recommended songs
```
cd ../
npm install mongoose
npm install dotenv
npm install
node sample-songs.js
```

**5. Start Application**
```
cd backend/
npm run dev
```
The application should be accessible on http://localhost:2000
