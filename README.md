# 🌱 reFlourish - Ecosystem Restoration Platform

![reFlourish](https://img.shields.io/badge/reFlourish-Ecosystem%20Restoration-green)
![Hackathon](https://img.shields.io/badge/Hackathon-Project-blue)
![MERN Stack](https://img.shields.io/badge/Stack-MERN-cyan)
![React](https://img.shields.io/badge/React-19.1.1-61dafb)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933)

## 🌐 Live Site

https://reflourish.netlify.app/

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [API Documentation](#api-documentation)
- [Directory Structure](#directory-structure)
- [Scientific Methodology](#scientific-methodology)
- [Contributing](#contributing)
- [License](#license)

<h2 id="overview">Overview</h2>

reFlourish is a comprehensive ecosystem restoration platform that enables users to analyze land suitability for reforestation and ecosystem restoration projects. The platform combines satellite imagery, environmental data, and scientific models to provide actionable insights for conservation efforts.

### Hackathon Context

Built for a Land Degradation hackathon, reFlourish addresses the critical need for data-driven ecosystem restoration planning in the face of climate change and biodiversity loss.

<h2 id="features">Features</h2>

### Core Functionality

- **Interactive Map Analysis**: Draw rectangular areas on the map to analyze ecosystem restoration potential
- **Real Environmental Data**: Integration with OpenEO (Sentinel-2) and Open-Meteo APIs
- **Multi-factor Analysis**: Vegetation health, soil quality, rainfall patterns, and biodiversity
- **Impact Projections**: CO₂ sequestration, water retention, biodiversity gains, and economic value
- **User Authentication**: Secure user accounts with JWT tokens
- **Analysis History**: Save and revisit previous analyses
- **Responsive Design**: Mobile-friendly interface with touch support and collapsible sidebar

### Analysis Metrics

- **Greening Potential Score**: Overall suitability percentage (0-100%)
- **Priority Levels**: HIGH, MEDIUM, LOW, VERY_LOW classifications
- **Environmental Factors**:
  - Vegetation Health (NDVI from Sentinel-2) - 40% weight
  - Soil Quality (Land cover classification) - 30% weight
  - Rainfall Patterns (Historical weather data) - 20% weight
  - Biodiversity Index (Habitat heterogeneity) - 10% weight

### Technical Features

- Real-time data processing from satellite and weather APIs
- Scientific impact calculations based on peer-reviewed models
- Secure RESTful API architecture with JWT authentication
- Progressive Web App capabilities
- Mobile-responsive design with touch gesture support

<h2 id="tech-stack">Tech Stack</h2>

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

<h2 id="quick-start">Quick Start</h2>

This project uses a standard **MERN** setup with separate frontend and backend services. Follow the steps below to run reFlourish locally.

#### Prerequisites

Make sure you have the following installed:

- Node.js (v18 or higher recommended)
- npm or yarn
- MongoDB (local instance or MongoDB Atlas account)
- Git

#### 1. Clone the Repository

```bash
git clone https://github.com/Polceze/reflourish.git
cd reflourish
```

#### 2. Backend Setup

```bash
cd server
npm install
```

Create a .env file inside the server directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

Start the backend server:

```bash
npm run dev
```

The API should now be running at:

```arduino
http://localhost:5000
```

You can verify this by visiting:

```bash
http://localhost:5000/api/health
```

#### 3. Frontend Setup

Open a new terminal window:

```bash
cd client
npm install
npm run dev
```

The frontend will start at:

```arduino
http://localhost:5173
```

#### 4. Using the Application

- Open the app in your browser
- Create an account and log in
- On the app UI, draw a rectangular area on the map to run an ecosystem analysis
- View suitability scores and impact projections instantly
- Optional: save your analyses and revisit later

<h2 id="architecture">Architecture</h2>

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

<h2 id="api-documentation">API Documentation</h2>

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
    "southWest": { "lat": 40.71, "lng": -74.008 },
    "center": { "lat": 40.711, "lng": -74.007 },
    "bounds": [
      [40.71, -74.008],
      [40.712, -74.006]
    ]
  }
}
```

Response:

```json
{
  "success": true,
  "area": {
    /* original coordinates */
  },
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
      "coordinates": {
        /* ... */
      },
      "overallScore": 0.75,
      "priorityLevel": "HIGH",
      "areaSize": 4.52,
      "impact": {
        /* ... */
      },
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

<h2 id="directory-structure">Directory Structure</h2>

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

### Key Files Explained

#### Frontend Core Files

- App.jsx: Main application with state management, mobile responsiveness, and analysis logic
- MapComponent.jsx: Interactive Leaflet map with Geoman drawing tools and analysis triggers
- AuthProvider.jsx: Context provider for authentication state across the app
- useAuth.js: Custom hook for accessing authentication context

#### Backend Core Files

- server.js: Express server setup with analysis algorithms and external API integrations
- Analysis.js: MongoDB schema for storing analysis results with geospatial data
- auth.js: JWT middleware for protecting routes and validating tokens
- database.js: MongoDB connection configuration with error handling

<h2 id="scientific-methodology">Scientific Methodology</h2>

### Suitability Analysis Algorithm

The platform uses a sophisticated weighted scoring system:

```javascript
calculateWeightedScore(factors) {
  const weights = {
    vegetation: 0.4,    // Most important - existing ecosystem health
    soil: 0.3,         // Soil composition and nutrients
    rainfall: 0.2,     // Water availability
    biodiversity: 0.1  // Existing ecosystem complexity
  };

  return (
    factors.vegetation * weights.vegetation +
    factors.soil * weights.soil +
    factors.rainfall * weights.rainfall +
    factors.biodiversity * weights.biodiversity
  );
}
```

### Priority Level Classification

- HIGH: ≥ 0.7 - Excellent restoration potential
- MEDIUM: 0.5 - 0.69 - Good potential with some limitations
- LOW: 0.3 - 0.49 - Challenging but possible with intervention
- VERY_LOW: < 0.3 - Significant barriers to restoration

### Impact Projection Models

All calculations are based on peer-reviewed scientific research:

#### Carbon Sequestration

```javascript
// IPCC: Temperate forests sequester 2.5-7.5 tons CO₂/ha/year
const carbonPerHa = 5; // Average for mixed vegetation
const co2Sequestration = areaHectares * score * carbonPerHa;
```

#### Water Retention

```javascript
// USDA: Healthy vegetation increases water retention by 500-2000 m³/ha/year
const waterPerHa = 1000; // Middle of range
const waterRetention = areaHectares * score * waterPerHa;
```

#### Biodiversity Gain

```javascript
// Ecological studies: Habitat quality improves biodiversity index
const baseBiodiversityPotential = 35; // Max improvement
const areaFactor = Math.log10(areaHectares + 1) / 2; // Logarithmic scaling
const biodiversityGain = baseBiodiversityPotential * score * (1 + areaFactor);
```

#### Economic Valuation

```javascript
// TEEB: Ecosystem services valued at $500-5000/ha/year
const economicPerHa = 500; // Conservative estimate
const economicValue = areaHectares * score * economicPerHa;
```

### Data Sources and Credibility

- Vegetation Health: Real NDVI data from Sentinel-2 via OpenEO
- Soil Quality: Land cover classification from OpenEO with elevation factors
- Rainfall Patterns: Historical weather data from Open-Meteo (2023 data)
- Biodiversity: Habitat heterogeneity analysis from OpenEO
- Elevation: Terrain data from Open-Meteo Elevation API

<h2 id="contributing">Contributing</h2>

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

<h2 id="license">License</h2>

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenEO for providing satellite imagery and environmental data processing
- Open-Meteo for free weather and climate API services
- European Space Agency for Sentinel-2 satellite imagery
- Leaflet and Geoman for robust mapping capabilities
- MongoDB for database services
- The scientific community for ecological research that made this possible

<div align="center">

Built with ❤️ for a Greener Planet

_"The best time to plant a tree was 20 years ago. The second best time is now." - Chinese Proverb_

</div>
