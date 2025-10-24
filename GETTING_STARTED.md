# 🚀 Getting Started with Neura

Welcome! You now have a complete AI-driven collaborative knowledge exploration tool. This guide will help you understand what's been built and how to use it.

## ✅ What's Been Built

Your Neura application includes:

### 🎯 Core Features
✅ **AI Research Agent** - Multi-perspective research with 6 different viewpoints  
✅ **Real-Time Collaboration** - Edit documents together with live cursors  
✅ **Markdown Editor** - Full-featured ProseMirror editor with Yjs CRDT  
✅ **Version Control** - Track all changes and document history  
✅ **Analytics Dashboard** - Comprehensive usage insights and metrics  
✅ **Authentication** - Secure JWT-based auth with role management  
✅ **Document Management** - Full CRUD operations with permissions  
✅ **Research Lab** - Standalone interface for AI exploration  

### 🛠️ Technical Stack
- **Frontend**: React 18 + Vite + Tailwind CSS + ProseMirror
- **Backend**: Node.js + Express + MongoDB + Socket.IO
- **AI**: OpenAI GPT-4 integration
- **Real-Time**: Yjs CRDT + WebSocket
- **Deployment**: Docker, PM2, and cloud-ready

### 📦 Complete File Structure
```
✓ 60+ files created
✓ Full frontend application (React)
✓ Complete backend API (Express)
✓ Database models (MongoDB)
✓ Real-time collaboration (WebSocket)
✓ AI research service (OpenAI)
✓ Comprehensive documentation
✓ Docker configuration
✓ Testing setup
```

## 🎬 Quick Start (5 Minutes)

### Step 1: Install Dependencies
```bash
cd /mnt/local/Projects/GitHub/Neura
npm install
```

### Step 2: Configure Environment
```bash
cp .env.example .env
```

Edit `.env` with your settings:
```env
OPENAI_API_KEY=sk-your-openai-api-key-here
MONGODB_URI=mongodb://localhost:27017/neura
JWT_SECRET=create-a-secure-secret-key-minimum-32-characters
PORT=4000
CLIENT_URL=http://localhost:5555
```

### Step 3: Start MongoDB
```bash
# Option 1: Local MongoDB
mongod

# Option 2: Docker
docker run -d -p 27017:27017 --name neura-mongo mongo:6.0

# Option 3: Use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env
```

### Step 4: Run the Application
```bash
# Start both frontend and backend
npm run dev

# Or run separately:
npm run dev:client  # Frontend: http://localhost:5555
npm run dev:server  # Backend: http://localhost:4000
```

### Step 5: Access the Application
Open http://localhost:5555 in your browser and create an account!

## 📖 Key Documentation

| Document | What It Covers |
|----------|---------------|
| **[README.md](README.md)** | Complete project overview and features |
| **[QUICKSTART.md](QUICKSTART.md)** | 5-minute setup with troubleshooting |
| **[ARCHITECTURE.md](ARCHITECTURE.md)** | System design and technical decisions |
| **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** | File organization and purposes |
| **[DEPLOYMENT.md](DEPLOYMENT.md)** | Production deployment guide |
| **[CONTRIBUTING.md](CONTRIBUTING.md)** | How to contribute to the project |

## 🎓 Using the Application

### Creating Your First Document
1. Log in to the dashboard
2. Click "New Document" button
3. Enter a title
4. Start writing in markdown
5. Content auto-saves every few seconds

### Using AI Research
**Method 1: In-Document Research**
1. Open any document
2. Click "Show AI Research" button
3. Enter your research query
4. View multi-perspective insights
5. Insights are saved to document history

**Method 2: Research Lab**
1. Navigate to "Research" page
2. Enter your query
3. Select desired perspectives (3-6 recommended)
4. Click "Research" button
5. Explore detailed responses

### Collaborating in Real-Time
1. Create or open a document
2. Share the document URL with collaborators
3. Add collaborators through the interface
4. Edit simultaneously - see live cursors
5. Changes sync in real-time via CRDT

### Viewing Analytics
1. Navigate to "Analytics" page
2. See overview statistics
3. Track document performance
4. Monitor AI query usage
5. View collaboration patterns

## 🔑 Key Features Explained

### AI Research Perspectives

| Perspective | What It Does |
|------------|--------------|
| **Analytical** | Data-driven, logical analysis |
| **Creative** | Innovative, out-of-the-box thinking |
| **Critical** | Evaluates limitations and biases |
| **Historical** | Context and evolution over time |
| **Practical** | Real-world applications |
| **Theoretical** | Underlying principles and concepts |

### Real-Time Collaboration

**How It Works:**
- Uses Yjs CRDT (Conflict-free Replicated Data Type)
- Changes merge automatically without conflicts
- See collaborators' cursors in real-time
- Typing indicators show who's active
- No data loss, even with poor connections

### Markdown Support

Full markdown syntax:
```markdown
# Headings (H1-H6)
**Bold** and *Italic*
- Lists
1. Numbered lists
[Links](url)
`inline code`
> Blockquotes
```

## 🧪 Testing Your Setup

### Backend Health Check
```bash
curl http://localhost:4000/api/health
# Should return: {"status":"ok","timestamp":"..."}
```

### Test MongoDB Connection
```bash
mongosh
> show dbs
# Should show neura database after first use
```

### Test AI Integration
In the app, try a research query:
- Query: "What is machine learning?"
- If successful, you'll get multi-perspective responses

## 🐛 Common Issues & Solutions

### "Cannot connect to MongoDB"
```bash
# Check if MongoDB is running
ps aux | grep mongod

# Start MongoDB
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
```

### "Port 4000 already in use"
```bash
# Kill process on port
lsof -ti:4000 | xargs kill -9

# Or change port in .env
PORT=5000
```

### "OpenAI API Error"
- Verify your API key in `.env`
- Check API credits: https://platform.openai.com/usage
- Try different model: `OPENAI_MODEL=gpt-3.5-turbo`

### WebSocket connection fails
- Check firewall settings
- Ensure ports 4000 and 5555 are open
- Try disabling browser extensions

## 🚀 Next Steps

### For Development
1. ✅ Set up your development environment
2. 📝 Create test documents
3. 🤖 Experiment with AI research
4. 👥 Invite collaborators
5. 📊 Explore analytics

### For Production
1. 📖 Read [DEPLOYMENT.md](DEPLOYMENT.md)
2. 🔐 Review [SECURITY.md](SECURITY.md)
3. 🐳 Set up Docker deployment
4. 🌐 Configure domain and SSL
5. 📈 Set up monitoring

### For Contributing
1. 📖 Read [CONTRIBUTING.md](CONTRIBUTING.md)
2. 🔍 Browse open issues
3. 🌿 Create a feature branch
4. ✅ Add tests
5. 🔄 Submit pull request

## 📚 Learning Resources

### Understanding the Codebase
- **Frontend Entry**: `src/main.jsx` → `App.jsx` → Pages
- **Backend Entry**: `server/index.js` → Routes → Models
- **AI Logic**: `server/services/aiResearchAgent.js`
- **Collaboration**: `server/websocket/index.js` + `src/components/MarkdownEditor.jsx`

### Key Technologies to Learn
- **React**: Component-based UI (https://react.dev)
- **ProseMirror**: Rich text editing (https://prosemirror.net)
- **Yjs**: CRDT for collaboration (https://docs.yjs.dev)
- **Express**: Web framework (https://expressjs.com)
- **MongoDB**: Database (https://www.mongodb.com/docs)

## 🎯 Project Roadmap

### Completed ✅
- Core application structure
- AI research agent with 6 perspectives
- Real-time collaborative editing
- Authentication and authorization
- Analytics dashboard
- Complete documentation
- Docker deployment support

### Planned 🚧
- Export to PDF/Word
- Document templates
- Advanced search
- Multi-language support
- Mobile applications
- Browser extensions
- Offline mode

## 💡 Tips & Best Practices

### Development
- Use `npm run dev` for hot reload
- Check `logs/` for debugging
- Use browser DevTools for frontend issues
- Test API endpoints with Postman/curl

### Performance
- Documents auto-save with 500ms debounce
- Large documents may take longer to sync
- Consider pagination for 100+ documents

### Security
- Never commit `.env` file
- Use strong JWT_SECRET (32+ chars)
- Rotate OpenAI API keys regularly
- Enable HTTPS in production

### Collaboration
- Maximum 10 simultaneous collaborators recommended
- Clear old documents to reduce database size
- Use tags and categories for organization

## 🆘 Getting Help

### Documentation
- All docs in project root (*.md files)
- Inline code comments for complex logic
- JSDoc comments on key functions

### Community
- GitHub Issues: https://github.com/SELODev/Neura/issues
- GitHub Discussions: https://github.com/SELODev/Neura/discussions
- Discord: https://discord.gg/selodev
- Email: support@selodev.com

### Debugging
- Frontend: Browser DevTools Console
- Backend: Check `logs/err.log`
- Database: Use `mongosh` to inspect data
- Network: Browser Network tab for API calls

## 🎉 You're Ready!

Your Neura Knowledge Explorer is fully set up and ready to use. 

**Recommended first steps:**
1. Create your first document
2. Try an AI research query
3. Invite a friend to collaborate
4. Explore the analytics dashboard
5. Read the architecture docs to understand how it works

**Need help?** Check the documentation or reach out via GitHub Issues.

**Want to contribute?** See [CONTRIBUTING.md](CONTRIBUTING.md) - all contributions welcome!

---

**Built with ❤️ by [SELODev](https://selodev.com)**

Neura - AI-Driven Collaborative Knowledge Explorer

Happy exploring! 🚀✨
