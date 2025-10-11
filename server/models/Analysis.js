import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coordinates: {
    northEast: {
      lat: Number,
      lng: Number
    },
    southWest: {
      lat: Number,
      lng: Number
    },
    center: {
      lat: Number,
      lng: Number
    },
    bounds: [[Number]]
  },
  analysisResults: {
    overallScore: Number,
    priorityLevel: String,
    areaSize: Number,
    detailedScores: [{
      point: {
        lat: Number,
        lng: Number
      },
      suitabilityScore: Number,
      factors: {
        vegetation: Number,
        soil: Number,
        rainfall: Number,
        biodiversity: Number
      }
    }]
  },
  impactProjection: {
    co2Sequestration: Number,
    biodiversityGain: Number,
    waterRetention: Number,
    soilPreservation: Number,
    airQualityImprovement: Number,
    economicValue: Number
  },
  dataSources: Object,
  timestamp: {
    type: Date,
    default: Date.now
  },
  tags: [String],
  isPublic: {
    type: Boolean,
    default: false
  }
});

// Index for faster queries
analysisSchema.index({ userId: 1, timestamp: -1 });
analysisSchema.index({ 'coordinates.center': '2dsphere' });

export default mongoose.model('Analysis', analysisSchema);