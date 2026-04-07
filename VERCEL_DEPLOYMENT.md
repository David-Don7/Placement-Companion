# 🚀 Deployment Guide - Vercel Hosting

## Prerequisites
- Vercel Account (free): https://vercel.com
- MongoDB Atlas Account (free): https://mongodb.com/cloud/atlas
- GitHub Repository with code pushed

---

## ✅ Step 1: Set Up MongoDB Atlas

1. **Create Account**
   - Go to https://mongodb.com/cloud/atlas
   - Sign up (free)
   - Create a new project

2. **Create Cluster**
   - Choose "Shared" (free tier)
   - Select your region
   - Name: `placement-companion`
   - Create Cluster

3. **Add Database User**
   - Go to "Database Access"
   - Create user with password
   - Save credentials: `username:password`

4. **Get Connection String**
   - Go to "Database"
   - Click "Connect"
   - Select "Connect your application"
   - Copy string: `mongodb+srv://username:password@cluster.mongodb.net/placement-companion`
   - Replace `<password>` with your password

---

## ✅ Step 2: Deploy to Vercel

### Option A: Using Vercel CLI (Recommended)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy
cd "C:\Users\abishek sr\Documents\GitHub\Placement-Companion"
vercel --prod

# 4. During deployment, set environment variables:
# MONGODB_URI = mongodb+srv://user:pass@cluster.mongodb.net/placement-companion
# JWT_SECRET = your-secret-key-here
```

### Option B: Using GitHub Integration (Easier)

1. **Push Code to GitHub**
   ```bash
   git add .
   git commit -m "deployment: add vercel config"
   git push origin master
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com/new
   - Click "Import Git Repository"
   - Select your GitHub repo
   - Click "Import"

3. **Set Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add:
     - `MONGODB_URI` = `mongodb+srv://user:pass@cluster.mongodb.net/placement-companion`
     - `JWT_SECRET` = `your-secret-key`
     - `NODE_ENV` = `production`
   - Click "Save"

4. **Deploy**
   - Vercel auto-deploys
   - Wait for build to complete
   - Get your URL: `https://placement-companion.vercel.app`

---

## ⚙️ Step 3: Update Frontend URLs

After deployment, update your frontend files to use the Vercel URL:

**In all .html files, change:**
```javascript
// OLD (localhost)
const API_BASE = 'http://localhost:5000';

// NEW (Vercel)
const API_BASE = 'https://your-deployment.vercel.app';
```

Or better - use dynamic URL:
```javascript
const API_BASE = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000' 
  : 'https://your-deployment.vercel.app';
```

---

## 🗄️ Database Setup on Vercel

1. **MongoDB Atlas runs in cloud** ✅
   - No setup needed on Vercel side
   - Vercel automatically connects via MONGODB_URI

2. **Seed Data**
   ```bash
   # Run once after deployment
   curl https://your-deployment.vercel.app/api/seed-coding-problems
   ```

---

## 📋 Costs

| Component | Cost |
|-----------|------|
| Vercel | FREE (up to 100K serverless invocations/month) |
| MongoDB Atlas | FREE (512MB storage, 3 shared nodes) |
| Domain | $0-15/month (optional) |
| **Total** | **FREE** ✅ |

---

## 🔧 Troubleshooting

### Issue: "ECONNREFUSED localhost:27017"
- **Cause:** Still using local MongoDB
- **Fix:** Set MONGODB_URI environment variable in Vercel

### Issue: "Cannot GET /api/..."
- **Cause:** API routes not configured
- **Fix:** Verify `vercel.json` is in root directory

### Issue: "CORS errors"
- **Cause:** Domain mismatch
- **Fix:** Update API_BASE URL in frontend files

### Issue: "Server Error 500"
- **Cause:** Missing environment variables
- **Fix:** Check Vercel Project Settings → Environment Variables

---

## 📝 Production Checklist

- [ ] MongoDB Atlas cluster created and running
- [ ] Environment variables set in Vercel
- [ ] `vercel.json` configured in repo
- [ ] Code pushed to GitHub
- [ ] Vercel deployment successful
- [ ] Frontend URLs updated to production domain
- [ ] Test login functionality
- [ ] Test aptitude quiz workflow
- [ ] Test coding practice feature
- [ ] Monitor Vercel dashboard for errors

---

## 🌐 Custom Domain (Optional)

In Vercel Project Settings → Domains:
1. Add your domain (e.g., placement.com)
2. Add CNAME record to DNS provider pointing to Vercel
3. Wait 5-10 minutes for DNS propagation

---

## 📊 Monitor Production

- **Vercel Dashboard:** https://vercel.com/dashboard
- **View Logs:** Click deployment → Logs
- **Monitor Performance:** Analytics tab
- **Database:** MongoDB Atlas dashboard

---

## 🎉 You're Live!

Your app is now accessible to everyone at:
```
https://your-deployment.vercel.app
```

Share this URL with your friends! 🚀
