# Firebase Setup Guide

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or select an existing project
3. Follow the setup wizard

## Step 2: Enable Google Authentication

1. In your Firebase project, go to **Authentication** in the left sidebar
2. Click **Get started**
3. Go to the **Sign-in method** tab
4. Click on **Google** provider
5. Enable it and configure:
   - **Project support email**: Your email
   - **Authorized domains**: Add your domain (for localhost, this is automatic)
6. Click **Save**

## Step 3: Get Firebase Configuration

1. In Firebase Console, click the gear icon ⚙️ next to "Project Overview"
2. Select **Project settings**
3. Scroll down to **Your apps** section
4. Click the web icon (</>) to add a web app
5. Register your app with a nickname (e.g., "ApplyPilot Web")
6. Copy the configuration object

## Step 4: Create Environment File

Create a file named `.env.local` in your project root with the following content:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Replace the values with the actual values from your Firebase configuration.

## Step 5: Restart Development Server

After creating the `.env.local` file, restart your development server:

```bash
npm run dev
# or
pnpm dev
```

## Example Configuration

Here's what your `.env.local` file should look like (with example values):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC2xYz1234567890abcdefghijklmnop
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=applypilot-12345.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=applypilot-12345
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=applypilot-12345.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

## Troubleshooting

If you still get the "auth/configuration-not-found" error:

1. Make sure the `.env.local` file is in the root directory of your project
2. Verify all environment variables are set correctly
3. Restart your development server
4. Check the browser console for any configuration errors
5. Ensure your Firebase project has Google Authentication enabled

## Security Note

- Never commit your `.env.local` file to version control
- The `.env.local` file is already in your `.gitignore`
- Only use `NEXT_PUBLIC_` prefix for client-side environment variables 