import express from 'express';
import Document from '../models/Document.js';
import User from '../models/User.js';

const router = express.Router();

// Get dashboard analytics
router.get('/dashboard', async (req, res) => {
  try {
    // Get user's documents
    const documents = await Document.find({
      $or: [
        { owner: req.user._id },
        { 'collaborators.user': req.user._id },
      ],
    });

    // Calculate aggregated stats
    const totalDocuments = documents.length;
    const totalViews = documents.reduce((sum, doc) => sum + doc.analytics.views, 0);
    const totalEdits = documents.reduce((sum, doc) => sum + doc.analytics.edits, 0);
    const totalAIQueries = documents.reduce((sum, doc) => sum + doc.analytics.aiQueries, 0);

    // Recent activity
    const recentDocuments = documents
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, 5)
      .map(doc => ({
        id: doc._id,
        title: doc.title,
        updatedAt: doc.updatedAt,
        views: doc.analytics.views,
        edits: doc.analytics.edits,
      }));

    // Activity over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activityByDay = {};
    for (let i = 0; i < 30; i++) {
      const date = new Date(thirtyDaysAgo);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      activityByDay[dateStr] = { edits: 0, views: 0, aiQueries: 0 };
    }

    documents.forEach(doc => {
      const dateStr = doc.updatedAt.toISOString().split('T')[0];
      if (activityByDay[dateStr]) {
        activityByDay[dateStr].edits += doc.analytics.edits;
      }
    });

    const activityTimeline = Object.entries(activityByDay).map(([date, stats]) => ({
      date,
      ...stats,
    }));

    // Top documents
    const topDocuments = documents
      .sort((a, b) => b.analytics.views - a.analytics.views)
      .slice(0, 5)
      .map(doc => ({
        id: doc._id,
        title: doc.title,
        views: doc.analytics.views,
        edits: doc.analytics.edits,
        aiQueries: doc.analytics.aiQueries,
      }));

    // Collaboration stats
    const collaborationStats = {
      ownedDocuments: documents.filter(doc => doc.owner.toString() === req.user._id.toString()).length,
      collaboratingOn: documents.filter(doc => 
        doc.owner.toString() !== req.user._id.toString() &&
        doc.collaborators.some(c => c.user.toString() === req.user._id.toString())
      ).length,
    };

    res.json({
      overview: {
        totalDocuments,
        totalViews,
        totalEdits,
        totalAIQueries,
      },
      recentDocuments,
      activityTimeline,
      topDocuments,
      collaborationStats,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get document-specific analytics
router.get('/document/:id', async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('collaborators.user', 'name email')
      .populate('versions.author', 'name email');

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Check access
    const hasAccess =
      document.owner._id.toString() === req.user._id.toString() ||
      document.collaborators.some(c => c.user._id.toString() === req.user._id.toString());

    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Version history analytics
    const versionHistory = document.versions.map(v => ({
      timestamp: v.timestamp,
      author: v.author.name,
      message: v.message,
    }));

    // AI research analytics
    const aiResearchStats = {
      totalQueries: document.aiResearchHistory.length,
      perspectives: document.aiResearchHistory.flatMap(h => h.perspectives),
      timeline: document.aiResearchHistory.map(h => ({
        query: h.query,
        timestamp: h.timestamp,
        perspectivesCount: h.perspectives.length,
      })),
    };

    res.json({
      documentId: document._id,
      title: document.title,
      analytics: document.analytics,
      versionHistory,
      aiResearchStats,
      collaborators: document.collaborators.map(c => ({
        name: c.user.name,
        email: c.user.email,
        permission: c.permission,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
