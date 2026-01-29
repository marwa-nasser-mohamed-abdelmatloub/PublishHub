# 🏗️ Article Publishing System - Architecture & Workflow

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ARTICLE PUBLISHING SYSTEM                           │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────┐
│   FRONTEND (React 19)     │
│  ├─ Vite 7.2.4          │
│  ├─ React Bootstrap      │
│  ├─ Axios               │
│  └─ React Router        │
│                         │
│  Pages:                 │
│  ├─ Login/Register      │
│  ├─ Article List        │
│  ├─ Create Article      │
│  ├─ Article Detail      │
│  └─ Dashboard           │
│                         │
│  Components:            │
│  ├─ CommentHighlight    │
│  ├─ Navbar              │
│  ├─ ProtectedRoute      │
│  └─ LoadingSpinner      │
└────────────┬────────────┘
             │
             │ HTTPS/CORS
             │
┌────────────▼────────────┐
│  BACKEND (Laravel 12)    │
│  REST API                │
│                         │
│  Controllers:           │
│  ├─ AuthController      │
│  ├─ ArticleController   │
│  ├─ ReviewController    │
│  ├─ CommentController   │
│  ├─ ChangeTracker       │
│  ├─ RevisionRequest     │
│  ├─ ArticleVersion      │
│  └─ UserController      │
│                         │
│  Request Validation:    │
│  ├─ RegisterRequest     │
│  ├─ LoginRequest        │
│  ├─ StoreArticle        │
│  ├─ StoreComment        │
│  ├─ ReviewDecision      │
│  └─ TrackChange         │
│                         │
│  Middleware:            │
│  ├─ auth:sanctum        │
│  ├─ role:admin          │
│  ├─ role:author         │
│  └─ role:reviewer       │
│                         │
│  Traits:                │
│  └─ ApiResponse         │
└────────────┬────────────┘
             │
             │ MySQL Driver
             │
┌────────────▼────────────┐
│  DATABASE (MySQL 8.0+)   │
│                         │
│  Tables:                │
│  ├─ users               │
│  ├─ articles            │
│  ├─ comments            │
│  ├─ review_assignments  │
│  ├─ review_decisions    │
│  ├─ revision_requests   │
│  ├─ article_versions    │
│  ├─ change_trackers     │
│  └─ other system tables │
└─────────────────────────┘
```

---

## User Roles & Access Control

```
┌──────────────────────────────────────────────────────────────────────────┐
│                          USER ROLES                                      │
└──────────────────────────────────────────────────────────────────────────┘

┌─────────────┐
│    ADMIN    │
├─────────────┤
│ • Manage    │
│   articles  │
│ • Approve/  │
│   Reject    │
│ • Assign    │
│   reviewers │
│ • Track     │
│   changes   │
│ • Manage    │
│   users     │
└─────────────┘

┌─────────────┐
│   AUTHOR    │
├─────────────┤
│ • Create    │
│   articles  │
│ • Edit      │
│   articles  │
│ • Submit    │
│   for       │
│   review    │
│ • Request   │
│   revisions │
└─────────────┘

┌─────────────┐
│  REVIEWER   │
├─────────────┤
│ • View      │
│   assigned  │
│   articles  │
│ • Comment   │
│   on text   │
│ • Submit    │
│   decision  │
│ • View all  │
│   comments  │
└─────────────┘
```

---

## Article Lifecycle State Machine

```
┌────────┐
│ DRAFT  │ ← Created by Author
└────┬───┘
     │ (Author clicks Submit)
     ↓
┌──────────┐
│ SUBMITTED│ ← Waiting for Admin review
└────┬─────┘
     │ (Admin assigns reviewers)
     ↓
┌────────────┐
│UNDER_REVIEW│ ← Reviewers providing feedback
└────┬───────┘
     │
     ├─→ ✅ Approved → PUBLISHED
     │   (All reviewers approve)
     │
     ├─→ ❌ Rejected
     │   (Any reviewer rejects)
     │
     └─→ 🔄 Revision Requested
         (Author needs to make changes)
         │
         ├─ Author edits article
         ├─ Submits changes for review
         │
         ├─→ Changes Approved
         │   └─→ Re-assigned to Reviewers
         │       └─→ Goes back to UNDER_REVIEW
         │
         └─→ Changes Rejected
             └─→ Author edits again
```

---

## API Request/Response Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                    REQUEST/RESPONSE FLOW                         │
└──────────────────────────────────────────────────────────────────┘

Client Request:
└─ POST /api/articles
   ├─ Headers: Authorization: Bearer {token}
   ├─ Body: { title, content }
   └─ User context: $request->user()

Server Processing:
├─ Middleware: auth:sanctum
│  └─ Validate token
├─ Form Request: StoreArticleRequest
│  └─ Validate data
├─ Authorization Policy
│  └─ Check role (Author or Admin)
├─ Controller: ArticleController@store
│  ├─ Create article record
│  ├─ Create version
│  └─ Return response
└─ Trait: ApiResponse
   └─ Format response

Response (Success):
{
  "status": "success",
  "status_code": 201,
  "message": "Article created successfully",
  "data": {
    "id": 1,
    "title": "Article Title",
    "content": "Content...",
    "author_id": 1,
    "status": "draft",
    "created_at": "2026-01-27T10:00:00Z"
  }
}

Response (Error):
{
  "status": "error",
  "status_code": 422,
  "message": "Validation failed",
  "data": {
    "title": ["Title is required"],
    "content": ["Content must be at least 50 characters"]
  }
}
```

---

## Database Schema Relationships

```
users
├── id (PK)
├── name
├── email (UNIQUE)
├── password
├── role (enum: admin, author, reviewer)
└── timestamps

articles
├── id (PK)
├── author_id (FK → users.id)
├── title
├── content
├── status (enum: draft, submitted, under_review, approved, rejected)
├── version
└── timestamps

comments
├── id (PK)
├── article_id (FK → articles.id)
├── reviewer_id (FK → users.id)
├── comment_text
├── selected_text (highlighted text)
├── start_position
├── end_position
├── highlight_color
└── timestamps

review_assignments
├── id (PK)
├── article_id (FK → articles.id)
├── reviewer_id (FK → users.id)
└── timestamps

review_decisions
├── id (PK)
├── article_id (FK → articles.id)
├── reviewer_id (FK → users.id)
├── decision (enum: approve, reject, revision_requested)
├── feedback
└── timestamps

revision_requests
├── id (PK)
├── article_id (FK → articles.id)
├── requested_by (FK → users.id)
├── reason
├── status (enum: pending, approved, rejected)
└── timestamps

article_versions
├── id (PK)
├── article_id (FK → articles.id)
├── version_number
├── content
├── change_summary
└── timestamps

change_trackers
├── id (PK)
├── article_id (FK → articles.id)
├── old_content
├── new_content
├── added_text
├── removed_text
├── status (enum: pending, approved, rejected)
└── timestamps
```

---

## Complete Article Review Workflow

```
┌───────────────────────────────────────────────────────────────────────┐
│                 COMPLETE REVIEW WORKFLOW                             │
└───────────────────────────────────────────────────────────────────────┘

PHASE 1: AUTHOR CREATES & SUBMITS
┌─────────────────────────────────────────────────────────┐
│ Author                                                  │
│ 1. Clicks "Create Article"                            │
│ 2. Fills title & content                              │
│ 3. Article auto-saved as "draft"                      │
│ 4. Clicks "Submit for Review"                         │
│    → Status changes to "submitted"                    │
│    → Article ready for admin review                  │
└─────────────────────────────────────────────────────────┘

PHASE 2: ADMIN ASSIGNS REVIEWERS
┌─────────────────────────────────────────────────────────┐
│ Admin                                                   │
│ 1. Goes to "Pending Approvals" section                │
│ 2. Selects article submitted by author               │
│ 3. Clicks "Assign Reviewers"                         │
│ 4. Selects 1 or more reviewers                       │
│    → Status changes to "under_review"                │
│    → Reviewers notified (optional email)             │
│    → Review assignments created                       │
└─────────────────────────────────────────────────────────┘

PHASE 3: REVIEWERS EVALUATE & COMMENT
┌─────────────────────────────────────────────────────────┐
│ Reviewer                                                │
│ 1. Goes to "My Assignments"                           │
│ 2. Opens article assigned to them                     │
│ 3. Reads article content                              │
│ 4. Selects specific text → comment popup              │
│ 5. Adds comment with feedback                         │
│    → Text automatically highlighted                   │
│    → Comment stored with position data                │
│ 6. Repeats for all issues                             │
│ 7. Submits review decision:                           │
│    • Approve → Ready to publish                       │
│    • Reject → Author cannot publish                   │
│    • Revise → Author must make changes               │
└─────────────────────────────────────────────────────────┘

PHASE 4A: ARTICLE APPROVED ✅
┌─────────────────────────────────────────────────────────┐
│ If all reviewers approve:                             │
│ 1. Admin publishes article                            │
│    → Status: "approved"                               │
│    → Visible to public                                │
│    → Author notified                                  │
│ ✅ WORKFLOW COMPLETE                                   │
└─────────────────────────────────────────────────────────┘

PHASE 4B: ARTICLE REJECTED ❌
┌─────────────────────────────────────────────────────────┐
│ If any reviewer rejects:                              │
│ 1. Author notified of rejection                       │
│ 2. Author can view reviewer comments                  │
│ 3. Author can edit and resubmit                       │
│    → Repeats from PHASE 2                             │
│ ❌ WORKFLOW PAUSED (requires action)                   │
└─────────────────────────────────────────────────────────┘

PHASE 4C: REVISION REQUESTED 🔄
┌─────────────────────────────────────────────────────────┐
│ If reviewer requests revision:                        │
│ 1. Revision request created by admin                  │
│    → Status: "revision_requested"                     │
│ 2. Author notified with feedback                      │
│ 3. Author edits article                               │
│ 4. Author submits changes                             │
│    → Changes tracked automatically                    │
│                                                        │
│ CHANGE REVIEW PHASE:                                 │
│ 5. Admin reviews changes                              │
│    • Highlight: added/removed text                   │
│    • Reviews: each change                            │
│    • Decides: approve/reject                         │
│                                                        │
│ 6. If all changes approved:                          │
│    → Reassign to reviewers                           │
│    → Back to PHASE 3 (re-review)                     │
│                                                        │
│ 7. If any changes rejected:                          │
│    → Author edits again                              │
│    → Repeats change review                           │
│                                                        │
│ 🔄 WORKFLOW CONTINUES until approval                 │
└─────────────────────────────────────────────────────────┘
```

---

## Frontend Component Hierarchy

```
App.jsx (Main Component)
├── Routes
│   ├── /login → Login.jsx
│   ├── /register → Register.jsx
│   ├── / → ArticleList.jsx
│   ├── /articles → ArticleList.jsx
│   ├── /articles/create → CreateArticle.jsx
│   └── /articles/:id → ArticleDetail.jsx
│
├── Context
│   └── AuthContext
│       ├── user
│       ├── token
│       ├── role
│       ├── login()
│       └── logout()
│
└── Global Styles
    └── App.css (700+ lines)

ArticleList.jsx
├── Article List Display
├── Filter/Search
└── Status Badges

ArticleDetail.jsx
├── Article Header
├── CommentHighlight.jsx
│   ├── Text Selection Handler
│   ├── Highlight Renderer
│   └── Tooltip Display
├── Comments Section
├── Review Actions
│   ├── Approve Button
│   ├── Reject Button
│   └── Request Revision Button
└── Modal
    └── Add Comment Form

CreateArticle.jsx
├── Title Input
├── Content Textarea
├── Validation Messages
└── Submit Button
```

---

## Data Flow Example: Adding a Comment

```
┌─────────────────────────────────────────────────────────────────┐
│                 DATA FLOW: ADDING A COMMENT                    │
└─────────────────────────────────────────────────────────────────┘

User Interaction:
1. Reviewer selects text in article
   └─ onMouseUp event triggered

2. CommentHighlight.jsx detects selection
   ├─ Get selected text
   ├─ Get start position
   ├─ Get end position
   └─ Show comment modal

3. Reviewer types comment & clicks "Submit"
   └─ Form validation runs (client-side)

4. Axios POST request sent
   URL: /api/articles/{id}/comments
   Body: {
     comment_text: "text...",
     selected_text: "highlighted text",
     start_position: 50,
     end_position: 100,
     highlight_color: "#FFE082"
   }
   Headers: {
     Authorization: Bearer {token}
   }

Backend Processing:
├─ Middleware: auth:sanctum
│  └─ Verify token
├─ Form Request: StoreCommentRequest
│  ├─ Validate all fields
│  ├─ Check user is reviewer/admin
│  └─ Check user assigned to article
├─ Controller: CommentController@store
│  ├─ Create comment record
│  ├─ Store position data
│  ├─ Save highlight color
│  └─ Return response
└─ Response: 201 Created

Response:
{
  "status": "success",
  "status_code": 201,
  "message": "Comment added successfully",
  "data": {
    "id": 123,
    "comment_text": "...",
    "selected_text": "...",
    "start_position": 50,
    "end_position": 100,
    "highlight_color": "#FFE082",
    "reviewer": {
      "id": 5,
      "name": "John Reviewer"
    },
    "created_at": "2026-01-27T10:30:00Z"
  }
}

Frontend Update:
1. Comment added to state
2. CommentHighlight.jsx re-renders
3. Text is highlighted with color
4. Hover shows comment tooltip
5. Modal closes
6. Comment appears in comments list
```

---

## Authentication Flow

```
┌───────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                        │
└───────────────────────────────────────────────────────────────┘

LOGIN PROCESS:
┌────────────────────────────────────────────┐
│ 1. User fills login form                   │
│    ├─ Email                                │
│    └─ Password                             │
├────────────────────────────────────────────┤
│ 2. Frontend validates input                │
│    ├─ Email format check                   │
│    └─ Password length check                │
├────────────────────────────────────────────┤
│ 3. POST /api/auth/login                    │
│    Body: { email, password }               │
├────────────────────────────────────────────┤
│ 4. Backend verifies credentials            │
│    ├─ Find user by email                   │
│    ├─ Verify password hash                 │
│    └─ Generate token                       │
├────────────────────────────────────────────┤
│ 5. Response with token                     │
│    {                                       │
│      "status": "success",                  │
│      "data": {                             │
│        "token": "xxxxx",                   │
│        "user": { ... }                     │
│      }                                     │
│    }                                       │
├────────────────────────────────────────────┤
│ 6. Frontend stores token                   │
│    ├─ localStorage.setItem('token', ...)   │
│    └─ Set in axios headers                 │
├────────────────────────────────────────────┤
│ 7. Redirect to dashboard/articles          │
└────────────────────────────────────────────┘

API CALLS WITH TOKEN:
├─ Every request includes:
│  Headers: {
│    Authorization: "Bearer {token}"
│  }
├─ Backend verifies token
├─ Extract user from token
└─ Process request with user context

TOKEN EXPIRY:
├─ Token expires after X hours
├─ Frontend detects 401 response
├─ Clear localStorage
├─ Redirect to login
└─ User re-authenticates

LOGOUT:
├─ POST /api/auth/logout
├─ Backend invalidates token
├─ Frontend clears localStorage
└─ Redirect to login
```

---

## Security Architecture

```
┌──────────────────────────────────────────────────────┐
│              SECURITY LAYERS                         │
└──────────────────────────────────────────────────────┘

Layer 1: Authentication
├─ Laravel Sanctum tokens
├─ Secure token generation
└─ Token expiry management

Layer 2: Authorization
├─ Role-based access control
│  ├─ Admin
│  ├─ Author
│  └─ Reviewer
├─ Policy-based authorization
│  ├─ Can create articles? (Author/Admin)
│  ├─ Can approve? (Admin only)
│  └─ Can comment? (Reviewer/Admin)
└─ Middleware enforcement

Layer 3: Input Validation
├─ Frontend validation
│  ├─ Real-time field validation
│  └─ Error messages
├─ Backend validation
│  ├─ Form Requests
│  ├─ Custom rules
│  └─ Type checking
└─ Database constraints
   ├─ Foreign keys
   ├─ NOT NULL constraints
   └─ Unique constraints

Layer 4: Data Protection
├─ Password hashing (bcrypt)
├─ SQL injection prevention (ORM)
├─ XSS protection (React escaping)
├─ CSRF token validation
└─ Secure headers (HTTPS)

Layer 5: Transport Security
├─ HTTPS encryption
├─ TLS/SSL certificates
├─ Secure cookies
└─ CORS whitelisting

Layer 6: Database Security
├─ Prepared statements
├─ Encrypted sensitive data
├─ Regular backups
└─ Access control
```

---

## Error Handling Flow

```
┌────────────────────────────────────────────────────┐
│           ERROR HANDLING ARCHITECTURE              │
└────────────────────────────────────────────────────┘

Validation Error (422):
├─ Form Request validation fails
├─ ApiResponse trait catches
├─ Returns formatted error response
│  {
│    "status": "error",
│    "status_code": 422,
│    "message": "Validation failed",
│    "data": { field: ["error message"] }
│  }
└─ Frontend shows field-level errors

Authorization Error (403):
├─ User lacks permission
├─ Policy denies action
├─ Returns 403 Forbidden
│  {
│    "status": "error",
│    "status_code": 403,
│    "message": "Unauthorized"
│  }
└─ Frontend shows permission denied message

Authentication Error (401):
├─ Token missing or invalid
├─ Token expired
├─ Returns 401 Unauthorized
│  {
│    "status": "error",
│    "status_code": 401,
│    "message": "Unauthorized"
│  }
├─ Frontend clears token
└─ Frontend redirects to login

Not Found (404):
├─ Resource doesn't exist
├─ Returns 404 Not Found
└─ Frontend shows 404 page

Server Error (500):
├─ Unexpected error
├─ Logged to laravel.log
├─ Returns 500 error
└─ Frontend shows generic error

Frontend Error Handling:
├─ Try-catch in API calls
├─ Show toast/alert to user
├─ Log error details
└─ Fallback UI state
```

---

**This comprehensive architecture ensures:**
✅ Secure authentication & authorization  
✅ Clean separation of concerns  
✅ Scalable & maintainable code  
✅ Professional error handling  
✅ Complete audit trail  
✅ Production-ready system

**Last Updated:** January 27, 2026
