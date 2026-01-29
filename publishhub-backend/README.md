# PublishHub Backend API

A comprehensive Laravel-based backend API for managing articles, reviews, comments, and revisions in a collaborative publishing platform.

## Features

- **User Authentication**: Token-based authentication using Laravel Sanctum
- **Article Management**: CRUD operations with versioning and status tracking
- **Review System**: Assign reviewers to articles and track review decisions
- **Comment System**: Position-based commenting with highlight support
- **Change Tracking**: Track and approve/reject content changes
- **Revision Requests**: Request and manage article revisions
- **Role-Based Access Control**: Admin, Author, and Reviewer roles
- **API Resource Formatting**: Standardized JSON responses with consistent structure

## Tech Stack

- **Framework**: Laravel 12
- **Authentication**: Laravel Sanctum
- **Database**: MySQL
- **API Design**: RESTful API

## Installation

### Prerequisites
- PHP 8.2 or higher
- Composer
- MySQL 5.7 or higher
- Node.js (for development tools)

### Setup Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd publishhub-backend
```

2. **Install dependencies**
```bash
composer install
```

3. **Environment configuration**
```bash
cp .env.example .env
php artisan key:generate
```

4. **Database setup**
```bash
php artisan migrate
php artisan db:seed 
```

5. **Start the development server**
```bash
php artisan serve
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user (requires auth)
- `GET /api/auth/me` - Get current user info (requires auth)

### Article Routes
- `GET /api/articles` - List articles (filtered by role)
- `POST /api/articles` - Create new article (Author/Admin)
- `GET /api/articles/{id}` - Get article details
- `PATCH /api/articles/{id}` - Update article (Author/Admin)
- `DELETE /api/articles/{id}` - Delete article (Author/Admin)
- `POST /api/articles/{id}/submit` - Submit for review (Author)
- `GET /api/articles/pending-approval` - Pending articles (Admin)
- `POST /api/articles/{id}/approve` - Approve article (Admin)
- `POST /api/articles/{id}/reject` - Reject article (Admin)
- `POST /api/articles/{id}/assign-reviewer` - Assign reviewer (Admin)

### Article Versions
- `GET /api/articles/{id}/versions` - List article versions
- `GET /api/articles/{id}/versions/{version}` - Get specific version

### Comments Routes
- `GET /api/articles/{id}/comments` - List comments
- `POST /api/articles/{id}/comments` - Create comment (Reviewer/Admin)
- `GET /api/articles/{id}/comments/{commentId}` - Get comment
- `PATCH /api/articles/{id}/comments/{commentId}` - Update comment
- `DELETE /api/articles/{id}/comments/{commentId}` - Delete comment

### Review Routes
- `GET /api/reviews/my-assignments` - Get reviewer assignments (Reviewer)
- `POST /api/articles/{id}/submit-review` - Submit review decision (Reviewer)

### Revision Routes
- `GET /api/revisions` - List all revisions (Admin)
- `POST /api/revisions` - Create revision request (Admin)
- `GET /api/revisions/{id}` - Get revision details
- `POST /api/revisions/{id}/approve` - Approve revision (Author)
- `POST /api/revisions/{id}/reject` - Reject revision (Admin)
- `GET /api/revisions/my-requests` - Get my revisions (Author)
- `POST /api/revisions/{id}/complete` - Complete revision (Author)

### Change Tracking Routes
- `GET /api/articles/{id}/changes` - Get article changes
- `POST /api/articles/{id}/changes` - Track changes
- `POST /api/articles/{id}/changes/{changeId}/approve` - Approve change (Admin)
- `POST /api/articles/{id}/changes/{changeId}/reject` - Reject change (Admin)
- `POST /api/articles/{id}/changes/approve-all` - Approve all changes (Admin)
- `POST /api/articles/{id}/changes/reject-all` - Reject all changes (Admin)
- `POST /api/articles/{id}/compare-versions` - Compare versions

### User Routes
- `GET /api/users` - List all users (Admin)
- `GET /api/users/{id}` - Get user details
- `GET /api/users/by-role` - Get users by role (Admin)

## Response Format

All API responses follow a standardized format:

### Success Response (200)
```json
{
  "status": "success",
  "status_code": 200,
  "message": "Operation completed successfully",
  "data": {}
}
```

### Created Response (201)
```json
{
  "status": "success",
  "status_code": 201,
  "message": "Resource created successfully",
  "data": {}
}
```

### Error Response
```json
{
  "status": "error",
  "status_code": 400,
  "message": "Error message",
  "errors": {}
}
```

### Validation Error Response (422)
```json
{
  "status": "error",
  "status_code": 422,
  "message": "Validation failed",
  "errors": {
    "field": ["Error message"]
  }
}
```

## Authentication

The API uses token-based authentication with Laravel Sanctum:

1. Register or login to get an auth token
2. Include the token in the Authorization header:
   ```
   Authorization: Bearer {token}
   ```

## User Roles

- **Admin**: Full access to all endpoints and operations
- **Author**: Can create, edit, submit articles; respond to revisions
- **Reviewer**: Can comment, submit reviews, and provide feedback

## Project Structure

```
app/
├── Http/
│   ├── Controllers/Api/        # API Controllers
│   ├── Requests/               # Form request validations
│   ├── Resources/              # API resource formatting
│   ├── Middleware/             # Custom middleware
│   ├── Traits/                 # Reusable traits (ApiResponse)
│   └── Policies/               # Authorization policies
├── Models/                      # Eloquent models
└── Providers/                   # Service providers

config/                          # Configuration files
database/
├── migrations/                  # Database migrations
├── factories/                   # Model factories
└── seeders/                     # Database seeders

routes/
├── api.php                      # API routes
├── web.php                      # Web routes
└── console.php                  # Console commands

tests/
├── Feature/                     # Feature tests
└── Unit/                        # Unit tests
```

## Running Tests

```bash
# Run all tests
php artisan test

# Run specific test file
php artisan test tests/Feature/ArticleTest.php

# Run with coverage
php artisan test --coverage
```

## Development Guidelines

### Code Standards

- Follow PSR-12 PHP coding standards
- Use type hints for all method parameters and returns
- Write descriptive method and variable names
- Use meaningful comments for complex logic

### Authorization

- Use Policies for model-level authorization
- Use CheckRole middleware for route-level access control
- All authorization checks use `$this->authorize()` method

## Troubleshooting

### Database Connection Error
- Verify `.env` database credentials
- Ensure MySQL server is running
- Check database name exists

### Authentication Failed
- Verify token is included in Authorization header
- Ensure token hasn't expired
- Check user account exists and is not deleted

### 403 Forbidden
- Verify user has correct role for the operation
- Check authorization policy allows the action
- Review role-based middleware configurations

## Contributing

1. Create a feature branch: `git checkout -b feature/feature-name`
2. Make your changes and commit with clear messages
3. Ensure all tests pass
4. Submit a pull request

## License

This project is proprietary software. All rights reserved.

## Support

For issues or questions, please contact the development team.

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
