# Firebase Setup Guide for Wishes Wall

## Why Firebase?
Firebase allows all wishes to be **stored in the cloud** and **visible to everyone** who visits your wedding website in real-time. When someone sends a wish, it immediately appears for all guests!

## Step-by-Step Setup (FREE - Takes 5 minutes)

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `sajjad-ayesha-wedding` (or any name you like)
4. **Disable Google Analytics** (not needed for this)
5. Click **"Create project"**

### 2. Create Realtime Database

1. In your Firebase project, click **"Realtime Database"** in the left menu
2. Click **"Create Database"**
3. Select location: **Singapore** (or closest to India)
4. Select **"Start in test mode"** (we'll secure it later)
5. Click **"Enable"**

### 3. Get Firebase Configuration

1. Click the **gear icon** (⚙️) next to "Project Overview" → **"Project settings"**
2. Scroll down to **"Your apps"** section
3. Click the **web icon** `</>` (Web app)
4. Enter app nickname: `Wedding Website`
5. **DO NOT** check "Firebase Hosting"
6. Click **"Register app"**
7. You'll see a code block like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyA...",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

### 4. Update Your Code

1. Open file: `js/firebase-config.js`
2. **Replace** the placeholder values with your actual Firebase config:

```javascript
var firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",           // Replace this
  authDomain: "YOUR_ACTUAL_AUTH_DOMAIN",   // Replace this
  databaseURL: "YOUR_ACTUAL_DATABASE_URL", // Replace this (IMPORTANT!)
  projectId: "YOUR_ACTUAL_PROJECT_ID",     // Replace this
  storageBucket: "YOUR_ACTUAL_STORAGE",    // Replace this
  messagingSenderId: "YOUR_ACTUAL_ID",     // Replace this
  appId: "YOUR_ACTUAL_APP_ID"              // Replace this
};
```

3. Save the file

### 5. Set Database Security Rules (IMPORTANT!)

To prevent spam and abuse:

1. Go to **Realtime Database** → **Rules** tab
2. Replace the rules with this:

```json
{
  "rules": {
    "wishes": {
      ".read": true,
      ".write": true,
      "$wishId": {
        ".validate": "newData.hasChildren(['name', 'message', 'timestamp']) && 
                      newData.child('name').isString() && 
                      newData.child('name').val().length > 0 && 
                      newData.child('name').val().length <= 50 &&
                      newData.child('message').isString() && 
                      newData.child('message').val().length > 0 && 
                      newData.child('message').val().length <= 500 &&
                      newData.child('timestamp').isNumber()"
      }
    }
  }
}
```

3. Click **"Publish"**

These rules ensure:
- Everyone can read wishes
- Everyone can write wishes
- Names must be 1-50 characters
- Messages must be 1-500 characters
- No spam or malicious data

### 6. Test It!

1. Open your website in a browser
2. Fill in the wishes form
3. Click "SEND WISH"
4. Your wish should appear immediately!
5. Open the website on another device/browser - you'll see the same wish!

### 7. Deploy Your Website

Upload your website to:
- **Vercel** (recommended - easiest)
- **Netlify**
- **GitHub Pages**
- Any web hosting

## How It Works

- ✅ **Real-time**: Wishes appear instantly for everyone
- ✅ **Free**: Firebase free tier allows 100,000 reads/day (more than enough!)
- ✅ **Secure**: Protected by validation rules
- ✅ **Automatic**: No manual moderation needed
- ✅ **Persistent**: All wishes are saved forever

## Troubleshooting

**Problem: Wishes not saving**
- Check browser console for errors (F12)
- Verify Firebase config is correct
- Check database URL is included

**Problem: "Firebase not configured"**
- Make sure `firebase-config.js` has real values
- Check Firebase SDK is loaded (in HTML `<head>`)

**Problem: Can't see wishes from other devices**
- Clear browser cache
- Make sure database rules allow `.read: true`

## Admin Access

To view/manage all wishes:
1. Go to Firebase Console
2. Click "Realtime Database"
3. You'll see all wishes under `wishes` node
4. You can manually delete inappropriate wishes if needed

## Cost

**FREE** for your wedding! 

Firebase free tier includes:
- 10GB storage
- 1GB downloads per day
- 100,000 simultaneous connections

Perfect for a wedding website! 🎉

---

Need help? Check Firebase documentation: https://firebase.google.com/docs/database
