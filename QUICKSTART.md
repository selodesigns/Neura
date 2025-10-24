# Quick Start Guide

Get Neura up and running in 5 minutes!

## Prerequisites

- Node.js 18 or higher
- MongoDB 4.4 or higher
- OpenAI API key

## Installation Steps

### 1. Clone and Install

```bash
git clone https://github.com/SELODev/Neura.git
cd Neura
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
OPENAI_API_KEY=sk-your-key-here
MONGODB_URI=mongodb://localhost:27017/neura
JWT_SECRET=your-secret-key-minimum-32-characters
PORT=4000
CLIENT_URL=http://localhost:5555
```

### 3. Start MongoDB

```bash
# macOS (Homebrew)
brew services start mongodb-community

# Ubuntu/Debian
sudo systemctl start mongod

# Windows
net start MongoDB

# Or use Docker
docker run -d -p 27017:27017 --name neura-mongo mongo:6.0
```

### 4. Run the Application

```bash
npm run dev
```

This starts both the frontend (http://localhost:5555) and backend (http://localhost:4000).

### 5. Create Your Account

1. Open http://localhost:5555 in your browser
2. Click "Sign up"
3. Fill in your details:
   - Name: Your Name
   - Email: your@email.com
   - Password: (min 8 characters)
   - Role: Choose "Researcher" or "Collaborator"
4. Click "Create account"

### 6. Create Your First Document

1. Click "New Document" on the dashboard
2. Enter a title: "My First Knowledge Base"
3. Start writing in the markdown editor
4. Your content auto-saves!

### 7. Try AI Research

1. Click "Show AI Research" button
2. Enter a query: "What are the benefits of collaborative learning?"
3. Select perspectives (Analytical, Creative, Critical)
4. Click "Research"
5. Explore multi-perspective insights!

## Quick Tips

### Keyboard Shortcuts
- `Ctrl/Cmd + Z`: Undo
- `Ctrl/Cmd + Y`: Redo
- `Enter`: Search on Research page

### Collaboration
1. Open a document
2. Share the URL with collaborators
3. Add them via the collaborators menu
4. Edit together in real-time!

### Markdown Support
```markdown
# Heading 1
## Heading 2

**Bold** and *italic*

- Bullet points
1. Numbered lists

`inline code`

> Blockquotes
```

## Docker Quick Start

Prefer Docker? Even easier!

```bash
# Copy environment file
cp .env.example .env

# Edit .env with your OpenAI key
nano .env

# Start everything
docker-compose up -d

# Access at http://localhost:5555
```

## Troubleshooting

### MongoDB Connection Failed
```bash
# Check if MongoDB is running
mongosh

# If not, start it
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
```

### Port Already in Use
```bash
# Find and kill process on port 4000
lsof -ti:4000 | xargs kill -9

# Or use different port in .env
PORT=5000
```

### OpenAI API Errors
- Verify your API key is correct
- Check you have credits: https://platform.openai.com/usage
- Try a different model: `OPENAI_MODEL=gpt-3.5-turbo`

## Next Steps

- 📖 Read the full [README.md](README.md)
- 🏗️ Explore [ARCHITECTURE.md](ARCHITECTURE.md)
- 🚀 Check [DEPLOYMENT.md](DEPLOYMENT.md) for production
- 🤝 See [CONTRIBUTING.md](CONTRIBUTING.md) to contribute

## Need Help?

- 💬 [GitHub Discussions](https://github.com/SELODev/Neura/discussions)
- 🐛 [GitHub Issues](https://github.com/SELODev/Neura/issues)
- 💬 [Discord Community](https://discord.gg/selodev)
- 📧 support@selodev.com

**Created by [SELODev](https://github.com/SELODev)**

Happy exploring! 🚀
