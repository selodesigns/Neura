import express from 'express';
import Document from '../models/Document.js';

const router = express.Router();

// Get all documents for user
router.get('/', async (req, res) => {
  try {
    const documents = await Document.find({
      $or: [
        { owner: req.user._id },
        { 'collaborators.user': req.user._id },
      ],
    })
      .populate('owner', 'name email avatar')
      .populate('collaborators.user', 'name email avatar')
      .sort('-updatedAt');

    res.json({ documents });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single document
router.get('/:id', async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate('owner', 'name email avatar')
      .populate('collaborators.user', 'name email avatar')
      .populate('versions.author', 'name email');

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Check permissions
    const hasAccess =
      document.owner._id.toString() === req.user._id.toString() ||
      document.collaborators.some(c => c.user._id.toString() === req.user._id.toString());

    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Increment view count
    document.analytics.views += 1;
    await document.save();

    res.json({ document });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create document
router.post('/', async (req, res) => {
  try {
    const { title, content, metadata } = req.body;

    const document = new Document({
      title,
      content: content || '',
      metadata: metadata || {},
      owner: req.user._id,
      versions: [{
        content: content || '',
        author: req.user._id,
        message: 'Initial version',
      }],
    });

    await document.save();
    await document.populate('owner', 'name email avatar');

    res.status(201).json({ document });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update document
router.put('/:id', async (req, res) => {
  try {
    const { title, content, metadata, versionMessage } = req.body;
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Check write permissions
    const hasWriteAccess =
      document.owner.toString() === req.user._id.toString() ||
      document.collaborators.some(
        c =>
          c.user.toString() === req.user._id.toString() &&
          (c.permission === 'write' || c.permission === 'admin')
      );

    if (!hasWriteAccess) {
      return res.status(403).json({ error: 'Write access denied' });
    }

    // Update fields
    if (title) document.title = title;
    if (content !== undefined) {
      document.content = content;
      // Add version
      document.versions.push({
        content,
        author: req.user._id,
        message: versionMessage || 'Updated content',
      });
    }
    if (metadata) document.metadata = { ...document.metadata, ...metadata };

    document.analytics.edits += 1;
    await document.save();
    await document.populate('owner', 'name email avatar');
    await document.populate('collaborators.user', 'name email avatar');

    res.json({ document });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete document
router.delete('/:id', async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    if (document.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only owner can delete document' });
    }

    await document.deleteOne();
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add collaborator
router.post('/:id/collaborators', async (req, res) => {
  try {
    const { userId, permission } = req.body;
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    if (document.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only owner can add collaborators' });
    }

    // Check if already a collaborator
    const exists = document.collaborators.some(c => c.user.toString() === userId);
    if (exists) {
      return res.status(400).json({ error: 'User is already a collaborator' });
    }

    document.collaborators.push({ user: userId, permission: permission || 'read' });
    await document.save();
    await document.populate('collaborators.user', 'name email avatar');

    res.json({ document });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
