import * as Y from 'yjs';

const documents = new Map(); // documentId -> Y.Doc
const connections = new Map(); // documentId -> Set of socket IDs

export function setupWebSocket(io) {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join-document', ({ documentId, userId, userName }) => {
      // Join room
      socket.join(documentId);
      
      // Initialize Yjs document if not exists
      if (!documents.has(documentId)) {
        documents.set(documentId, new Y.Doc());
        connections.set(documentId, new Set());
      }

      connections.get(documentId).add(socket.id);

      // Store user info
      socket.userId = userId;
      socket.userName = userName;
      socket.documentId = documentId;

      // Get current document state
      const yDoc = documents.get(documentId);
      const state = Y.encodeStateAsUpdate(yDoc);

      // Send current state to the joining client
      socket.emit('document-state', { state: Array.from(state) });

      // Notify others about new user
      socket.to(documentId).emit('user-joined', {
        userId,
        userName,
        socketId: socket.id,
      });

      // Send list of current users
      const users = Array.from(connections.get(documentId))
        .map(id => {
          const s = io.sockets.sockets.get(id);
          return s ? { userId: s.userId, userName: s.userName, socketId: id } : null;
        })
        .filter(Boolean);
      
      socket.emit('users-list', { users });

      console.log(`User ${userName} joined document ${documentId}`);
    });

    socket.on('document-update', ({ documentId, update }) => {
      if (!documents.has(documentId)) return;

      const yDoc = documents.get(documentId);
      const updateArray = new Uint8Array(update);
      
      // Apply update to Yjs document
      Y.applyUpdate(yDoc, updateArray);

      // Broadcast update to all other clients in the room
      socket.to(documentId).emit('document-update', { update });
    });

    socket.on('cursor-position', ({ documentId, position, selection }) => {
      socket.to(documentId).emit('remote-cursor', {
        userId: socket.userId,
        userName: socket.userName,
        position,
        selection,
      });
    });

    socket.on('typing-indicator', ({ documentId, isTyping }) => {
      socket.to(documentId).emit('user-typing', {
        userId: socket.userId,
        userName: socket.userName,
        isTyping,
      });
    });

    socket.on('leave-document', ({ documentId }) => {
      handleDisconnect(socket, documentId);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      if (socket.documentId) {
        handleDisconnect(socket, socket.documentId);
      }
    });
  });
}

function handleDisconnect(socket, documentId) {
  if (!connections.has(documentId)) return;

  connections.get(documentId).delete(socket.id);

  // Notify others about user leaving
  socket.to(documentId).emit('user-left', {
    userId: socket.userId,
    userName: socket.userName,
    socketId: socket.id,
  });

  // Clean up if no more connections
  if (connections.get(documentId).size === 0) {
    connections.delete(documentId);
    documents.delete(documentId);
    console.log(`Cleaned up document ${documentId} - no active connections`);
  }

  socket.leave(documentId);
}
