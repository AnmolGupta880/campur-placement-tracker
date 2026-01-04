# Backend Crash Fixes

## Issues Fixed

### 1. **Environment Variables Validation**
- Added checks for `JWT_SECRET` and `MONGO_URI` before server starts
- Server will exit gracefully with helpful error messages if variables are missing

### 2. **Database Connection Improvements**
- Added connection timeout settings to prevent hanging
- Added graceful shutdown handling
- Better error messages for connection failures

### 3. **Authentication Middleware**
- Added null checks for tokens and decoded data
- Better error handling for expired/invalid tokens
- Validates userType before proceeding

### 4. **Resume Upload Safety**
- Added size validation (max 5MB)
- Handles null/undefined resume gracefully
- Prevents crashes from oversized files

### 5. **Global Error Handler**
- Catches unhandled errors
- Prevents server crashes
- Returns proper error responses

### 6. **Route Protection**
- Added teacher-only middleware
- Prevents unauthorized access
- Better error messages

## How to Run

### 1. Create `.env` file in backend directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here_make_it_long_and_random
PORT=5000
NODE_ENV=development
```

### 2. Install dependencies:

```bash
cd backend
npm install
```

### 3. Create teacher account:

```bash
npm run seed-teacher
```

### 4. Start server:

```bash
npm run dev
# or
npm start
```

## Teacher Credentials

After running `npm run seed-teacher`:

- **Email**: `teacher@admin.com`
- **Password**: `admin123`

⚠️ **Change password after first login!**

## Common Issues & Solutions

### Issue: "JWT_SECRET is not set"
**Solution**: Create `.env` file with `JWT_SECRET=your_secret_key`

### Issue: "MongoDB connection failed"
**Solution**: 
1. Check MongoDB is running
2. Verify `MONGO_URI` in `.env` is correct
3. Check network/firewall settings

### Issue: "Invalid credentials" for teacher
**Solution**: Run `npm run seed-teacher` to create teacher account

### Issue: Server crashes on resume upload
**Solution**: 
- Resume size is now limited to 5MB
- Base64 encoding is validated
- Errors are caught and returned gracefully

## Testing

Test the server is running:
```bash
curl http://localhost:5000/
# Should return: "Campus Placement Tracker API running"
```

Test teacher login:
```bash
curl -X POST http://localhost:5000/api/auth/teacher/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teacher@admin.com","password":"admin123"}'
```

