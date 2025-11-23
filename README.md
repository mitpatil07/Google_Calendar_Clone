# Google Calendar Clone - Week View

A full-featured web replica of Google Calendar's week view with event creation, editing, and deletion capabilities. Built with modern web technologies and production-ready architecture.



## 🚀 Features

- **Week View Calendar**: 7-day grid with 24-hour time slots
- **Event Management**: Create, edit, and delete events with form validation
- **Real-time Updates**: Immediate UI updates after CRUD operations
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Smart Event Positioning**: Automatic overlap detection and side-by-side layout
- **Current Time Indicator**: Red line showing current time on today's column
- **Auto-scroll**: Automatically scrolls to current time on load
- **Color Customization**: 11 preset colors for event categorization
- **Validation**: Client-side and server-side validation with Zod
- **Error Handling**: Graceful error messages and loading states

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **Axios** - HTTP client
- **date-fns** - Date manipulation
- **clsx** - Conditional classnames

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM (Object Data Modeling)
- **Zod** - Schema validation





## 🔧 Installation & Setup

### Step 1: Clone/Extract the Project

```bash
cd google-calendar-clone
```

### Step 2: MongoDB Setup

**Local MongoDB (Recommended for testing)**

```bash
# Start MongoDB service (macOS/Linux)
sudo systemctl start mongod

# Or on macOS with Homebrew
brew services start mongodb-community

# Verify MongoDB is running
mongosh
# Type 'exit' to quit the MongoDB shell
```


### Step 3: Backend Setup

```bash
# Navigate to server folder
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env file with your settings
# For local MongoDB:
# MONGODB_URI=mongodb://localhost:27017/calendar-app
```

**Server Environment Variables (`.env`):**

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/calendar-app
CORS_ORIGIN=http://localhost:5173
```

### Step 4: Frontend Setup

```bash
# Open a new terminal
# Navigate to client folder from project root
cd client

# Install dependencies
npm install

# No .env file needed - Vite proxy handles API routing
```

## ▶️ Running the Application

### Method 1: Two Terminal Windows (Recommended)

**Terminal 1 - Start Backend:**
```bash
cd server
npm run dev

# You should see:
# ✅ MongoDB Connected: localhost
# 🚀 Server running on port 5000
```

**Terminal 2 - Start Frontend:**
```bash
cd client
npm run dev

# You should see:
# ➜  Local:   http://localhost:5173/
# Browser will open automatically
```

### Method 2: Production Build

```bash
# Build frontend
cd client
npm run build

# Serve static files (optional)
npm run preview

# Start backend in production mode
cd ../server
npm run build
npm start
```

## 📱 Using the Application

1. **Open Browser**: Navigate to `http://localhost:5173`
2. **Create Event**: 
   - Click "Create" button in header, OR
   - Click on any time slot in the calendar
3. **Edit Event**: Click on any existing event
4. **Delete Event**: Click event → Click "Delete" button in modal
5. **Navigate Weeks**: Use arrow buttons or "Today" button



## 👨‍💻 Author

Mr. Mitesh D. Patil
- Email: mitesh8767@gmail.com
