# 🔐 Staff Authentication System

## Overview

PetConnect now includes a comprehensive staff authentication system that protects administrative functions and provides secure access to the staff dashboard.

## Features

### 🔑 Authentication Features
- **Secure Login**: Username/password authentication with bcrypt password hashing
- **Session Management**: Express sessions with secure cookies
- **Role-Based Access**: Admin and staff roles with different permissions
- **Protected Routes**: API endpoints and frontend routes are protected
- **Automatic Logout**: Session timeout and manual logout functionality

### 🛡️ Security Features
- **Password Hashing**: bcrypt with 12 salt rounds
- **Session Security**: HTTP-only cookies, secure in production
- **CSRF Protection**: Built-in with session management
- **Input Validation**: Zod schema validation for all inputs

## User Roles

### Admin (`admin`)
- Full access to all staff functions
- Can manage other staff users
- Access to all statistics and reports

### Staff (`staff`)
- Access to pet management
- Can review and approve applications
- Access to basic statistics

## API Endpoints

### Authentication Endpoints

#### POST `/api/auth/login`
Login with username and password.

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "message": "Амжилттай нэвтэрлээ",
  "user": {
    "id": "user-id",
    "username": "admin",
    "email": "admin@petconnect.mn",
    "fullName": "Админ Хэрэглэгч",
    "role": "admin"
  }
}
```

#### POST `/api/auth/logout`
Logout and destroy session.

**Response:**
```json
{
  "message": "Амжилттай гарлаа"
}
```

#### GET `/api/auth/me`
Get current user information.

**Response:**
```json
{
  "user": {
    "id": "user-id",
    "username": "admin",
    "email": "admin@petconnect.mn",
    "fullName": "Админ Хэрэглэгч",
    "role": "admin"
  }
}
```

### Protected Endpoints

All staff endpoints require authentication:

- `GET /api/pets/all` - Get all pets (staff only)
- `POST /api/pets` - Create new pet (staff only)
- `PATCH /api/pets/:id` - Update pet (staff only)
- `DELETE /api/pets/:id` - Delete pet (staff only)
- `GET /api/applications` - Get all applications (staff only)
- `PATCH /api/applications/:id/status` - Update application status (staff only)
- `GET /api/adoptions` - Get adoption history (staff only)
- `POST /api/adoptions` - Create adoption record (staff only)
- `GET /api/stats` - Get adoption statistics (staff only)

### Admin-Only Endpoints

- `GET /api/staff/users` - Get all staff users (admin only)

## Frontend Routes

### Public Routes
- `/` - Home page
- `/pets` - Pet listings
- `/pets/:id` - Pet details
- `/application` - Adoption application form
- `/history` - Adoption history (public view)

### Protected Routes
- `/staff` - Staff dashboard (requires authentication)
- `/login` - Login page

## Sample Users

For testing purposes, the following users are pre-configured:

### Admin User
- **Username**: `admin`
- **Password**: `admin123`
- **Role**: `admin`
- **Full Name**: Админ Хэрэглэгч

### Staff User
- **Username**: `staff1`
- **Password**: `admin123`
- **Role**: `staff`
- **Full Name**: Ажилтан 1

## Database Schema

### Staff Users Table
```sql
CREATE TABLE staff_users (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'staff',
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

## Security Considerations

### Password Security
- Passwords are hashed using bcrypt with 12 salt rounds
- Never store plain text passwords
- Password validation on both frontend and backend

### Session Security
- Sessions use secure, HTTP-only cookies
- Session timeout after 24 hours
- Sessions are destroyed on logout

### Input Validation
- All inputs are validated using Zod schemas
- SQL injection protection through parameterized queries
- XSS protection through proper output encoding

## Environment Variables

```env
# Session secret (change in production)
SESSION_SECRET=your-secret-key-here

# Database URL
DATABASE_URL=your-database-url

# Node environment
NODE_ENV=development
```

## Usage Examples

### Frontend Authentication

```typescript
import { useAuth } from "@/hooks/use-auth";

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  const handleLogin = async () => {
    try {
      await login("admin", "admin123");
      // Redirect to staff dashboard
    } catch (error) {
      // Handle login error
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.fullName}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

### Protected Route Component

```typescript
import ProtectedRoute from "@/components/protected-route";

function App() {
  return (
    <Route path="/staff">
      <ProtectedRoute>
        <StaffDashboard />
      </ProtectedRoute>
    </Route>
  );
}
```

## Error Handling

### Authentication Errors
- `401 Unauthorized`: User not authenticated
- `403 Forbidden`: User lacks required permissions
- `400 Bad Request`: Invalid login credentials

### Error Response Format
```json
{
  "message": "Error message in Mongolian",
  "code": "ERROR_CODE"
}
```

## Future Enhancements

- [ ] Password reset functionality
- [ ] Email verification
- [ ] Two-factor authentication
- [ ] Audit logging
- [ ] User activity tracking
- [ ] Password policy enforcement
- [ ] Account lockout after failed attempts
