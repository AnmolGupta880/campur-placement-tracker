# Teacher Login Credentials

## Default Teacher Account

Since teacher signup is disabled for security, you need to create a teacher account using the seed script.

### Step 1: Create Default Teacher Account

Run the following command in the backend directory:

```bash
npm run seed-teacher
```

Or directly:

```bash
node src/scripts/seedTeacher.js
```

### Step 2: Default Credentials

After running the seed script, you'll get:

- **Email**: `teacher@admin.com`
- **Password**: `admin123`

### Step 3: Login

1. Go to the teacher login page: `/teacher/login`
2. Enter the credentials above
3. **IMPORTANT**: Change the password after first login (you'll need to update it in the database)

## Creating Additional Teachers

To create more teachers, you can:

1. **Modify the seed script** (`src/scripts/seedTeacher.js`) with different credentials
2. **Run it again** with new email/password
3. Or **manually create** via MongoDB:

```javascript
// In MongoDB shell or Compass
use your_database_name
db.teachers.insertOne({
  name: "Teacher Name",
  email: "teacher@example.com",
  password: "$2a$10$hashedPasswordHere", // Use bcrypt to hash
  createdAt: new Date(),
  updatedAt: new Date()
})
```

## Security Notes

- ⚠️ **Change default password immediately** after first login
- 🔒 Teacher accounts have full access to student data
- 🚫 Students cannot create teacher accounts (signup disabled)
- ✅ Only pre-approved teachers can access the system

## Troubleshooting

If you get "Invalid credentials":
1. Make sure you ran the seed script: `npm run seed-teacher`
2. Check that MongoDB is connected
3. Verify the email and password match exactly (case-sensitive)

