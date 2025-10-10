import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'ReFlourish API Server', 
    phase: 'Phase 1: The Canvas',
    endpoints: {
      health: '/api/health',
      analyze: '/api/analyze (POST)'
    }
  });
});

// Test route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running!', phase: 'Phase 1: The Canvas' });
});

// Analysis endpoint placeholder
app.post('/api/analyze', (req, res) => {
  const { coordinates } = req.body;
  
  // Mock response for Phase 1
  res.json({
    message: 'Analysis endpoint ready for Phase 2',
    area: 'Selected area received',
    coordinates: coordinates
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌱 ReFlourish Backend - Phase 1`);
  console.log(`📡 API available at http://localhost:${PORT}`);
});