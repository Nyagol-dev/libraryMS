# Library Management System

A modern, full-stack Library Management System built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring beautiful UI with Tailwind CSS v3.4.17.

## Features

### For Users
- **Authentication**: Simple JWT-based login and registration
- **Book Discovery**: Browse and search through the library catalog
- **Book Requests**: Request books with easy approval workflow
- **Transaction History**: View your borrowing history and current issues
- **Profile Management**: Update personal information and view library stats
- **Real-time Updates**: Socket.IO integration for live notifications

### For Admins
- **User Management**: View and manage all library users
- **Book Management**: Add, edit, and delete books from the catalog
- **Transaction Management**: Approve/reject book requests and manage returns
- **Dashboard Analytics**: Overview of library statistics and activity
- **Real-time Monitoring**: Live updates on system activity

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Socket.IO** - Real-time communication
- **bcryptjs** - Password hashing

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS v3.4.17** - Styling framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn** package manager

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/PLP-MERN-Stack-Development/libraryMS.git
cd libraryMS
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit the .env file with your configuration:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/library-management
# JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
# NODE_ENV=development

# Start the backend server
npm start
```

The backend server will start on http://localhost:5000

### 3. Frontend Setup

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file (optional)
# Create a .env file in the frontend directory with:
# VITE_API_URL=http://localhost:5000/api
# VITE_APP_NAME=Library Management System

# Start the frontend development server
npm run dev
```

The frontend development server will start on http://localhost:5173

### 4. Database Setup

If you're using local MongoDB:

```bash
# Start MongoDB service (Ubuntu/Debian)
sudo systemctl start mongod

# Or using MongoDB directly
mongod
```

For MongoDB Atlas:
1. Create a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get your connection string
3. Update the `MONGODB_URI` in your backend `.env` file

## Demo Accounts

The application includes demo accounts for testing:

### Admin Account
- **Email**: admin@library.com
- **Password**: admin123

### User Account
- **Email**: user@library.com
- **Password**: user123

## Project Structure

```
library-management-system/
├── backend/
│   ├── controllers/         # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── server.js          # Express server setup
│   └── package.json
├── frontend/
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Application pages
│   │   ├── services/      # API services
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # App entry point
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Books
- `GET /api/books` - Get all books (paginated)
- `GET /api/books/:id` - Get specific book
- `POST /api/books` - Add new book (admin only)
- `PUT /api/books/:id` - Update book (admin only)
- `DELETE /api/books/:id` - Delete book (admin only)
- `GET /api/books/search` - Search books

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/transactions` - Get user transactions
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get specific user (admin only)
- `PUT /api/users/:id` - Update user (admin only)

### Transactions
- `GET /api/transactions` - Get all transactions (admin only)
- `POST /api/transactions/request` - Request book
- `PUT /api/transactions/:id/status` - Update transaction status (admin only)
- `POST /api/transactions/return` - Return book
- `PUT /api/transactions/:id/complete` - Complete return (admin only)

## Development

### Backend Development

```bash
cd backend

# Run in development mode with auto-restart
npm run dev

# Run in production mode
npm start
```

### Frontend Development

```bash
cd frontend

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## Styling with Tailwind CSS

This project uses Tailwind CSS v3.4.17 with a custom configuration:

- **Primary Colors**: Custom blue palette defined in `tailwind.config.js`
- **Components**: Pre-built component classes like `.btn`, `.card`, `.input`
- **Responsive Design**: Mobile-first responsive design throughout
- **Dark Mode**: Ready for dark mode implementation
- **Custom Fonts**: Inter font family integration

### Custom CSS Classes

```css
/* Buttons */
.btn-primary    /* Primary button styling */
.btn-secondary  /* Secondary button styling */

/* Components */
.card          /* Card container styling */
.input         /* Form input styling */
```

## Features in Detail

### Authentication System
- JWT-based authentication
- Password hashing with bcryptjs
- Protected routes and role-based access control
- Automatic token refresh handling

### Book Management
- Complete CRUD operations for books
- Search functionality with multiple criteria
- Availability tracking and copy management
- Book request and approval workflow

### User Management
- User profiles with editable information
- Transaction history tracking
- Role-based permissions (admin/user)
- Real-time activity monitoring

### Real-time Features
- Socket.IO integration for live updates
- Instant notifications for approvals/rejections
- Real-time dashboard updates
- Live transaction status changes

## Production Deployment

### Environment Variables

Create production environment files:

**Backend (.env)**
```
PORT=5000
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=super-secure-production-jwt-secret
NODE_ENV=production
```

**Frontend (.env)**
```
VITE_API_URL=https://your-backend-domain.com/api
VITE_APP_NAME=Library Management System
```

### Build Commands

```bash
# Build frontend for production
cd frontend && npm run build

# Start backend in production
cd backend && npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
1. Check the documentation above
2. Create an issue on GitHub
3. Contact the development team

---

**Built with ❤️ using the MERN stack** 