# MongoDB Setup Guide

## Quick Fix for "authentication failed" Error

If you're getting `bad auth : authentication failed`, follow these steps:

### Option 1: Local MongoDB (No Authentication)

If you're running MongoDB locally without authentication:

**In your `.env` file:**
```env
MONGO_URI=mongodb://localhost:27017/campus-placement
```

**Make sure MongoDB is running:**
```bash
# Windows
net start MongoDB

# Mac/Linux
sudo systemctl start mongod
# or
mongod
```

### Option 2: MongoDB Atlas (Cloud)

If you're using MongoDB Atlas:

1. **Get your connection string:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

2. **Update the connection string:**
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with your database name (e.g., `campus-placement`)

   **Example:**
   ```env
   MONGO_URI=mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/campus-placement?retryWrites=true&w=majority
   ```

3. **Check IP Whitelist:**
   - In MongoDB Atlas, go to "Network Access"
   - Add your current IP address (or `0.0.0.0/0` for all IPs - less secure)

4. **Verify Database User:**
   - Go to "Database Access"
   - Make sure your user has read/write permissions
   - Password should match what's in your connection string

### Option 3: Local MongoDB with Authentication

If your local MongoDB requires authentication:

```env
MONGO_URI=mongodb://username:password@localhost:27017/campus-placement?authSource=admin
```

**To create a user:**
```javascript
// Connect to MongoDB shell
mongo

// Switch to admin database
use admin

// Create user
db.createUser({
  user: "myuser",
  pwd: "mypassword",
  roles: [{ role: "readWrite", db: "campus-placement" }]
})
```

## Connection String Formats

### Local MongoDB (No Auth)
```
mongodb://localhost:27017/campus-placement
```

### Local MongoDB (With Auth)
```
mongodb://username:password@localhost:27017/campus-placement?authSource=admin
```

### MongoDB Atlas
```
mongodb+srv://username:password@cluster.mongodb.net/campus-placement?retryWrites=true&w=majority
```

## Testing Your Connection

### Test with MongoDB Compass
1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Paste your connection string
3. Click "Connect"
4. If it connects, your string is correct!

### Test with Node.js
```javascript
// test-connection.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connection successful!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Connection failed:", err.message);
    process.exit(1);
  });
```

Run: `node test-connection.js`

## Common Issues

### Issue: "authentication failed"
- **Solution**: Check username/password in connection string
- For Atlas: Verify database user credentials
- For local: Make sure user exists and has correct password

### Issue: "ENOTFOUND" or "getaddrinfo"
- **Solution**: 
  - Check internet connection (for Atlas)
  - Verify hostname/URL is correct
  - Check if MongoDB service is running (for local)

### Issue: "timeout"
- **Solution**:
  - Check if MongoDB server is running
  - Verify firewall isn't blocking port 27017
  - For Atlas: Check IP whitelist

### Issue: "connection refused"
- **Solution**:
  - MongoDB service is not running
  - Start MongoDB: `mongod` or `net start MongoDB`

## Quick Start (No Authentication)

**Easiest way to get started:**

1. Install MongoDB locally
2. Start MongoDB service
3. In `.env` file:
   ```env
   MONGO_URI=mongodb://localhost:27017/campus-placement
   ```
4. Run your server - it will create the database automatically!

## Still Having Issues?

1. **Check your `.env` file exists** in the `backend` directory
2. **Verify no extra spaces** in MONGO_URI
3. **Check MongoDB is running**: `mongosh` or `mongo` command should work
4. **Try connecting with MongoDB Compass** to verify your connection string
5. **Check server logs** for specific error messages

