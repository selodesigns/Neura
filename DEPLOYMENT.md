# Deployment Guide

## Production Deployment Checklist

### Pre-Deployment

- [ ] Set all environment variables
- [ ] Configure MongoDB Atlas or production database
- [ ] Obtain OpenAI API key with sufficient credits
- [ ] Set up domain and SSL certificates
- [ ] Configure CORS for production domain
- [ ] Set secure JWT secret (32+ characters)
- [ ] Enable rate limiting
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy

### Environment Variables

```env
# Production Environment Variables
NODE_ENV=production
PORT=4000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/neura
JWT_SECRET=your_very_long_and_secure_secret_key_here
JWT_EXPIRES_IN=7d
OPENAI_API_KEY=sk-your-openai-key
OPENAI_MODEL=gpt-4-turbo-preview
CLIENT_URL=https://your-domain.com
WS_PORT=4001
```

## Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend)

**Frontend (Vercel):**
```bash
# Install Vercel CLI
npm i -g vercel

# Build and deploy
npm run build
vercel --prod
```

**Backend (Railway):**
1. Create Railway account
2. Create new project
3. Connect GitHub repository
4. Set environment variables
5. Deploy automatically on push

### Option 2: DigitalOcean Droplet

**Server Setup:**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Install PM2 for process management
sudo npm install -g pm2

# Clone and setup project
git clone https://github.com/selodesigns/Neura.git
cd Neura
npm install
npm run build
```

**PM2 Configuration:**
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'neura-server',
    script: './server/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 4000
    }
  }]
};
```

**Start with PM2:**
```bash
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

### Option 3: Docker Deployment

**Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3001 5173

CMD ["npm", "start"]
```

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:6.0
    volumes:
      - mongo-data:/data/db
    environment:
      MONGO_INITDB_DATABASE: neura

  app:
    build: .
    ports:
      - "3001:3001"
      - "5173:5173"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/neura
      - JWT_SECRET=${JWT_SECRET}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    depends_on:
      - mongodb

volumes:
  mongo-data:
```

**Deploy:**
```bash
docker-compose up -d
```

### Option 4: AWS Deployment

**Services Used:**
- EC2: Application server
- RDS/DocumentDB: MongoDB
- S3: Static assets
- CloudFront: CDN
- Route 53: DNS
- Certificate Manager: SSL

**Basic EC2 Setup:**
```bash
# SSH into EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Follow DigitalOcean setup steps above
# Configure security groups for ports 80, 443, 3001
```

## Nginx Configuration

**Frontend Proxy:**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5555;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /socket.io {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## SSL Setup with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal is configured automatically
```

## Monitoring Setup

**PM2 Monitoring:**
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
```

**Application Monitoring:**
- Use services like New Relic, DataDog, or Sentry
- Set up error tracking and alerting
- Monitor OpenAI API usage and costs

## Backup Strategy

**Database Backup:**
```bash
# Create backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="mongodb://localhost:27017/neura" --out="/backups/neura_$DATE"

# Compress backup
tar -czf "/backups/neura_$DATE.tar.gz" "/backups/neura_$DATE"
rm -rf "/backups/neura_$DATE"

# Upload to S3 (optional)
aws s3 cp "/backups/neura_$DATE.tar.gz" s3://your-backup-bucket/
```

**Cron Job:**
```bash
# Daily backup at 2 AM
0 2 * * * /path/to/backup-script.sh
```

## Performance Optimization

**Production Optimizations:**
1. Enable gzip compression in Nginx
2. Set proper cache headers
3. Use CDN for static assets
4. Enable MongoDB indexing
5. Implement Redis caching
6. Use connection pooling
7. Enable HTTP/2

**Nginx gzip:**
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
```

## Scaling Considerations

**Horizontal Scaling:**
- Use load balancer (AWS ALB, Nginx)
- Multiple application instances
- Redis for session sharing
- Sticky sessions for WebSocket

**Database Scaling:**
- MongoDB replica sets
- Read replicas for analytics
- Sharding for large datasets

## Health Checks

**Backend Health Check**
Already implemented at `/api/health` on port 4000

**Monitoring Script:**
```bash
#!/bin/bash
HEALTH_URL="https://your-domain.com:4000/api/health"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_URL)

if [ $RESPONSE != "200" ]; then
    # Send alert (email, Slack, PagerDuty)
    echo "Health check failed: HTTP $RESPONSE"
fi
```

## Rollback Strategy

**Quick Rollback:**
```bash
# With PM2
pm2 stop neura-server
git checkout previous-stable-tag
npm install
npm run build
pm2 start neura-server

# With Docker
docker-compose down
docker-compose pull previous-image-tag
docker-compose up -d
```

## Post-Deployment

- [ ] Verify all endpoints are accessible
- [ ] Test authentication flow
- [ ] Create test documents
- [ ] Test real-time collaboration
- [ ] Verify AI research functionality
- [ ] Check analytics dashboard
- [ ] Monitor error logs for 24 hours
- [ ] Set up status page
- [ ] Update documentation
- [ ] Notify users of new deployment

## Troubleshooting

**Common Issues:**

1. **WebSocket Connection Failed**
   - Check firewall rules
   - Verify Nginx WebSocket configuration
   - Ensure WS port is open

2. **MongoDB Connection Error**
   - Verify connection string
   - Check MongoDB service status
   - Review authentication credentials

3. **OpenAI API Errors**
   - Verify API key
   - Check rate limits
   - Monitor quota usage

4. **High Memory Usage**
   - Adjust Node.js memory limit
   - Review Yjs document cleanup
   - Check for memory leaks

## Support

For deployment issues:
- Website: https://selodev.com
- GitHub Issues: https://github.com/selodesigns/Neura/issues
- Discord: https://discord.gg/selodev
- Email: selodev3d@gmail.com

**Created by [SELODev](https://selodev.com)**
