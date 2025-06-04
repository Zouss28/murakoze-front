# Murakoze_backend

Description

**Murakoze_backend** is the backend API that powers the Murakoze Recommendations Platform — a digital service that helps users discover, review, and interact with local businesses across Rwanda. It supports features such as institution listings, user reviews, search, and personalized recommendations.

This backend is built using **Node.js**, **Express**, and **Prisma**, and includes support for:
- JWT-based user authentication
- File uploads for profile and review images
- Search and filtering logic
- Review moderation
- Dynamic category and institution management

The frontend for this project can be found here: [Recommender UI (GitLab)](https://gitlab.wiredin.rw/internal-projects/murakoze/recommender-ui.git)

---

Installation

Follow the steps below to set up the Murakoze backend locally.

### 🔧 Requirements
- [Node.js](https://nodejs.org/) (version 16 or later recommended)
- [MySQL](https://www.mysql.com/) running locally or accessible remotely
- A `.env` file configured with your database URL, JWT secret, and other environment variables
- [Prisma](https://www.prisma.io/) for ORM and schema migrations

Setup Instructions

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd backend

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env

# 4. Generate the Prisma client
npx prisma generate

# 5. Run database migrations
npx prisma migrate dev

# 6. Start the development server
npm start
```

Usage

The Murakoze backend provides RESTful API endpoints for interacting with institutions, user accounts, reviews, search functionality, and more. Many routes require authentication using a Bearer token provided after login.

Public Endpoints

# Get all categories

GET /api/institutions

# Get institutions in a category

GET /api/institutions/:category_id

# View institution details

GET /api/institutions/:id/view

# Search institutions (fuzzy + paginated)

GET /api/search?q=pharmacy&page=1&pageSize=5

# Search institutions in a category with filters

GET /api/search/:category_id?filter=rating&amenities=1,2&price=$$&open=true

# Get top amenities

GET /api/search/list/amenity

Authentication

# Sign up

POST /api/auth/signup
Content-Type: application/json

json:
{
  "email": "user@example.com",
  "password": "securepass123",
  "first_name": "John",
  "last_name": "Doe"
}

# Login

POST /api/auth/login
Content-Type: application/json

# Delete account

DELETE /api/auth/delete_account
Authorization: Bearer <your_token>

Profile

# Get profile

GET /api/profile/dashboard
Authorization: Bearer <your_token>

# Update profile

PUT /api/profile/dashboard/update
Authorization: Bearer <your_token>

# Upload profile image

PUT /api/profile/update_image
Authorization: Bearer <your_token>
Content-Type: multipart/form-data

# Get user reviews

GET /api/profile/reviews
Authorization: Bearer <your_token>

Reviews

# Submit a review with image

POST /api/review/:institution_id
Authorization: Bearer <your_token>
Content-Type: multipart/form-data

# Get recent reviews

GET /api/review/recent

Roadmap

The following features are planned for upcoming development cycles:
	•	✅ Review reaction system (like/dislike)
	•	✅ Favorite institutions (save for later)
	•	✅ Review reporting and moderation
	•	✅ Admin dashboard for managing users, reviews, and institutions
	•	✅ Expanded search filters (e.g., by location or business hours)

⸻

Authors and Acknowledgment

This backend was developed as part of the Murakoze Recommendations Platform by the following contributors:
	•	Alain Iyakaremye – Backend Developer
	•	Gift Dave Furaha – Backend Developer
	•	Bolingo Baudoin – Frontend Developer

Special thanks to WiredIn for providing technical guidance, resources, and support throughout the development of this project.