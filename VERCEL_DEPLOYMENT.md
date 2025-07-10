# CryptoQuest - Vercel Deployment Guide

## Overview
This guide provides step-by-step instructions for deploying your CryptoQuest DeFi/Gaming platform to Vercel with proper configuration for production use.

## Prerequisites
- Vercel account (free tier available)
- GitHub account
- Required API keys and environment variables

## Step 1: Prepare Your Project for Vercel

### 1.1 Create Vercel Configuration
Create a `vercel.json` file in your project root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/index.ts",
      "use": "@vercel/node",
      "config": {
        "includeFiles": ["server/**", "shared/**"]
      }
    },
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist/public"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/dist/public/$1"
    }
  ],
  "functions": {
    "server/index.ts": {
      "maxDuration": 30
    }
  },
  "env": {
    "NODE_ENV": "production"
  }
}
```

### 1.2 Update Package.json Scripts
Add the following scripts to your `package.json`:

```json
{
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "start": "NODE_ENV=production node dist/index.js",
    "vercel-build": "npm run build",
    "check": "tsc",
    "db:push": "drizzle-kit push"
  }
}
```

## Step 2: Environment Variables Setup

### 2.1 Required Environment Variables
Set these variables in your Vercel dashboard:

#### Database Configuration
- `DATABASE_URL` - Your PostgreSQL database connection string
- `SESSION_SECRET` - Random secret for session management

#### Blockchain Configuration
- `COINBASE_API_KEY` - Coinbase API key
- `COINBASE_API_SECRET` - Coinbase API secret
- `MORALIS_API_KEY` - Moralis API key for blockchain data

#### AI Services
- `ANTHROPIC_API_KEY` - Claude API key
- `OPENAI_API_KEY` - OpenAI API key
- `DEEPSEEK_API_KEY` - DeepSeek API key
- `GROK_API_KEY` - Grok API key

#### External Services
- `STRIPE_SECRET_KEY` - Stripe API key for payments
- `NVIDIA_API_KEY` - NVIDIA DGX Cloud API key
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key

### 2.2 Setting Environment Variables in Vercel
1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable with appropriate values

## Step 3: Database Setup

### 3.1 PostgreSQL Database
We recommend using one of these providers:
- **Neon** (recommended) - Free PostgreSQL with serverless scaling
- **Supabase** - Free PostgreSQL with additional features
- **PlanetScale** - MySQL alternative with serverless scaling

### 3.2 Database Migration
After deployment, run database migrations:
```bash
npm run db:push
```

## Step 4: Deploy to Vercel

### 4.1 Deploy via GitHub (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure build settings (usually auto-detected)

3. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be available at `https://your-project-name.vercel.app`

### 4.2 Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

## Step 5: Post-Deployment Configuration

### 5.1 Domain Configuration
1. In Vercel dashboard, go to Settings → Domains
2. Add your custom domain
3. Configure DNS settings as instructed

### 5.2 SSL Certificate
Vercel automatically provides SSL certificates for all deployments.

### 5.3 Performance Optimization
- Enable Edge Functions for better performance
- Configure caching headers
- Use Vercel Analytics for monitoring

## Step 6: Monitoring and Maintenance

### 6.1 Vercel Analytics
Enable Vercel Analytics to monitor:
- Page views and user interactions
- Performance metrics
- Error tracking

### 6.2 Function Logs
Monitor serverless function logs in Vercel dashboard:
- Functions → View Function Logs
- Real-time error tracking
- Performance monitoring

### 6.3 Database Monitoring
Monitor your database:
- Connection pool usage
- Query performance
- Storage usage

## Step 7: Troubleshooting

### Common Issues

1. **Build Failures**
   - Check build logs in Vercel dashboard
   - Verify all dependencies are in package.json
   - Ensure TypeScript compilation succeeds

2. **Environment Variable Issues**
   - Double-check variable names and values
   - Ensure sensitive data is properly secured
   - Verify API keys are valid

3. **Database Connection Issues**
   - Verify DATABASE_URL format
   - Check database server accessibility
   - Ensure connection limits aren't exceeded

4. **API Route Issues**
   - Check function timeout limits (max 30s on free tier)
   - Verify API endpoints are properly configured
   - Monitor function execution logs

### Performance Tips

1. **Optimize Bundle Size**
   - Use dynamic imports for large components
   - Implement code splitting
   - Remove unused dependencies

2. **Database Optimization**
   - Use connection pooling
   - Optimize queries
   - Implement proper indexing

3. **Caching Strategy**
   - Implement Redis for session storage
   - Use CDN for static assets
   - Configure proper cache headers

## Step 8: Security Best Practices

### 8.1 Environment Security
- Never commit API keys to version control
- Use Vercel's environment variable encryption
- Rotate API keys regularly

### 8.2 Application Security
- Implement rate limiting
- Use HTTPS only
- Validate all input data
- Implement proper CORS policies

### 8.3 Database Security
- Use parameterized queries
- Implement proper authentication
- Regular security audits
- Backup strategies

## Step 9: Scaling Considerations

### 9.1 Vercel Limits
- Free tier: 100GB bandwidth/month
- Pro tier: 1TB bandwidth/month
- Function execution time: 10s (Hobby), 60s (Pro)

### 9.2 Database Scaling
- Monitor connection usage
- Implement connection pooling
- Consider read replicas for heavy read workloads

### 9.3 Performance Monitoring
- Set up alerts for high error rates
- Monitor response times
- Track resource usage

## Deployment Checklist

- [ ] Created `vercel.json` configuration
- [ ] Updated package.json scripts
- [ ] Set up all environment variables
- [ ] Configured database connection
- [ ] Pushed code to GitHub
- [ ] Connected repository to Vercel
- [ ] Deployed successfully
- [ ] Tested all dashboard functionality
- [ ] Configured custom domain (optional)
- [ ] Set up monitoring and analytics
- [ ] Implemented security best practices

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [PostgreSQL on Vercel](https://vercel.com/docs/storage/vercel-postgres)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

## Conclusion

Your CryptoQuest platform is now ready for production deployment on Vercel. The platform includes:

- **NVIDIA DGX Cloud Platform** - Enterprise GPU computing
- **Unified DeFi Dashboard** - Comprehensive DeFi operations
- **AI Agent Dashboard** - Coinbase AgentKit integration
- **Coinbase OnRamper** - Fiat-to-crypto conversion
- **Gaming Hub** - Advanced gaming features

For additional support or custom deployment requirements, refer to the official Vercel documentation or contact their support team.