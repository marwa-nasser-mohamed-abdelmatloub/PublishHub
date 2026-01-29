# PublishHub Frontend

A modern React-based frontend application for managing articles, reviews, and collaborative publishing workflows.

## Features

- **User Authentication**: Register and login with role-based access
- **Article Management**: Create, edit, view, and submit articles
- **Review System**: Assign and manage article reviews
- **Comment System**: Add position-based comments with highlights
- **Revision Management**: Request and track article revisions
- **Dashboard**: Role-specific dashboards for Admin, Author, and Reviewer
- **Real-time Updates**: Instant feedback on operations
- **Responsive Design**: Works on desktop, tablet, and mobile

## Tech Stack

- **React 18**: Modern UI library
- **Vite**: Lightning-fast build tool
- **Axios**: HTTP client for API communication
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Context API**: State management

## Installation

### Prerequisites
- Node.js 16.0 or higher
- npm or yarn

### Setup Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd publishhub-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment configuration**
```bash
cp .env.example .env
```

Edit `.env` file and set:
```
VITE_API_URL=http://localhost:8000/api
```

4. **Start development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Common.jsx       # Navbar, LoadingSpinner
│   └── ProtectedRoute.jsx  # Route protection
├── context/             # Context providers
│   └── AuthContext.jsx  # Authentication state
├── hooks/               # Custom React hooks
│   ├── useAuth.js       # Auth context hook
│   └── useApi.js        # API call hook
├── pages/               # Page components
│   ├── Login.jsx
│   ├── Register.jsx
│   └── Dashboard.jsx
├── services/            # API service functions
│   ├── api.js          # Axios instance
│   └── index.js        # Service exports
├── utils/              # Utility functions
│   └── helpers.js      # Helper functions
├── assets/             # Static assets
├── App.jsx             # Root component
├── App.css             # Global styles
└── main.jsx            # Entry point
```

## Available Pages

### Authentication
- **Login** (`/login`) - User login page
- **Register** (`/register`) - User registration page

### Dashboard
- **Dashboard** (`/`) - Role-based dashboard with quick links

### Articles (To be implemented)
- **Articles List** - View all articles
- **Create Article** - Create new article
- **Edit Article** - Edit existing article
- **View Article** - View full article details

### Reviews (To be implemented)
- **Assignments** - View reviewer assignments
- **Submit Review** - Submit review feedback

### Revisions (To be implemented)
- **Revisions** - View all revision requests
- **My Revisions** - View personal revision requests

## Usage

### Authentication

Login with your credentials:
```
Email: user@example.com
Password: password123
```

### Making API Calls

Use the service functions provided:
```javascript
import { articleService } from '../services';

const articles = await articleService.getAll();

const newArticle = await articleService.create({
  title: 'Article Title',
  content: 'Article content...'
});
```

### Using Authentication Context

```javascript
import { useAuth } from '../hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  
  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user.name}</p>
      ) : (
        <p>Please login</p>
      )}
    </div>
  );
}
```

### Using API Hook

```javascript
import { useApi } from '../hooks/useApi';
import { articleService } from '../services';

function MyComponent() {
  const { data, loading, error, execute } = useApi(articleService.getAll);
  
  const loadArticles = async () => {
    await execute(1); // Load first page
  };
  
  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {data && <div>{/* Render data */}</div>}
      <button onClick={loadArticles}>Load Articles</button>
    </div>
  );
}
```

## Styling

This project uses Tailwind CSS for styling. All components use Tailwind utility classes for responsive design.

### Color Scheme

- **Primary**: Blue (#3B82F6)
- **Success**: Green (#10B981)
- **Warning**: Orange (#F59E0B)
- **Danger**: Red (#EF4444)
- **Gray**: Various shades for neutral elements

## Development Guidelines

### Component Structure

```javascript
import { useAuth } from '../hooks/useAuth';

const MyComponent = () => {
  const { user } = useAuth();
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Component content */}
    </div>
  );
};

export default MyComponent;
```

### State Management

- Use `useState` for local component state
- Use `AuthContext` for authentication state
- Use `useApi` hook for loading API data

### Naming Conventions

- Components: PascalCase (e.g., `MyComponent.jsx`)
- Files/Folders: camelCase (e.g., `useAuth.js`)
- CSS Classes: Tailwind utility classes

## Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

## API Integration

The frontend integrates with the PublishHub Backend API. Make sure the backend is running at the configured `VITE_API_URL`.

### Auth Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Protected Requests

All API requests automatically include the auth token from localStorage:
```
Authorization: Bearer {token}
```

## Troubleshooting

### API Connection Error
- Verify `VITE_API_URL` in `.env` is correct
- Ensure backend server is running
- Check browser console for CORS errors

### Login Issues
- Clear browser cache and localStorage
- Verify email and password are correct
- Check backend auth service is running

### Build Issues
- Delete `node_modules` folder
- Run `npm install` again
- Try `npm run dev` instead of `npm run build`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Create a feature branch: `git checkout -b feature/feature-name`
2. Make your changes
3. Commit your changes: `git commit -m "Add feature"`
4. Push to the branch: `git push origin feature/feature-name`
5. Submit a pull request

## License

This project is proprietary software. All rights reserved.

## Support

For issues or questions, please contact the development team.

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
