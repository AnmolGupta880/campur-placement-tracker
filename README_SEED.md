# Seed Data Instructions

## How to Add Companies and Colleges

This project includes a seed script to populate the database with 20 companies and 20 colleges.

### Running the Seed Script

1. **Make sure your backend server is running and MongoDB is connected**

2. **Run the seed script:**
   ```bash
   cd backend
   node src/scripts/seedData.js
   ```

   Or if you're using npm scripts, add this to your `package.json`:
   ```json
   "scripts": {
     "seed": "node src/scripts/seedData.js"
   }
   ```
   Then run: `npm run seed`

### What Gets Added

- **20 Colleges**: Including IITs, NITs, and other top engineering colleges
- **20 Companies**: Including tech giants like Google, Microsoft, Amazon, and more with:
  - Company names
  - Job roles
  - CTC packages
  - Eligibility criteria
  - Drive dates
  - Random college assignments

### Alternative: Using API Endpoints

You can also use the bulk create endpoints:

**For Colleges:**
```bash
POST http://localhost:5000/api/colleges/bulk
Content-Type: application/json

[
  { "name": "College Name", "location": "City" },
  ...
]
```

**For Companies:**
```bash
POST http://localhost:5000/api/companies/bulk
Content-Type: application/json

[
  {
    "name": "Company Name",
    "role": "Job Role",
    "ctc": "Salary",
    "eligibility": "Requirements",
    "driveDate": "2024-03-15",
    "college": "college_id_here"
  },
  ...
]
```

### Notes

- The seed script will skip duplicates if data already exists
- Companies are randomly assigned to colleges
- Drive dates are set for future dates (2024)
- Make sure you have at least one college before seeding companies

