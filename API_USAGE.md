# Company API Usage Guide

## Endpoints

### 1. Get All Companies
```http
GET /api/companies
```

**Response:**
```json
[
  {
    "_id": "company_id",
    "name": "Google",
    "role": "Software Engineer",
    "ctc": "25 LPA",
    "eligibility": "CGPA: 7.5+, No backlogs",
    "driveDate": "2024-03-15T00:00:00.000Z",
    "description": "Company description...",
    "location": "Bangalore, Hyderabad",
    "website": "https://careers.google.com",
    "college": {
      "_id": "college_id",
      "name": "IIT Delhi"
    }
  }
]
```

### 2. Create Single Company
```http
POST /api/companies
Content-Type: application/json
Authorization: Bearer <token> (optional)

{
  "name": "Company Name",
  "role": "Job Role",
  "ctc": "Salary Package",
  "eligibility": "CGPA: 7.0+, No backlogs",
  "driveDate": "2024-03-15",
  "description": "Company description",
  "location": "City, State",
  "website": "https://company.com/careers",
  "collegeId": "college_id_here" // Optional
}
```

**Response:**
```json
{
  "_id": "company_id",
  "name": "Company Name",
  "role": "Job Role",
  "ctc": "Salary Package",
  ...
}
```

### 3. Bulk Create Companies
```http
POST /api/companies/bulk
Content-Type: application/json
Authorization: Bearer <token> (optional)

[
  {
    "name": "Company 1",
    "role": "Software Engineer",
    "ctc": "20 LPA",
    "eligibility": "CGPA: 7.0+",
    "driveDate": "2024-03-15",
    "description": "Description",
    "location": "Bangalore",
    "website": "https://company1.com",
    "college": "college_id_1"
  },
  {
    "name": "Company 2",
    "role": "Developer",
    "ctc": "18 LPA",
    "eligibility": "CGPA: 7.5+",
    "driveDate": "2024-03-20",
    "college": "college_id_2"
  }
]
```

**Response:**
```json
{
  "message": "Bulk companies inserted",
  "insertedCount": 2,
  "data": [...]
}
```

## Using the API from Frontend

### JavaScript/React Example

```javascript
import { createCompany, bulkCreateCompanies } from './services/api';

// Create single company
const newCompany = {
  name: "New Company",
  role: "Software Engineer",
  ctc: "20 LPA",
  eligibility: "CGPA: 7.0+, No backlogs",
  driveDate: "2024-03-15",
  description: "A great company to work for",
  location: "Bangalore",
  website: "https://newcompany.com/careers"
};

try {
  const company = await createCompany(newCompany);
  console.log("Company created:", company);
} catch (error) {
  console.error("Error:", error.message);
}

// Bulk create companies
const companies = [
  { name: "Company 1", role: "SDE", ctc: "20 LPA", ... },
  { name: "Company 2", role: "Developer", ctc: "18 LPA", ... }
];

try {
  const result = await bulkCreateCompanies(companies);
  console.log("Companies created:", result.insertedCount);
} catch (error) {
  console.error("Error:", error.message);
}
```

## Using cURL

### Create Single Company
```bash
curl -X POST http://localhost:5000/api/companies \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Company",
    "role": "Software Engineer",
    "ctc": "20 LPA",
    "eligibility": "CGPA: 7.0+, No backlogs",
    "driveDate": "2024-03-15",
    "description": "Company description",
    "location": "Bangalore",
    "website": "https://company.com/careers"
  }'
```

### Bulk Create
```bash
curl -X POST http://localhost:5000/api/companies/bulk \
  -H "Content-Type: application/json" \
  -d '[
    {
      "name": "Company 1",
      "role": "SDE",
      "ctc": "20 LPA",
      "eligibility": "CGPA: 7.0+",
      "driveDate": "2024-03-15"
    },
    {
      "name": "Company 2",
      "role": "Developer",
      "ctc": "18 LPA",
      "eligibility": "CGPA: 7.5+",
      "driveDate": "2024-03-20"
    }
  ]'
```

## Field Descriptions

- **name** (required): Company name
- **role**: Job role/position
- **ctc**: Cost to Company (salary package)
- **eligibility**: Eligibility criteria
- **driveDate**: Placement drive date (ISO format: "YYYY-MM-DD")
- **description**: Company description
- **location**: Office locations
- **website**: Company careers website URL
- **collegeId**: ID of the college (optional, can be assigned later)

## Adding More Companies via Script

Run the additional companies script:
```bash
cd backend
npm run add-companies
```

This will add 15 more companies (Meta, Apple, Netflix, etc.) to your database.

