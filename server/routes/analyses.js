import express from 'express';
import auth from '../middleware/auth.js';
import Analysis from '../models/Analysis.js';

const router = express.Router();

// Save analysis
router.post('/', auth, async (req, res) => {
  try {
    const analysis = new Analysis({
      userId: req.user._id,
      ...req.body
    });

    await analysis.save();

    res.status(201).json({
      success: true,
      analysis: {
        id: analysis._id,
        timestamp: analysis.timestamp
      }
    });
  } catch (error) {
    console.error('Save analysis error:', error);
    res.status(500).json({ error: 'Failed to save analysis' });
  }
});

// Get user's analysis history
router.get('/history', auth, async (req, res) => {
  try {
    const analyses = await Analysis.find({ userId: req.user._id })
      .sort({ timestamp: -1 })
      .select('coordinates analysisResults impactProjection timestamp tags isPublic')
      .limit(50);

    res.json({
      success: true,
      analyses: analyses.map(analysis => ({
        id: analysis._id,
        coordinates: analysis.coordinates,
        overallScore: analysis.analysisResults.overallScore,
        priorityLevel: analysis.analysisResults.priorityLevel,
        areaSize: analysis.analysisResults.areaSize,
        impact: analysis.impactProjection,
        timestamp: analysis.timestamp,
        tags: analysis.tags,
        isPublic: analysis.isPublic
      }))
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: 'Failed to fetch analysis history' });
  }
});

// Get specific analysis
router.get('/:id', auth, async (req, res) => {
  try {
    const analysis = await Analysis.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    res.json({
      success: true,
      analysis
    });
  } catch (error) {
    console.error('Get analysis error:', error);
    res.status(500).json({ error: 'Failed to fetch analysis' });
  }
});

export default router;