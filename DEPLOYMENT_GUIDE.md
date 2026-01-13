# Complete Deployment Guide - Step by Step

This guide will walk you through adding your project to GitHub and deploying it on Render.

---

## PART 1: Setting Up GitHub

### Step 1: Install Git (if not already installed)

1. **Check if Git is installed:**
   - Open PowerShell or Command Prompt
   - Type: `git --version`
   - If you see a version number, Git is installed. Skip to Step 2.
   - If you see an error, Git is not installed.

2. **Download and Install Git:**
   - Go to: https://git-scm.com/download/win
   - Download the Windows installer
   - Run the installer
   - Use default settings (just click "Next" on all screens)
   - After installation, **restart your terminal/PowerShell**

3. **Verify Installation:**
   - Open a new PowerShell window
   - Type: `git --version`
   - You should see something like: `git version 2.x.x`

### Step 2: Create a GitHub Account

1. Go to: https://github.com
2. Click "Sign up" (top right)
3. Enter your email, create a password, and choose a username
4. Verify your email address
5. Complete the setup

### Step 3: Create a New Repository on GitHub

1. **Login to GitHub**
2. **Click the "+" icon** (top right) → Select "New repository"
3. **Repository Settings:**
   - **Repository name**: `Live-Weather-Dashboard` (or any name you like)
   - **Description**: "Live Weather Dashboard - Flask Application"
   - **Visibility**: Choose "Public" (free) or "Private"
   - **DO NOT** check "Initialize with README" (we already have files)
   - **DO NOT** add .gitignore or license (we already have them)
4. **Click "Create repository"**

### Step 4: Add Your Project to GitHub

**Open PowerShell in your project folder** (C:\Live-Weather-Dashboard)

Run these commands one by one:

```powershell
# 1. Initialize Git in your project
git init

# 2. Add all files to Git
git add .

# 3. Create your first commit (save point)
git commit -m "Initial commit - Live Weather Dashboard"

# 4. Rename branch to main (if needed)
git branch -M main

# 5. Connect to your GitHub repository
# REPLACE YOUR_USERNAME with your actual GitHub username
git remote add origin https://github.com/YOUR_USERNAME/Live-Weather-Dashboard.git

# 6. Push your code to GitHub
git push -u origin main
```

**Important Notes:**
- When you run `git push`, GitHub will ask for your username and password
- For password, use a **Personal Access Token** (not your GitHub password)
- See Step 5 below to create a token

### Step 5: Create a Personal Access Token (for Git authentication)

1. **Go to GitHub Settings:**
   - Click your profile picture (top right) → "Settings"
   - Or go to: https://github.com/settings/profile

2. **Create Token:**
   - Scroll down → Click "Developer settings" (left sidebar)
   - Click "Personal access tokens" → "Tokens (classic)"
   - Click "Generate new token" → "Generate new token (classic)"

3. **Token Settings:**
   - **Note**: "Git Push Token" (or any name)
   - **Expiration**: Choose 90 days (or longer)
   - **Select scopes**: Check "repo" (this gives full repository access)
   - Click "Generate token" at the bottom

4. **Copy the Token:**
   - **IMPORTANT**: Copy the token immediately (you won't see it again!)
   - It looks like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - Save it somewhere safe

5. **Use Token When Pushing:**
   - When `git push` asks for password, paste the token instead of your password
   - Username: Your GitHub username
   - Password: Paste the token

---

## PART 2: Deploying on Render

### Step 1: Sign Up for Render

1. Go to: https://render.com
2. Click "Get Started for Free" or "Sign Up"
3. Choose "Sign up with GitHub" (recommended - easier)
4. Authorize Render to access your GitHub account
5. Complete the signup process

### Step 2: Create a New Web Service

1. **In Render Dashboard:**
   - Click "New +" button (top right)
   - Select "Web Service"

2. **Connect Repository:**
   - You'll see a list of your GitHub repositories
   - Find and click on "Live-Weather-Dashboard"
   - Click "Connect"

3. **Configure Your Service:**

   **Basic Settings:**
   - **Name**: `live-weather-dashboard` (or any name you like)
   - **Region**: Choose closest to you (e.g., "Oregon (US West)")
   - **Branch**: `main` (should be selected by default)
   - **Root Directory**: Leave empty (or put `.` if needed)
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`

   **Plan:**
   - Select "Free" plan (sufficient for this project)

4. **Add Environment Variable:**
   - Scroll down to "Environment Variables" section
   - Click "Add Environment Variable"
   - **Key**: `OPENWEATHER_API_KEY`
   - **Value**: `256e4fa4236c0b50e13043fda68d41a5` (your API key)
   - Click "Add"

5. **Deploy:**
   - Scroll to the bottom
   - Click "Create Web Service"
   - Render will start building your application

### Step 3: Wait for Deployment

1. **Build Process:**
   - You'll see build logs in real-time
   - This takes 2-5 minutes
   - Watch for any errors (usually there are none)

2. **Deployment Complete:**
   - When you see "Your service is live", it's done!
   - You'll get a URL like: `https://live-weather-dashboard.onrender.com`

3. **First Launch:**
   - Free tier apps "sleep" after 15 minutes of inactivity
   - First request after sleep takes 30-60 seconds to wake up
   - This is normal for free tier

### Step 4: Test Your Live Application

1. Click on your service URL
2. Wait for it to load (may take a minute if it was sleeping)
3. Try searching for a city (e.g., "London", "Tokyo")
4. Your dashboard should work just like locally!

---

## Troubleshooting

### Git Issues

**Problem: "git is not recognized"**
- Solution: Install Git (see Step 1) and restart your terminal

**Problem: "Authentication failed" when pushing**
- Solution: Use Personal Access Token instead of password (see Step 5)

**Problem: "Repository not found"**
- Solution: Make sure you created the repository on GitHub first
- Check that the repository name matches exactly

### Render Issues

**Problem: Build fails**
- Check build logs in Render dashboard
- Make sure `requirements.txt` has all dependencies
- Verify Python version is 3.8 or higher

**Problem: App crashes after deployment**
- Check logs in Render dashboard
- Verify `OPENWEATHER_API_KEY` environment variable is set correctly
- Make sure the API key is valid

**Problem: "Application error" when visiting URL**
- Check Render logs for error messages
- Verify all environment variables are set
- Make sure `gunicorn` is in requirements.txt

### Common Questions

**Q: Do I need to pay for Render?**
- A: No, the free tier is sufficient for this project

**Q: Can I update my code after deployment?**
- A: Yes! Just push changes to GitHub, and Render will automatically redeploy

**Q: How do I update my deployed app?**
- A: Make changes locally, then:
  ```powershell
  git add .
  git commit -m "Update description"
  git push
  ```
  Render will automatically detect and redeploy

**Q: What if I want to change the API key?**
- A: Go to Render dashboard → Your service → Environment → Edit `OPENWEATHER_API_KEY` → Save → Manual Deploy

---

## Quick Reference Commands

### Git Commands (for future updates)

```powershell
# Check status
git status

# Add all changes
git add .

# Commit changes
git commit -m "Your message here"

# Push to GitHub
git push
```

### Render Dashboard
- View logs: Render Dashboard → Your Service → Logs
- View environment variables: Render Dashboard → Your Service → Environment
- Manual redeploy: Render Dashboard → Your Service → Manual Deploy

---

## Success Checklist

- [ ] Git installed and working
- [ ] GitHub account created
- [ ] Repository created on GitHub
- [ ] Code pushed to GitHub successfully
- [ ] Render account created
- [ ] Web service created on Render
- [ ] Environment variable added (OPENWEATHER_API_KEY)
- [ ] Deployment completed successfully
- [ ] Live URL is working
- [ ] Weather dashboard loads and works correctly

---

**Congratulations!** Once all checkboxes are done, your Live Weather Dashboard is live on the internet! 🎉

