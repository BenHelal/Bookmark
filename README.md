# Bookmark Manager

## Overview
Bookmark Manager is a web application that allows users to store, organize, and share their favorite URLs. Users can categorize bookmarks, search through them easily, and even share selected bookmarks publicly.

## Features
- User authentication (Signup/Login)
- Add, edit, and delete bookmarks
- Organize bookmarks into categories
- Tag-based searching and filtering
- Shareable public links for bookmarks
- Import and export bookmarks
- Bookmark analytics (click tracking, usage stats)
- Responsive design for mobile and desktop

## Tech Stack
### Backend:
- **Node.js** + **Express.js** (REST API)
- **MongoDB** (Mongoose for ORM)
- **JWT-based Authentication**
- **Redis** (for caching frequently accessed bookmarks)
- **Swagger** (for API documentation)
- **Jest** (for unit tests)

### Frontend:
- **React.js** / **Next.js**
- **Tailwind CSS**
- **Redux Toolkit** (state management)
- **React Router** (for navigation)

## Installation & Setup
### 1. Clone the Repository:
```sh
git clone https://github.com/your-username/bookmark-manager.git
cd bookmark-manager
```

### 2. Install Dependencies
```sh
npm install  # For backend
```

### 3. Setup Environment Variables
Create a `.env` file in the project root and add the following:
```env
MONGO_URI=mongodb+srv://your_username:your_password@cluster0.mongodb.net/bookmark_manager
PORT=5000
JWT_SECRET=your_secret_key
```

### 4. Start the Server
```sh
npm start  # Runs the backend server
```

### 5. Start the Frontend
```sh
cd client
yarn dev  # Runs the React/Next.js frontend
```

## API Endpoints
| Method | Endpoint | Description |
|--------|---------|-------------|
| **POST** | `/api/auth/signup` | Register a new user |
| **POST** | `/api/auth/login` | Authenticate user & return JWT |
| **POST** | `/api/bookmarks` | Add a new bookmark |
| **GET** | `/api/bookmarks` | Retrieve all bookmarks for the user |
| **GET** | `/api/bookmarks/:id` | Get a specific bookmark |
| **PUT** | `/api/bookmarks/:id` | Update a bookmark |
| **DELETE** | `/api/bookmarks/:id` | Delete a bookmark |
| **GET** | `/api/bookmarks/search?query=xyz` | Search bookmarks by title, tags, or category |
| **POST** | `/api/bookmarks/import` | Import bookmarks from a browser export |
| **GET** | `/api/bookmarks/export` | Export bookmarks as JSON or CSV |
| **POST** | `/api/bookmarks/share/:id` | Generate a public shareable link |
| **GET** | `/api/bookmarks/shared/:id` | Access a shared bookmark |

## Deployment
- Backend: AWS / Vercel / Heroku
- Frontend: Vercel / Netlify
- Database: MongoDB Atlas
- CI/CD: GitHub Actions

## License
This project is licensed under the MIT License.

