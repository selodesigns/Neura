# Neura - AI-Driven Collaborative Knowledge Explorer

![Neura Banner](https://via.placeholder.com/1200x300/0ea5e9/ffffff?text=Neura+Knowledge+Explorer)

An advanced AI-powered collaborative knowledge exploration tool that combines multi-perspective research agents with real-time markdown editing and comprehensive analytics.

## 🌟 Features

### ✨ Key Features

### 🧠 AI-Powered Research (OpenAI or Local with Ollama)

**Flexible AI Backend:**
- Use **OpenAI GPT-4** for cloud-based AI
- Or use **Ollama** for completely local, private AI
- Switch between providers easily
- See [comparison guide](docs/OLLAMA_COMPARISON.md)

### 📝 Core Features
- **Multi-Perspective Research**: Explore topics from analytical, creative, critical, historical, practical, and theoretical perspectives
- **Real-Time Collaborative Editing**: Built with Yjs and ProseMirror for seamless multi-user collaboration
- **Markdown Support**: Full markdown editing with live preview and syntax highlighting
- **Version Control**: Track changes and maintain version history for all documents
- **Analytics Dashboard**: Comprehensive insights into document usage, collaboration, and AI interactions
- **Role-Based Access Control**: Support for researchers, collaborators, and viewers with granular permissions

### AI Research Agent Capabilities
- Question reformulation for diverse perspectives
- Multi-perspective analysis
- Response synthesis and summarization
- Inline content suggestions
- Section expansion and elaboration
- Research history tracking

### Collaboration Features
- Real-time cursor tracking
- User presence indicators
- Typing indicators
- Document sharing with permission management
- Collaborative annotations

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 18 with React Router
- Tailwind CSS for styling
- ProseMirror for rich text editing
- Yjs for CRDT-based collaboration
- Recharts for data visualization
- Lucide React for icons

**Backend:**
- Node.js with Express
- MongoDB with Mongoose
- Socket.IO for WebSocket communication
- OpenAI GPT-4 for AI capabilities
- JWT for authentication

**Real-Time Collaboration:**
- Yjs for conflict-free replicated data types
- WebSocket provider for synchronization
- Awareness protocol for presence

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB 4.4+
- **AI Provider (choose one):**
  - OpenAI API Key (cloud)
  - OR Ollama installed (local) - See [OLLAMA_SETUP.md](OLLAMA_SETUP.md)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/selodesigns/Neura.git
   cd Neura
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   
   **Option A: Using OpenAI (Cloud)**
   ```env
   LLM_PROVIDER=openai
   OPENAI_API_KEY=your_openai_api_key
   OPENAI_MODEL=gpt-4-turbo-preview
   MONGODB_URI=mongodb://localhost:27017/neura
   JWT_SECRET=your_secure_secret_key
   PORT=4000
   CLIENT_URL=http://localhost:5555
   ```
   
   **Option B: Using Ollama (Local)**
   ```env
   LLM_PROVIDER=ollama
   OLLAMA_BASE_URL=http://localhost:11434
   OLLAMA_MODEL=llama2
   MONGODB_URI=mongodb://localhost:27017/neura
   JWT_SECRET=your_secure_secret_key
   PORT=4000
   CLIENT_URL=http://localhost:5555
   ```
   
   📖 See [OLLAMA_SETUP.md](OLLAMA_SETUP.md) for detailed Ollama setup

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Atlas cloud service
   ```

5. **Run the application**
   ```bash
   # Development mode (runs both client and server)
   npm run dev
   
   # Or run separately:
   npm run dev:client  # Frontend on http://localhost:5555
   npm run dev:server  # Backend on http://localhost:4000
   ```

6. **Access the application**
   - Open http://localhost:5555 in your browser
   - Register a new account
   - Start exploring!

## 📚 Usage Guide

### Creating Documents
1. Navigate to the Documents page
2. Click "New Document"
3. Enter a title and start writing
4. Content is auto-saved as you type

### AI Research
1. Open a document or go to the Research page
2. Enter your research query
3. Select desired perspectives
4. Click "Research" to get multi-perspective insights
5. Results are automatically saved to document history

### Collaboration
1. Share a document by adding collaborators
2. Multiple users can edit simultaneously
3. See real-time cursors and changes
4. Access version history anytime

### Analytics
- View dashboard for overview statistics
- Track document performance
- Monitor collaboration patterns
- Analyze AI query trends

## 🔧 Configuration

### OpenAI Settings
Configure in `server/config/openai.js`:
- Model selection (GPT-4, GPT-3.5-turbo)
- Temperature and token limits
- Custom system prompts

### Collaboration Settings
Adjust in `server/websocket/index.js`:
- WebSocket connection settings
- Awareness protocol configuration
- Synchronization intervals

### Database Schema
Models defined in `server/models/`:
- **User**: Authentication and profiles
- **Document**: Content and metadata
- Version history and analytics

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- auth.test.js
```

## 📁 Project Structure

```
neura/
├── src/                      # Frontend source
│   ├── components/          # React components
│   ├── contexts/            # React contexts
│   ├── pages/               # Page components
│   ├── lib/                 # Utilities and API
│   └── main.jsx            # Entry point
├── server/                  # Backend source
│   ├── routes/             # API routes
│   ├── models/             # Database models
│   ├── services/           # Business logic
│   ├── middleware/         # Express middleware
│   ├── websocket/          # WebSocket handlers
│   └── index.js            # Server entry
├── public/                 # Static assets
└── package.json           # Dependencies
```

## 🎨 Customization

### Styling
- Modify `tailwind.config.js` for theme customization
- Edit `src/index.css` for global styles
- Component styles use Tailwind utility classes

### AI Perspectives
Add custom perspectives in `server/services/aiResearchAgent.js`:
```javascript
const perspectivePrompts = {
  custom: 'Your custom perspective prompt here',
  // ... add more
};
```

### UI Components
Customize components in `src/components/`:
- `Layout.jsx` - Main layout structure
- `MarkdownEditor.jsx` - Editor configuration
- `AIResearchPanel.jsx` - Research interface

## 🚢 Deployment

### Frontend (Vercel/Netlify)
1. Build the frontend:
   ```bash
   npm run build
   ```
2. Deploy the `dist` folder

### Backend (AWS/DigitalOcean/Heroku)
1. Set environment variables
2. Start server:
   ```bash
   npm run server
   ```

### Docker Deployment
```bash
# Build image
docker build -t neura .

# Run container
docker run -p 3001:3001 -p 5173:5173 neura
```

## 🔐 Security

- JWT-based authentication
- Password hashing with bcrypt
- CORS configuration
- MongoDB injection prevention
- XSS protection
- Rate limiting (recommended for production)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Documents
- `GET /api/documents` - List all documents
- `GET /api/documents/:id` - Get document
- `POST /api/documents` - Create document
- `PUT /api/documents/:id` - Update document
- `DELETE /api/documents/:id` - Delete document

### AI Research
- `POST /api/ai/research` - Conduct research
- `POST /api/ai/synthesize` - Synthesize responses
- `POST /api/ai/suggest` - Get inline suggestions
- `POST /api/ai/expand` - Expand content

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard data
- `GET /api/analytics/document/:id` - Get document analytics

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check MongoDB status
mongod --version
systemctl status mongod
```

### WebSocket Connection Failures
- Verify ports are not blocked
- Check firewall settings
- Ensure WebSocket support in proxy/load balancer

### OpenAI API Errors
- Verify API key is correct
- Check API quota and billing
- Monitor rate limits

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- OpenAI for GPT models
- ProseMirror for rich text editing
- Yjs for CRDT implementation
- The open-source community

## 📧 Support

- Website: [selodev.com](https://selodev.com)
- Issues: [GitHub Issues](https://github.com/selodesigns/Neura/issues)
- Documentation: [Wiki](https://github.com/selodesigns/Neura/wiki)
- Discord: [SELODev Community](https://discord.gg/selodev)
- Email: selodev3d@gmail.com

---

**Built with ❤️ by [SELODev](https://selodev.com) for collaborative knowledge exploration**  
GitHub: [github.com/selodesigns](https://github.com/selodesigns)
