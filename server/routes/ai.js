import express from 'express';
import aiResearchAgent from '../services/aiResearchAgent.js';
import Document from '../models/Document.js';

const router = express.Router();

// Conduct research
router.post('/research', async (req, res) => {
  try {
    const { query, perspectives, documentId } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const result = await aiResearchAgent.conductResearch(query, perspectives);

    // If documentId provided, save to document's research history
    if (documentId) {
      const document = await Document.findById(documentId);
      if (document) {
        document.aiResearchHistory.push({
          query,
          responses: result.responses.map(r => r.content),
          perspectives: result.perspectives,
        });
        document.analytics.aiQueries += 1;
        await document.save();
      }
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Synthesize responses
router.post('/synthesize', async (req, res) => {
  try {
    const { responses } = req.body;

    if (!responses || !Array.isArray(responses)) {
      return res.status(400).json({ error: 'Responses array is required' });
    }

    const synthesis = await aiResearchAgent.synthesizeResponses(responses);
    res.json({ synthesis });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate inline suggestions
router.post('/suggest', async (req, res) => {
  try {
    const { context, cursorPosition } = req.body;

    const suggestions = await aiResearchAgent.generateInlineSuggestions(
      context,
      cursorPosition
    );

    res.json({ suggestions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Expand section
router.post('/expand', async (req, res) => {
  try {
    const { text, direction } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const expanded = await aiResearchAgent.expandSection(text, direction);
    res.json({ expanded });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get research history for document
router.get('/research/:documentId', async (req, res) => {
  try {
    const document = await Document.findById(req.params.documentId);

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Check access
    const hasAccess =
      document.owner.toString() === req.user._id.toString() ||
      document.collaborators.some(c => c.user.toString() === req.user._id.toString());

    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ researchHistory: document.aiResearchHistory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
