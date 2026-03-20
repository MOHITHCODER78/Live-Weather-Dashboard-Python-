# Project Deployment Guide
Step-by-Step Instructions for Your Weather Dashboard

This guide provides the necessary steps to add your project to GitHub and host it live on the internet using Render. This is the official and recommended way to get your app online.

## PART 1: Setting Up GitHub

### Step 1: Install Git
1. Open PowerShell on your computer.
2. Type: git --version
3. If you see a version number, skip to Step 2.
4. If not, download and install Git from https://git-scm.com/download/win and restart your terminal.

### Step 2: Create a GitHub Account
1. Visit https://github.com and sign up for a free account.
2. Verify your email address to complete the registration.

### Step 3: Create a New Repository
1. Log in to GitHub and click the + icon in the top right.
2. Select "New repository" and name it: Live-Weather-Dashboard
3. Ensure the visibility is set to Public or Private as needed.
4. Do not check "Initialize with README" as we already have files.
5. Click "Create repository".

### Step 4: Add Your Project to GitHub
Open PowerShell in your project folder (f:\Live-Weather-Dashboard) and run:
1. Initialize Git: git init
2. Add all files: git add .
3. Create your first commit: git commit -m "Initial commit"
4. Rename branch to main: git branch -M main
5. Connect to your repository (Replace YOUR_USERNAME):
   git remote add origin https://github.com/YOUR_USERNAME/Live-Weather-Dashboard.git
6. Push your code: git push -u origin main

Note: Use a Personal Access Token when asked for your password (see Step 5).

### Step 5: Creating a Personal Access Token
Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic).
1. Click Generate new token (classic).
2. Name it "Git Push Token" and select the "repo" scope.
3. Copy and save the token immediately.
4. Use this token instead of your password when prompted by git push.

---

## PART 2: Hosting on Render

### Step 1: Sign Up for Render
1. Visit https://render.com and sign up with your GitHub account.
2. Authorize Render to access your repositories.

### Step 2: Create a New Web Service
1. In the Render Dashboard, click New + and select "Web Service".
2. Connect the "Live-Weather-Dashboard" repository.
3. Configure the following settings:
   - Branch: main
   - Build Command: pip install -r requirements.txt
   - Start Command: gunicorn wsgi:app
   - Environment: Python 3
4. Add Environment Variable:
   - Key: OPENWEATHER_API_KEY
   - Value: Your actual OpenWeather API key
5. Click "Create Web Service".

### Step 3: Wait for Deployment
The process will take approximately 2-5 minutes. Once you see "Your service is live", click the link provided (e.g., https://live-weather-dashboard.onrender.com) to view your app.

---

## PART 3: Mobile Responsiveness

Your dashboard is now fully optimized for mobile devices and high-resolution phones. 

- Single Column Flow: On smaller screens, the header sits at the top and the map stays in the background.
- Toggle Panels: Use the circular button icons at the bottom-right of your screen to open the "Alerts" and "Telemetry" sidebars.
- Mobile Search: Tap the magnifying glass icon in the header to search for cities on the go.

To test this on your computer:
Right-click your browser, select "Inspect", and click the "Device Toolbar" icon to see how it looks on mobile.

---

## Success Checklist

1. Git is installed and working.
2. Code is pushed to GitHub successfully.
3. Web service is created on Render with your API key.
4. Dashboard is live and functional.
5. Mobile UI is verified on phone browsers.

**Congratulations!** Your Live Weather Dashboard is now live on the internet and ready for everyone to see! 🎉
