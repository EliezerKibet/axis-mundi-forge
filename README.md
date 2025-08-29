# Axis Mundi Technologies

A cutting-edge technology company specializing in advanced engineering solutions, AI, quantum computing, and next-generation technology development.

## Project Overview

Professional tech company website built with:
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Build Tool**: Vite
- **UI Components**: shadcn/ui
- **Responsive**: Mobile-first design

## Live Site

🌐 **Production**: [axismunditech.com](http://axismunditech.com)

## Local Development

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd axis-mundi-technologies

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment on Render.com

### Prerequisites
1. GitHub repository with your code
2. Render.com account
3. Domain registered (axismunditech.com)

### Step-by-Step Deployment

#### 1. Initial Setup
1. **Connect GitHub**: Link your GitHub account to Render.com
2. **Create Web Service**: Click "New +" → "Web Service"
3. **Select Repository**: Choose your Axis Mundi Technologies repository

#### 2. Configure Build Settings
Use these exact settings in Render dashboard:

**Basic Settings:**
- **Name**: `axismundi-technologies`
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main` (or your default branch)

**Build & Deploy:**
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run preview`
- **Publish Directory**: `dist`

**Environment Variables:**
- `NODE_ENV` = `production`

#### 3. Alternative: Use render.yaml (Recommended)
The included `render.yaml` file automates deployment configuration:

```yaml
services:
  - type: web
    name: axismundi-technologies
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm run preview
    envVars:
      - key: NODE_ENV
        value: production
    staticPublishPath: ./dist
```

#### 4. Deploy
1. **Commit Changes**: Push `render.yaml` to your repository
2. **Deploy**: Render automatically detects and deploys
3. **Monitor**: Check deployment logs for any issues

### Custom Domain Setup (axismunditech.com)

#### 1. In Render Dashboard
1. **Navigate**: Go to your deployed service
2. **Settings**: Click "Settings" tab
3. **Custom Domains**: Scroll to "Custom Domains" section
4. **Add Domain**: Click "Add Custom Domain"
5. **Enter Domain**: Add `axismunditech.com` and `www.axismunditech.com`

#### 2. DNS Configuration
Configure these DNS records with your domain registrar:

**A Records:**
```
Type: A
Name: @
Value: [Render's IP - provided in dashboard]
TTL: 3600

Type: A  
Name: www
Value: [Render's IP - provided in dashboard]
TTL: 3600
```

**CNAME Record (Alternative for www):**
```
Type: CNAME
Name: www
Value: axismundi-technologies.onrender.com
TTL: 3600
```

#### 3. SSL Certificate
- **Automatic**: Render provides free SSL certificates
- **Activation**: SSL activates automatically after DNS propagation
- **Timeline**: Usually 5-10 minutes, can take up to 24 hours

### Verification Steps

1. **Build Success**: Check deployment logs show "Build successful"
2. **Service Running**: Service status shows "Live"
3. **Domain Resolution**: Test `axismunditech.com` loads correctly
4. **SSL Active**: Verify HTTPS works: `https://axismunditech.com`
5. **Redirects**: Confirm www redirects to non-www (or vice versa)

### Troubleshooting

**Build Failures:**
- Check Node.js version compatibility
- Verify all dependencies in package.json
- Review build logs for specific errors

**Domain Issues:**
- Use DNS checker tools to verify propagation
- Ensure no conflicting DNS records
- Wait up to 48 hours for full propagation

**Performance:**
- Enable gzip compression in Render settings
- Monitor Core Web Vitals
- Optimize images and assets

### Monitoring & Maintenance

- **Logs**: Monitor deployment and runtime logs
- **Analytics**: Set up monitoring for uptime/performance
- **Updates**: Automatic deployments on git push
- **Backups**: Render handles infrastructure backups

### Support Resources

- **Render Docs**: [render.com/docs](https://render.com/docs)
- **Domain Setup**: [render.com/docs/custom-domains](https://render.com/docs/custom-domains)
- **SSL Issues**: [render.com/docs/tls-ssl](https://render.com/docs/tls-ssl)

---

## Technologies Used

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS, Custom Design System
- **Build**: Vite
- **UI**: shadcn/ui, Radix UI
- **Icons**: Lucide React
- **Deployment**: Render.com
- **Domain**: axismunditech.com
