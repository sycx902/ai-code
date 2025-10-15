# User Attendance App

A multi-user attendance tracking application built with React and Firebase. Users can access their personal dashboard via unique URLs, manage gold amounts with notes, and track their attendance history.

## Features

- **Multi-user Support**: Each user gets a unique URL slug (e.g., `yourapp.com/john-doe`)
- **Authentication**: Secure login with Firebase Authentication
- **Gold Management**: Add, edit, and delete gold entries with notes
- **Attendance Tracking**: Automatic login/logout timestamp recording
- **Real-time Updates**: Live data synchronization using Firestore
- **Admin Panel**: User creation and management interface
- **Security**: Comprehensive Firestore security rules

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Routing**: React Router v6
- **Authentication**: Firebase Auth
- **Database**: Firestore (Real-time Database)
- **Build Tool**: Vite
- **Styling**: Inline CSS (easily customizable)

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── AdminPanel.tsx
│   ├── AttendanceHistory.tsx
│   ├── GoldEntryForm.tsx
│   ├── GoldEntryList.tsx
│   ├── LoginPage.tsx
│   ├── ProtectedRoute.tsx
│   └── UserRoute.tsx
├── contexts/           # React Context providers
│   └── AuthContext.tsx
├── hooks/              # Custom React hooks
│   └── useUserSlug.ts
├── pages/              # Page components
│   └── DashboardPage.tsx
├── utils/              # Utility functions
│   ├── adminManagement.ts
│   ├── attendance.ts
│   ├── goldManagement.ts
│   └── userManagement.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── firebase.ts         # Firebase configuration
├── App.tsx             # Main app component
└── main.tsx           # App entry point
```

## Setup Instructions

### 1. Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase project

### 2. Install Dependencies

```bash
npm install
```

### 3. Firebase Configuration

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password method)
3. Create a Firestore database
4. Get your Firebase configuration from Project Settings

### 4. Environment Variables

Copy `.env.example` to `.env` and update with your Firebase credentials:

```bash
cp .env.example .env
```

Update the values in `.env`:

```env
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 5. Deploy Firestore Security Rules

Apply the security rules from `firestore.rules`:

```bash
firebase firestore:rules deploy --project your_project_id
```

### 6. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Deployment

### Firebase Hosting

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase Hosting:
```bash
firebase init hosting
```

4. Build the app:
```bash
npm run build
```

5. Deploy:
```bash
firebase deploy --only hosting
```

## Admin Setup

To create the first admin user, you can use the browser console or create a script:

```javascript
import { createAdminUser } from './src/utils/adminManagement'

// Create admin user
createAdminUser('admin@example.com', 'securePassword', 'Admin User')
```

## Usage

### User Access

1. Users access their dashboard via: `yourdomain.com/username-slug`
2. If not authenticated, they're redirected to login
3. After login, they can:
   - Add gold amounts with notes
   - Edit or delete entries
   - View attendance history
   - See total gold amount

### Admin Access

1. Access admin panel (route to be added)
2. Create new users with unique slugs
3. Activate/deactivate user accounts
4. View all users

## Data Models

### User Document
```typescript
{
  userId: string,
  userNameSlug: string,
  email: string,
  createdAt: Date,
  updatedAt: Date,
  isActive: boolean,
  isAdmin?: boolean
}
```

### Gold Entry
```typescript
{
  amount: number,
  notes: string,
  timestamp: Date,
  userId: string
}
```

### Attendance Log
```typescript
{
  loginTimestamp: Date | null,
  logoutTimestamp: Date | null,
  userId: string
}
```

## Security Features

- Users can only access their own data
- Firestore security rules enforce data isolation
- Input validation on all forms
- Protected routes for authenticated access
- Secure environment variable handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
