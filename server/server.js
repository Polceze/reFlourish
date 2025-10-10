import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Fixed mock environmental data (CSP safe)
const mockEnvironmentalData = {
  getVegetationHealth: (lat, lng) => {
    // Use mathematical operations only - no eval-like patterns
    const baseHealth = 0.6 + (Math.sin(lat * 10) * 0.2) + (Math.cos(lng * 10) * 0.2);
    return Math.max(0.1, Math.min(0.9, baseHealth));
  },
  
  getSoilQuality: (lat, lng) => {
    const baseQuality = 0.5 + (Math.sin(lat * 8) * 0.3) + (Math.cos(lng * 8) * 0.2);
    return Math.max(0.2, Math.min(0.95, baseQuality));
  },
  
  getRainfallIndex: (lat, lng) => {
    const distanceFromCoast = Math.abs(lng + 74.0) / 10;
    const baseRainfall = 0.7 - (distanceFromCoast * 0.1) + (Math.sin(lat * 5) * 0.15);
    return Math.max(0.3, Math.min(0.9, baseRainfall));
  },
  
  getBiodiversityIndex: (lat, lng) => {
    const baseBiodiversity = 0.4 + (Math.sin(lat * 12) * 0.25) + (Math.cos(lng * 12) * 0.2);
    return Math.max(0.1, Math.min(0.8, baseBiodiversity));
  }
};

// Suitability Scoring Model (same as before, but we'll add better logging)
class SuitabilityAnalyzer {
  calculateSuitability(area) {
    console.log('🔍 Starting suitability analysis for area:', area.center);
    
    const { bounds, center } = area;
    const [southWest, northEast] = bounds;
    
    const samplePoints = this.generateSamplePoints(bounds, 9);
    console.log(`📊 Sampling ${samplePoints.length} points within area`);

    const scores = samplePoints.map((point, index) => {
      const vegetation = mockEnvironmentalData.getVegetationHealth(point.lat, point.lng);
      const soil = mockEnvironmentalData.getSoilQuality(point.lat, point.lng);
      const rainfall = mockEnvironmentalData.getRainfallIndex(point.lat, point.lng);
      const biodiversity = mockEnvironmentalData.getBiodiversityIndex(point.lat, point.lng);
      
      const suitabilityScore = this.calculateWeightedScore({
        vegetation,
        soil,
        rainfall,
        biodiversity
      });
      
      console.log(`  Point ${index + 1}: V=${vegetation.toFixed(2)}, S=${soil.toFixed(2)}, R=${rainfall.toFixed(2)}, B=${biodiversity.toFixed(2)} → Score: ${suitabilityScore.toFixed(2)}`);
      
      return {
        point,
        suitabilityScore,
        factors: { vegetation, soil, rainfall, biodiversity }
      };
    });
    
    const averageScore = scores.reduce((sum, score) => sum + score.suitabilityScore, 0) / scores.length;
    
    console.log(`✅ Analysis complete. Overall score: ${averageScore.toFixed(3)}, Priority: ${this.getPriorityLevel(averageScore)}`);
    
    return {
      overallScore: averageScore,
      priorityLevel: this.getPriorityLevel(averageScore),
      detailedScores: scores,
      areaSize: this.calculateAreaSize(bounds)
    };
  }
  
  calculateWeightedScore(factors) {
    const weights = {
      vegetation: 0.4,
      soil: 0.3,
      rainfall: 0.2,
      biodiversity: 0.1
    };
    
    return (
      factors.vegetation * weights.vegetation +
      factors.soil * weights.soil +
      factors.rainfall * weights.rainfall +
      factors.biodiversity * weights.biodiversity
    );
  }
  
  getPriorityLevel(score) {
    if (score >= 0.7) return 'HIGH';
    if (score >= 0.5) return 'MEDIUM'; 
    if (score >= 0.3) return 'LOW';
    return 'VERY_LOW';
  }
  
  generateSamplePoints(bounds, numPoints) {
    const [southWest, northEast] = bounds;
    const points = [];
    const gridSize = Math.sqrt(numPoints);
    
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const lat = southWest[0] + (northEast[0] - southWest[0]) * (i / (gridSize - 1));
        const lng = southWest[1] + (northEast[1] - southWest[1]) * (j / (gridSize - 1));
        points.push({ lat, lng });
      }
    }
    
    return points;
  }
  
  calculateAreaSize(bounds) {
    const [southWest, northEast] = bounds;
    const latDiff = northEast[0] - southWest[0];
    const lngDiff = northEast[1] - southWest[1];
    const areaSqKm = (latDiff * 111) * (lngDiff * 111 * Math.cos((southWest[0] + northEast[0]) * Math.PI / 360));
    return Math.abs(areaSqKm);
  }
  
  calculateImpactProjection(analysisResult) {
    const areaHectares = analysisResult.areaSize * 100;
    const score = analysisResult.overallScore;
    
    return {
      co2Sequestration: areaHectares * score * 5,
      biodiversityGain: areaHectares * score * 0.8,
      waterRetention: areaHectares * score * 1000,
      soilPreservation: areaHectares * score * 2
    };
  }
}

const analyzer = new SuitabilityAnalyzer();

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'ReFlourish API Server', 
    phase: 'Phase 2: The Magic - Suitability Analysis',
    endpoints: {
      health: '/api/health',
      analyze: '/api/analyze (POST)',
      mockData: '/api/mock-data/:lat/:lng (GET)'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Server is running!', 
    phase: 'Phase 2: The Magic',
    features: ['Suitability Scoring', 'Mock Environmental Data', 'Impact Projection']
  });
});

app.get('/api/mock-data/:lat/:lng', (req, res) => {
  const lat = parseFloat(req.params.lat);
  const lng = parseFloat(req.params.lng);
  
  res.json({
    coordinates: { lat, lng },
    environmentalData: {
      vegetationHealth: mockEnvironmentalData.getVegetationHealth(lat, lng),
      soilQuality: mockEnvironmentalData.getSoilQuality(lat, lng),
      rainfallIndex: mockEnvironmentalData.getRainfallIndex(lat, lng),
      biodiversityIndex: mockEnvironmentalData.getBiodiversityIndex(lat, lng)
    }
  });
});

app.post('/api/analyze', (req, res) => {
  try {
    const { coordinates } = req.body;
    
    console.log('📨 Received analysis request for coordinates:', coordinates);
    
    if (!coordinates || !coordinates.bounds) {
      console.log('❌ Invalid coordinates received');
      return res.status(400).json({ error: 'Invalid coordinates provided' });
    }
    
    const analysisResult = analyzer.calculateSuitability(coordinates);
    const impactProjection = analyzer.calculateImpactProjection(analysisResult);
    
    const response = {
      success: true,
      area: coordinates,
      analysis: analysisResult,
      impact: impactProjection,
      timestamp: new Date().toISOString()
    };
    
    console.log('🎯 Sending analysis response');
    
    res.json(response);
    
  } catch (error) {
    console.error('💥 Analysis error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Analysis failed',
      message: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌱 ReFlourish Backend - Phase 2: The Magic`);
  console.log(`📊 Suitability Analysis Engine Ready`);
  console.log(`📡 API available at http://localhost:${PORT}`);
});