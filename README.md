# 🌱 reFlourish - Ecosystem Restoration Platform

![reFlourish](https://img.shields.io/badge/reFlourish-Ecosystem%20Restoration-green)
![Hackathon](https://img.shields.io/badge/Hackathon-Project-blue)
![MERN Stack](https://img.shields.io/badge/Stack-MERN-cyan)
![React](https://img.shields.io/badge/React-19.1.1-61dafb)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933)

## 📖 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Directory Structure](#directory-structure)
- [Scientific Methodology](#scientific-methodology)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

reFlourish is a comprehensive ecosystem restoration platform that enables users to analyze land suitability for reforestation and ecosystem restoration projects. The platform combines satellite imagery, environmental data, and scientific models to provide actionable insights for conservation efforts.

### 🎥 Demo
*Live demo and video links to be added*

### 🏆 Hackathon Context
Built for environmental hackathons, reFlourish addresses the critical need for data-driven ecosystem restoration planning in the face of climate change and biodiversity loss.

## ✨ Features

### 🌍 Core Functionality
- **Interactive Map Analysis**: Draw rectangular areas on the map to analyze ecosystem restoration potential
- **Real Environmental Data**: Integration with OpenEO (Sentinel-2) and Open-Meteo APIs
- **Multi-factor Analysis**: Vegetation health, soil quality, rainfall patterns, and biodiversity
- **Impact Projections**: CO₂ sequestration, water retention, biodiversity gains, and economic value
- **User Authentication**: Secure user accounts with JWT tokens
- **Analysis History**: Save and revisit previous analyses
- **Responsive Design**: Mobile-friendly interface with touch support and collapsible sidebar

### 📊 Analysis Metrics
- **Greening Potential Score**: Overall suitability percentage (0-100%)
- **Priority Levels**: HIGH, MEDIUM, LOW, VERY_LOW classifications
- **Environmental Factors**: 
  - Vegetation Health (NDVI from Sentinel-2) - 40% weight
  - Soil Quality (Land cover classification) - 30% weight
  - Rainfall Patterns (Historical weather data) - 20% weight
  - Biodiversity Index (Habitat heterogeneity) - 10% weight

### 🔧 Technical Features
- Real-time data processing from satellite and weather APIs
- Scientific impact calculations based on peer-reviewed models
- Secure RESTful API architecture with JWT authentication
- Progressive Web App capabilities
- Mobile-responsive design with touch gesture support

## 🛠 Tech Stack

### Frontend
- **React 19.1.1** - Modern UI framework with hooks
- **Vite 7.1.7** - Fast build tool and dev server
- **Leaflet 1.9.4** + **React-Leaflet 5.0.0** - Interactive maps
- **Geoman.io** - Map drawing tools
- **CSS3** - Modern styling with responsive design
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** + **Express 5.1.0** - Runtime and web framework
- **MongoDB** + **Mongoose 8.19.1** - Database and ODM
- **JWT 9.0.2** - Authentication tokens
- **bcryptjs 3.0.2** - Password hashing
- **CORS 2.8.5** - Cross-origin resource sharing

### APIs & External Services
- **OpenEO API** - Satellite imagery and environmental data (Sentinel-2)
- **Open-Meteo API** - Weather, climate, and elevation data
- **Sentinel-2** - European satellite imagery via OpenEO

### Development Tools
- **ESLint 9.36.0** - Code linting and quality
- **Nodemon 3.1.10** - Development server auto-restart
- **dotenv 17.2.3** - Environment variable management

## 🏗 Architecture

### System Architecture
Client (React/Vite) → Express API → MongoDB
↓
External APIs
(OpenEO, Open-Meteo)


### Data Flow
1. **User Interaction**: User draws area on map using Geoman tools
2. **Data Collection**: Coordinates sent to `/api/analyze` endpoint
3. **External API Calls**: Backend fetches real environmental data from OpenEO and Open-Meteo
4. **Analysis Processing**: Suitability analysis using weighted scoring algorithm
5. **Impact Calculation**: Scientific projections based on peer-reviewed models
6. **Response**: Results returned to frontend with detailed breakdown
7. **Optional Storage**: Analysis saved to MongoDB if user is authenticated

### Authentication Flow

User Registration/Login → JWT Token Generation → Protected Route Access
↓
Context Provider
↓
Authenticated API Calls with Bearer Token

### Database Models
**User Model**
- username (unique, required)
- email (unique, required)
- password (hashed, required)
- organization (optional)
- role (user/admin/ngo, default: user)
- createdAt (auto-generated)

**Analysis Model**
- userId (reference to User)
- coordinates (with bounds, center, NE/SW points)
- analysisResults (scores, priority level, detailed factors)
- impactProjection (CO₂, biodiversity, water, soil, air, economic)
- timestamp (auto-generated)
- tags and isPublic for future features

## 📡 API Documentation

### Authentication Endpoints
#### POST `/api/auth/register`
- Register a new user account.

Request Body:

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123",
  "organization": "Green Earth NGO",
  "role": "user"
}
```

Response:

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "organization": "Green Earth NGO",
    "role": "user"
  }
}
```

#### POST `/api/auth/login`
- Authenticate user and return JWT token.

Request Body:

```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:** Same as register endpoint.

#### GET `/api/auth/me`
- Get current user profile (requires Authorization header).

Headers:

```text
Authorization: Bearer <jwt_token>
```
### Analysis Endpoints

#### POST `/api/analyze`
- Perform ecosystem analysis on selected area. No authentication required.

Request Body:

```json
{
  "coordinates": {
    "northEast": { "lat": 40.712, "lng": -74.006 },
    "southWest": { "lat": 40.710, "lng": -74.008 },
    "center": { "lat": 40.711, "lng": -74.007 },
    "bounds": [[40.710, -74.008], [40.712, -74.006]]
  }
}
```

Response:

```json
{
  "success": true,
  "area": { /* original coordinates */ },
  "analysis": {
    "overallScore": 0.75,
    "priorityLevel": "HIGH",
    "areaSize": 4.52,
    "detailedScores": [
      {
        "point": { "lat": 40.711, "lng": -74.007 },
        "suitabilityScore": 0.78,
        "factors": {
          "vegetation": 0.85,
          "soil": 0.72,
          "rainfall": 0.68,
          "biodiversity": 0.65
        }
      }
    ],
    "dataSources": {
      "vegetation": "OpenEO (Sentinel-2 NDVI)",
      "soil": "OpenEO (Land Cover Classification)",
      "rainfall": "Open-Meteo (Historical Weather)",
      "biodiversity": "OpenEO (Habitat Heterogeneity)"
    }
  },
  "impact": {
    "co2Sequestration": 1695,
    "biodiversityGain": 42.5,
    "waterRetention": 339000,
    "soilPreservation": 1017,
    "airQualityImprovement": 339,
    "economicValue": 169500
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### POST `/api/analyses`
- Save analysis to user history (requires authentication).

Headers:

```text
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

#### GET /api/analyses/history
- Get user's analysis history (requires authentication).

**Request Body:** Same as analysis response structure.

Response:

```json
{
  "success": true,
  "analyses": [
    {
      "id": "507f1f77bcf86cd799439012",
      "coordinates": { /* ... */ },
      "overallScore": 0.75,
      "priorityLevel": "HIGH",
      "areaSize": 4.52,
      "impact": { /* ... */ },
      "timestamp": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### GET `/api/analyses/:id`
- Get specific analysis details (requires authentication).

### Utility Endpoints

### GET `/`
- API welcome message and endpoint list.

#### GET `/api/health`
- Server health check.

## 📁 Directory Structure

```text
reFlourish/
├── client/                         # React Frontend
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/               # Authentication Components
│   │   │   │   ├── AuthModal.jsx   # Modal for login/register
│   │   │   │   ├── AuthProvider.jsx    # Context provider
│   │   │   │   ├── Login.jsx           # Login form
│   │   │   │   ├── ProtectedRoute.jsx  # Route protection
│   │   │   │   └── Register.jsx        # Registration form
│   │   │   ├── Dashboard/              # User Dashboard
│   │   │   │   └── UserDashboard.jsx   # Analysis history
│   │   │   ├── Map/                    # Map Components
│   │   │   │   └── MapComponent.jsx    # Main map with Geoman
│   │   │   └── Sidebar/            # Sidebar Components
│   │   │       └── Sidebar.jsx     # Application sidebar
│   │   ├── context/                # React Context
│   │   │   └── AuthContext.js      # Authentication state
│   │   ├── hooks/                  # Custom React Hooks
│   │   │   └── useAuth.js          # Auth context hook
│   │   ├── assets/
│   │   │   └── react.svg
│   │   ├── App.jsx                 # Main App Component
│   │   ├── App.css                 # Application Styles
│   │   ├── index.css               # Global Styles
│   │   └── main.jsx                # App Entry Point
│   ├── package.json                # Frontend Dependencies
│   ├── vite.config.js              # Vite Configuration
│   ├── eslint.config.js            # ESLint Configuration
│   └── index.html                  # HTML Template
├── server/                         # Express Backend
│   ├── config/
│   │   └── database.js             # MongoDB Connection
│   ├── middleware/
│   │   └── auth.js                 # JWT Authentication
│   ├── models/                     # Database Models
│   │   ├── Analysis.js             # Analysis Data Model
│   │   └── User.js                 # User Data Model
│   ├── routes/                     # API Routes
│   │   ├── analyses.js             # Analysis CRUD Operations
│   │   └── auth.js                 # Authentication Routes
│   ├── .env                        # Environment Variables
│   ├── package.json                # Backend Dependencies
│   └── server.js                   # Server Entry Point
└── README.md                       # This File
```
## 🤝 Contributing

I welcome contributions from the community! Here's how you can help:

### Development Workflow

#### 1. Fork the Repository

```bash
git clone https://github.com/your-username/reflourish.git
cd reflourish
```

#### 2. Create a Feature Branch
```bash
git checkout -b feature/amazing-feature
```

#### 3. Make Your Changes

- Follow existing code style
- Add comments for complex logic
- Test thoroughly

#### 4. Commit Your Changes
```bash
git commit -m 'feat: Add amazing feature'
```

#### 5. Push and Create Pull Request

```bash
git push origin feature/amazing-feature
```
### Code Standards
- Use ESLint for code quality
- Follow React best practices and hooks rules
- Write meaningful commit messages
- Include comments for complex algorithms
- Test on multiple devices for responsiveness

### Areas for Contribution
- Additional environmental data sources
- Enhanced visualization features
- Mobile app development
- Additional scientific models
- Documentation improvements

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://license/) file for details.

## 🙏 Acknowledgments

- OpenEO for providing satellite imagery and environmental data processing
- Open-Meteo for free weather and climate API services
- European Space Agency for Sentinel-2 satellite imagery
- Leaflet and Geoman for robust mapping capabilities
- MongoDB for database services
- The scientific community for ecological research that made this possible



<div align="center">

Built with ❤️ for a Greener Planet

*"The best time to plant a tree was 20 years ago. The second best time is now." - Chinese Proverb*

</div> 