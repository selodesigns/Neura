# Neura Architecture Documentation

## System Overview

Neura is a full-stack application built with a modern microservices-inspired architecture, featuring real-time collaboration and AI-powered research capabilities.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Client Layer                        │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   React     │  │  ProseMirror │  │     Yjs      │  │
│  │   Router    │  │    Editor    │  │  WebSocket   │  │
│  └─────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                    ┌─────┴─────┐
                    │   HTTP    │
                    │ WebSocket │
                    └─────┬─────┘
┌─────────────────────────┴───────────────────────────────┐
│                    API Gateway                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Express    │  │  Socket.IO   │  │     CORS     │ │
│  │    Router    │  │   Handler    │  │  Middleware  │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          │               │               │
┌─────────┴────────┐ ┌───┴────────┐ ┌───┴────────────┐
│  Auth Service    │ │  Document  │ │  AI Research   │
│  - JWT Token     │ │  Service   │ │    Agent       │
│  - User Mgmt     │ │  - CRUD    │ │  - OpenAI API  │
│  - Permissions   │ │  - Versions│ │  - Perspectives│
└──────────────────┘ └────────────┘ └────────────────┘
          │               │               │
          └───────────────┼───────────────┘
                          │
┌─────────────────────────┴───────────────────────────────┐
│                   Data Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   MongoDB    │  │   Yjs CRDT   │  │    Redis     │ │
│  │  (Documents) │  │   (Sync)     │  │   (Cache)    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## Component Breakdown

### Frontend Architecture

#### 1. React Application Structure
```
src/
├── main.jsx              # Entry point, providers setup
├── App.jsx               # Route configuration
├── contexts/             # Global state management
│   ├── AuthContext.jsx   # Authentication state
│   └── ThemeContext.jsx  # Theme preferences
├── components/           # Reusable components
│   ├── Layout.jsx        # Main layout shell
│   ├── MarkdownEditor.jsx# Collaborative editor
│   └── AIResearchPanel.jsx# Research interface
├── pages/                # Route pages
│   ├── Dashboard.jsx     # Main dashboard
│   ├── DocumentEditor.jsx# Document editing
│   ├── Research.jsx      # AI research lab
│   └── Analytics.jsx     # Analytics dashboard
└── lib/                  # Utilities
    └── api.js            # API client
```

#### 2. State Management
- **Context API**: Global authentication and theme state
- **Local State**: Component-specific state with useState
- **Server State**: API data with useEffect and axios
- **Collaborative State**: Yjs CRDT for document sync

#### 3. Real-Time Collaboration
```javascript
Yjs Document (CRDT)
    ↓
WebSocket Provider
    ↓
ProseMirror Plugin
    ↓
Editor View Updates
    ↓
Broadcast to Peers
```

### Backend Architecture

#### 1. Server Structure
```
server/
├── index.js              # Express app setup
├── config/               # Configuration
│   └── openai.js         # OpenAI client
├── middleware/           # Express middleware
│   └── auth.js           # JWT verification
├── models/               # MongoDB schemas
│   ├── User.js           # User model
│   └── Document.js       # Document model
├── routes/               # API endpoints
│   ├── auth.js           # Authentication routes
│   ├── documents.js      # Document CRUD
│   ├── ai.js             # AI research routes
│   └── analytics.js      # Analytics routes
├── services/             # Business logic
│   └── aiResearchAgent.js# AI orchestration
└── websocket/            # WebSocket handlers
    └── index.js          # Socket.IO setup
```

#### 2. API Design

**RESTful Principles:**
- Resources identified by URIs
- Standard HTTP methods (GET, POST, PUT, DELETE)
- JSON payloads
- Stateless authentication with JWT

**WebSocket Events:**
- `join-document`: User joins collaborative session
- `document-update`: CRDT update broadcast
- `cursor-position`: Real-time cursor tracking
- `typing-indicator`: Show who's typing

#### 3. AI Research Agent

**Multi-Perspective Research Flow:**
```
User Query
    ↓
Question Reformulation (GPT-4)
    ↓
Parallel Perspective Queries
    ├── Analytical
    ├── Creative
    ├── Critical
    ├── Historical
    ├── Practical
    └── Theoretical
    ↓
Response Aggregation
    ↓
Synthesis (GPT-4)
    ↓
Return Structured Results
```

**Prompt Engineering Strategy:**
- System prompts define perspective lens
- Temperature tuning for creativity vs. consistency
- Token limits for response length control
- Context injection for document-aware suggestions

### Database Schema

#### User Collection
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  name: String,
  role: String (enum),
  avatar: String,
  createdAt: Date,
  lastLogin: Date
}
```

#### Document Collection
```javascript
{
  _id: ObjectId,
  title: String,
  content: String (markdown),
  metadata: {
    tags: [String],
    category: String,
    description: String
  },
  owner: ObjectId (ref: User),
  collaborators: [{
    user: ObjectId (ref: User),
    permission: String (enum)
  }],
  versions: [{
    content: String,
    author: ObjectId (ref: User),
    timestamp: Date,
    message: String
  }],
  aiResearchHistory: [{
    query: String,
    responses: [String],
    timestamp: Date,
    perspectives: [String]
  }],
  analytics: {
    views: Number,
    edits: Number,
    aiQueries: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

## Data Flow

### Document Editing Flow
```
1. User types in editor
2. ProseMirror captures changes
3. Yjs creates update (CRDT operation)
4. WebSocket broadcasts to peers
5. Peers apply update to their Yjs doc
6. ProseMirror updates peer editors
7. Periodic save to MongoDB (debounced)
```

### AI Research Flow
```
1. User submits query
2. Backend receives request
3. AI Agent generates question variations
4. Parallel OpenAI API calls (perspectives)
5. Responses aggregated
6. Optional synthesis
7. Save to document history
8. Return to client
9. Display in research panel
```

### Authentication Flow
```
1. User submits credentials
2. Server validates against database
3. JWT token generated (expires 7d)
4. Token stored in localStorage
5. Token included in API requests (Bearer)
6. Middleware validates token
7. User object attached to request
8. Route handler accesses user data
```

## Performance Optimizations

### Frontend
- **Code Splitting**: React.lazy for route-based splitting
- **Memoization**: React.memo for expensive components
- **Debouncing**: Auto-save with 500ms debounce
- **Virtual Scrolling**: Large document lists
- **Image Optimization**: Lazy loading for avatars

### Backend
- **Database Indexing**: On user emails, document IDs
- **Query Optimization**: Population limits, field selection
- **Caching**: Redis for frequently accessed data
- **Connection Pooling**: MongoDB connection reuse
- **Rate Limiting**: Prevent API abuse

### Real-Time Collaboration
- **Binary Protocol**: Yjs uses efficient binary encoding
- **Delta Sync**: Only changes transmitted
- **Awareness Debouncing**: Cursor updates throttled
- **Connection Retry**: Exponential backoff

## Security Architecture

### Authentication & Authorization
- **Password Security**: bcrypt with 12 rounds
- **JWT Tokens**: Short expiry, secure secret
- **Role-Based Access**: User, collaborator, viewer, admin
- **Permission Checking**: Middleware validation

### Data Protection
- **Input Validation**: Sanitize user inputs
- **MongoDB Injection**: Use parameterized queries
- **XSS Prevention**: React auto-escapes
- **CORS Configuration**: Whitelist origins
- **HTTPS**: Required in production

### API Security
- **Rate Limiting**: 100 requests/15 min per IP
- **API Key Protection**: Environment variables
- **Request Size Limits**: 10MB max payload
- **Timeout Configuration**: 30s request timeout

## Scalability Considerations

### Horizontal Scaling
- **Stateless API**: Can run multiple instances
- **Session Storage**: JWT eliminates server sessions
- **WebSocket Clustering**: Use Redis adapter for Socket.IO
- **Load Balancing**: Round-robin distribution

### Vertical Scaling
- **Database Sharding**: By user ID or document ID
- **Read Replicas**: Separate read/write databases
- **Caching Layer**: Redis for hot data
- **CDN**: Static assets served from edge

### Future Enhancements
- Kubernetes deployment
- Message queue (RabbitMQ) for async tasks
- Microservices separation
- ElasticSearch for full-text search

## Monitoring & Observability

### Logging
- **Winston**: Structured logging
- **Levels**: error, warn, info, debug
- **Correlation IDs**: Track requests across services

### Metrics
- **Response Times**: API endpoint performance
- **Error Rates**: Track failures
- **User Activity**: Document views, edits
- **AI Usage**: OpenAI API calls and costs

### Alerting
- **Error Thresholds**: Alert on high error rates
- **Performance Degradation**: Slow response times
- **Resource Utilization**: CPU, memory, disk

## Development Workflow

### Local Development
```bash
1. Start MongoDB
2. npm run dev (starts both client & server)
3. Hot reload enabled for rapid iteration
```

### Testing Strategy
- **Unit Tests**: Jest for business logic
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Playwright for user flows
- **Load Tests**: Artillery for performance

### CI/CD Pipeline
```
1. Git push
2. GitHub Actions triggered
3. Lint & format check
4. Run test suite
5. Build application
6. Deploy to staging
7. Run smoke tests
8. Deploy to production (manual approval)
```

## Conclusion

Neura's architecture prioritizes:
- **Real-time collaboration** through CRDT technology
- **AI-powered insights** via multi-perspective research
- **Scalability** with stateless design
- **Security** with comprehensive protection layers
- **Developer experience** with clear separation of concerns

This architecture supports current features and provides foundation for future enhancements.

---

**Neura** - AI-Driven Collaborative Knowledge Explorer  
Created by [SELODev](https://github.com/SELODev)
