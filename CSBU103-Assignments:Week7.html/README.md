# User Registration Feature

A complete user registration system with frontend jQuery validation and backend Node.js validation.

## Features

### Frontend Validation (jQuery)
- ✅ Email format validation using regex
- ✅ Password strength validation (min 6 characters, 1 number, 1 special character)
- ✅ Password confirmation matching
- ✅ Real-time validation with visual feedback
- ✅ Clean and responsive UI

### Backend Validation (Node.js)
- ✅ Email format validation
- ✅ Password strength validation
- ✅ Duplicate user checking
- ✅ Password hashing with bcrypt
- ✅ MongoDB or local JSON database support

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Choose Your Database

#### Option A: MongoDB (Default)
Make sure MongoDB is running locally:
```bash
mongod
```

The server will connect to: `mongodb://localhost:27017/userdb`

#### Option B: Local JSON Database
1. Open `models/index.js`
2. Comment out line 4: `module.exports = require('./user.mongo');`
3. Uncomment line 5: `module.exports = require('./user.local');`

Also update `routes/auth.js` line 3:
```javascript
const User = require('../models/user.local'); // Change from user.mongo
```

### 3. Start the Server

```bash
npm start
```

Or with nodemon for development:
```bash
npm run dev
```

### 4. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## File Structure

```
.
├── server.js                 # Main server file
├── package.json             # Dependencies
├── register.html            # Registration form with jQuery validation
├── routes/
│   └── auth.js             # Registration route handler
├── models/
│   ├── index.js            # Database selector
│   ├── user.mongo.js       # MongoDB user model
│   └── user.local.js       # Local JSON user model
└── db.json                 # Local database file (created automatically)
```

## Validation Rules

### Email (Username)
- Must be in valid email format (e.g., user@example.com)
- Regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`

### Password
- Minimum 6 characters
- Must contain at least 1 number
- Must contain at least 1 special character (!@#$%^&*()_+-=[]{};':"\\|,.<>/?)
- Regex: `/^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/`

### Password Confirmation
- Must match the password field exactly

## API Endpoint

### POST /api/register

**Request Body:**
```json
{
  "username": "user@example.com",
  "password": "Pass123!"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "...",
    "username": "user@example.com",
    "createdAt": "2025-02-13T..."
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Password must be at least 6 characters and contain at least 1 number and 1 special character"
}
```

## Testing

1. Try registering with invalid email: `test` → Should show error
2. Try weak password: `pass` → Should show error
3. Try mismatched passwords → Should show error
4. Try valid registration: `test@example.com` / `Pass123!` → Should succeed
5. Try registering same user again → Should show duplicate error

## Security Features

- Password hashing using bcrypt (10 salt rounds)
- Email stored in lowercase for consistency
- Input sanitization on both frontend and backend
- Duplicate user prevention

## Notes

- For production, use environment variables for MongoDB connection string
- Add rate limiting to prevent registration abuse
- Consider adding email verification
- Implement proper session management for login functionality
