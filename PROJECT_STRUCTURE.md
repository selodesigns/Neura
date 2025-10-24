# Neura Project Structure

Complete overview of the project organization and file purposes.

## Directory Tree

```
neura/
├── 📄 Configuration Files
│   ├── package.json                 # Project dependencies and scripts
│   ├── vite.config.js              # Vite bundler configuration
│   ├── tailwind.config.js          # Tailwind CSS configuration
│   ├── postcss.config.js           # PostCSS configuration
│   ├── vitest.config.js            # Vitest test configuration
│   ├── .eslintrc.cjs               # ESLint code quality rules
│   ├── .prettierrc                 # Prettier code formatting
│   ├── ecosystem.config.js         # PM2 process manager config
│   ├── Dockerfile                  # Docker container definition
│   ├── docker-compose.yml          # Multi-container Docker setup
│   ├── .dockerignore               # Docker ignore patterns
│   ├── .env.example                # Environment variables template
│   └── .gitignore                  # Git ignore patterns
│
├── 📁 src/                         # Frontend Source Code
│   ├── main.jsx                    # React application entry point
│   ├── App.jsx                     # Root component with routing
│   ├── index.css                   # Global styles and Tailwind
│   │
│   ├── 📁 components/              # Reusable React Components
│   │   ├── Layout.jsx              # Main app layout with sidebar
│   │   ├── MarkdownEditor.jsx      # Collaborative ProseMirror editor
│   │   └── AIResearchPanel.jsx     # AI research sidebar panel
│   │
│   ├── 📁 pages/                   # Route Page Components
│   │   ├── Login.jsx               # Authentication - Login page
│   │   ├── Register.jsx            # Authentication - Registration
│   │   ├── Dashboard.jsx           # Main dashboard with stats
│   │   ├── DocumentList.jsx        # List all documents
│   │   ├── DocumentEditor.jsx      # Document editing interface
│   │   ├── Research.jsx            # AI research lab interface
│   │   ├── Analytics.jsx           # Analytics dashboard
│   │   └── NotFound.jsx            # 404 error page
│   │
│   ├── 📁 contexts/                # React Context Providers
│   │   ├── AuthContext.jsx         # Authentication state management
│   │   └── ThemeContext.jsx        # Theme (light/dark) management
│   │
│   ├── 📁 lib/                     # Utilities and Services
│   │   └── api.js                  # API client and endpoints
│   │
│   └── 📁 test/                    # Test Configuration
│       └── setup.js                # Vitest test setup
│
├── 📁 server/                      # Backend Source Code
│   ├── index.js                    # Express server entry point
│   │
│   ├── 📁 config/                  # Server Configuration
│   │   └── openai.js               # OpenAI API client setup
│   │
│   ├── 📁 middleware/              # Express Middleware
│   │   └── auth.js                 # JWT authentication middleware
│   │
│   ├── 📁 models/                  # MongoDB Schemas
│   │   ├── User.js                 # User model with auth
│   │   └── Document.js             # Document model with versions
│   │
│   ├── 📁 routes/                  # API Route Handlers
│   │   ├── auth.js                 # POST /api/auth/* endpoints
│   │   ├── documents.js            # CRUD /api/documents/* endpoints
│   │   ├── ai.js                   # POST /api/ai/* endpoints
│   │   └── analytics.js            # GET /api/analytics/* endpoints
│   │
│   ├── 📁 services/                # Business Logic Services
│   │   └── aiResearchAgent.js      # AI research orchestration
│   │
│   └── 📁 websocket/               # Real-Time Communication
│       └── index.js                # Socket.IO and Yjs handlers
│
├── 📁 public/                      # Static Assets
│   └── (icons, images, etc.)
│
├── 📁 logs/                        # Application Logs
│   ├── err.log                     # Error logs
│   └── out.log                     # Output logs
│
└── 📄 Documentation
    ├── README.md                   # Main project documentation
    ├── QUICKSTART.md               # 5-minute setup guide
    ├── ARCHITECTURE.md             # System architecture details
    ├── DEPLOYMENT.md               # Production deployment guide
    ├── CONTRIBUTING.md             # Contribution guidelines
    ├── CHANGELOG.md                # Version history
    ├── LICENSE                     # MIT license
    ├── SECURITY.md                 # Security policy
    └── PROJECT_STRUCTURE.md        # This file
```

## File Purposes by Category

### Frontend Components

| File | Purpose | Key Features |
|------|---------|--------------|
| `Layout.jsx` | Main app shell | Sidebar nav, user menu, mobile responsive |
| `MarkdownEditor.jsx` | Collaborative editor | ProseMirror, Yjs CRDT, real-time sync |
| `AIResearchPanel.jsx` | Research interface | Query input, history, results display |

### Frontend Pages

| Page | Route | Purpose |
|------|-------|---------|
| `Login.jsx` | `/login` | User authentication |
| `Register.jsx` | `/register` | New user registration |
| `Dashboard.jsx` | `/dashboard` | Overview stats and recent docs |
| `DocumentList.jsx` | `/documents` | Browse all documents |
| `DocumentEditor.jsx` | `/document/:id` | Edit document with AI assist |
| `Research.jsx` | `/research` | Standalone research lab |
| `Analytics.jsx` | `/analytics` | Usage insights and metrics |

### Backend Routes

| Route | Methods | Purpose |
|-------|---------|---------|
| `/api/auth/*` | POST, GET | Authentication endpoints |
| `/api/documents` | GET, POST | List and create documents |
| `/api/documents/:id` | GET, PUT, DELETE | Single document operations |
| `/api/ai/research` | POST | Conduct multi-perspective research |
| `/api/ai/synthesize` | POST | Synthesize multiple responses |
| `/api/ai/suggest` | POST | Inline content suggestions |
| `/api/analytics/dashboard` | GET | Dashboard metrics |

### Database Models

#### User Schema
```javascript
{
  email: String (unique),
  password: String (hashed),
  name: String,
  role: String (enum),
  avatar: String,
  createdAt: Date,
  lastLogin: Date
}
```

#### Document Schema
```javascript
{
  title: String,
  content: String (markdown),
  metadata: Object,
  owner: ObjectId (User),
  collaborators: [Object],
  versions: [Object],
  aiResearchHistory: [Object],
  analytics: Object,
  createdAt: Date,
  updatedAt: Date
}
```

## Key Technologies by Layer

### Frontend Stack
- **Framework**: React 18 with Hooks
- **Routing**: React Router v6
- **Styling**: Tailwind CSS 3
- **Editor**: ProseMirror + Yjs
- **Charts**: Recharts
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Build Tool**: Vite

### Backend Stack
- **Runtime**: Node.js 18
- **Framework**: Express 4
- **Database**: MongoDB with Mongoose
- **WebSockets**: Socket.IO
- **AI**: OpenAI GPT-4
- **Auth**: JWT + bcrypt
- **CRDT**: Yjs

### DevOps
- **Containerization**: Docker + Docker Compose
- **Process Manager**: PM2
- **Testing**: Vitest + Testing Library
- **Linting**: ESLint
- **Formatting**: Prettier
- **CI/CD**: GitHub Actions ready

## Module Dependencies

### Frontend Dependencies
```
react → react-router-dom → pages → components
       ↓
  contexts → api.js → axios
       ↓
  MarkdownEditor → prosemirror → yjs → socket.io-client
```

### Backend Dependencies
```
express → routes → services → openai
          ↓         ↓
       models → mongoose
          ↓
     middleware (auth)
          ↓
      websocket → socket.io → yjs
```

## Configuration Flow

```
.env.example
    ↓ (copy to)
   .env
    ↓ (loaded by)
server/index.js & vite.config.js
    ↓ (provides to)
All application modules
```

## Data Flow Architecture

### Request Flow (REST)
```
Client (Browser)
    ↓ HTTP Request
Vite Dev Proxy
    ↓
Express Router
    ↓
Auth Middleware
    ↓
Route Handler
    ↓
Service Layer (if needed)
    ↓
MongoDB/OpenAI
    ↓
Response
    ↓
Client (State Update)
```

### Real-Time Flow (WebSocket)
```
User Action (Editor)
    ↓
ProseMirror Transaction
    ↓
Yjs Update
    ↓
WebSocket (Socket.IO)
    ↓
Server Broadcast
    ↓
All Connected Clients
    ↓
Apply Yjs Update
    ↓
Editor View Update
```

## Environment-Specific Files

### Development
- `.env` - Local configuration
- `vite.config.js` - Dev server with HMR
- `nodemon` - Auto-restart on changes

### Production
- `.env` or environment variables
- `npm run build` - Optimized bundle
- `pm2` or `docker-compose` - Process management

## Build Outputs

### Frontend Build
```
npm run build
    ↓
dist/
  ├── index.html
  ├── assets/
  │   ├── index-[hash].js
  │   └── index-[hash].css
  └── (other assets)
```

### Backend
No build step needed - Node.js runs directly from `server/`

## Important Notes

1. **Never commit `.env`** - Use `.env.example` as template
2. **MongoDB required** - Start before running app
3. **OpenAI API key needed** - For AI features
4. **Ports**: Frontend (5173), Backend (3001), MongoDB (27017)
5. **Real-time requires WebSocket** - Ensure firewall allows connections

## Quick File Lookup

Need to modify...

- **UI layout?** → `src/components/Layout.jsx`
- **Editor behavior?** → `src/components/MarkdownEditor.jsx`
- **AI research logic?** → `server/services/aiResearchAgent.js`
- **Database schema?** → `server/models/*`
- **API endpoints?** → `server/routes/*`
- **Styling?** → `src/index.css` or `tailwind.config.js`
- **Auth logic?** → `server/routes/auth.js` + `src/contexts/AuthContext.jsx`

## Testing Files

- `vitest.config.js` - Test runner configuration
- `src/test/setup.js` - Global test setup
- `*.test.js` - Test files (create alongside components)

## Next Steps

1. Review [QUICKSTART.md](QUICKSTART.md) to run the app
2. Read [ARCHITECTURE.md](ARCHITECTURE.md) for design decisions
3. Check [CONTRIBUTING.md](CONTRIBUTING.md) to contribute
4. See [DEPLOYMENT.md](DEPLOYMENT.md) for production setup

---

**This structure is designed for:**
- Clear separation of concerns
- Easy navigation and maintenance
- Scalability and extensibility
- Team collaboration
- Production readiness

---

**Neura** - Created by [SELODev](https://selodev.com)  
Repository: https://github.com/selodesigns/Neura
