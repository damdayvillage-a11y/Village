# Article and Complaint API Documentation

## Overview

This document describes the new API endpoints for managing user-generated articles and complaints/suggestions.

## Article APIs

Articles allow users to create and share content about village life, sustainable tourism, local culture, and more.

### Article Model

```typescript
{
  id: string;           // Unique identifier
  title: string;        // Article title
  content: string;      // Article content (text/markdown)
  excerpt?: string;     // Short summary
  slug: string;         // URL-friendly identifier
  authorId: string;     // User ID of author
  status: ArticleStatus; // DRAFT, REVIEW, PUBLISHED, ARCHIVED
  publishedAt?: Date;   // Publication timestamp
  views: number;        // View count
  featured: boolean;    // Featured flag
  tags?: string[];      // Article tags
  metadata?: object;    // SEO metadata
  createdAt: Date;      // Creation timestamp
  updatedAt: Date;      // Last update timestamp
}
```

### List User Articles

Get all articles created by the authenticated user.

**Endpoint**: `GET /api/user/articles`

**Authentication**: Required

**Response**:
```json
[
  {
    "id": "clxxx1",
    "title": "Village Life in the Himalayas",
    "status": "PUBLISHED",
    "publishedAt": "2025-01-10T10:00:00Z",
    "views": 234,
    "createdAt": "2025-01-08T08:00:00Z",
    "updatedAt": "2025-01-10T10:00:00Z"
  },
  {
    "id": "clxxx2",
    "title": "Sustainable Tourism Practices",
    "status": "DRAFT",
    "publishedAt": null,
    "views": 0,
    "createdAt": "2025-01-09T12:00:00Z",
    "updatedAt": "2025-01-09T14:00:00Z"
  }
]
```

### Create Article

Create a new article.

**Endpoint**: `POST /api/user/articles`

**Authentication**: Required

**Request Body**:
```json
{
  "title": "My New Article",
  "content": "Article content goes here...",
  "excerpt": "A brief summary",
  "status": "DRAFT",  // Optional, defaults to DRAFT
  "tags": ["tourism", "sustainability"]  // Optional
}
```

**Response** (201 Created):
```json
{
  "id": "clxxx3",
  "title": "My New Article",
  "content": "Article content goes here...",
  "excerpt": "A brief summary",
  "slug": "my-new-article-1705656000000",
  "status": "DRAFT",
  "authorId": "user123",
  "publishedAt": null,
  "views": 0,
  "featured": false,
  "tags": ["tourism", "sustainability"],
  "createdAt": "2025-01-19T10:00:00Z",
  "updatedAt": "2025-01-19T10:00:00Z"
}
```

**Validation**:
- `title` (required): Article title
- `content` (required): Article content
- `status`: Must be one of: DRAFT, REVIEW, PUBLISHED, ARCHIVED
- Auto-generates slug from title + timestamp

### Get Single Article

Get details of a specific article.

**Endpoint**: `GET /api/user/articles/[id]`

**Authentication**: Required (must be article author)

**Response**:
```json
{
  "id": "clxxx1",
  "title": "Village Life in the Himalayas",
  "content": "Full article content...",
  "excerpt": "A glimpse into daily life in a Himalayan village",
  "slug": "village-life-himalayas-1705000000000",
  "status": "PUBLISHED",
  "authorId": "user123",
  "publishedAt": "2025-01-10T10:00:00Z",
  "views": 234,
  "featured": false,
  "tags": ["culture", "himalaya"],
  "createdAt": "2025-01-08T08:00:00Z",
  "updatedAt": "2025-01-10T10:00:00Z"
}
```

**Error Responses**:
- `404`: Article not found or not owned by user
- `401`: Unauthorized

### Update Article

Update an existing article.

**Endpoint**: `PATCH /api/user/articles/[id]`

**Authentication**: Required (must be article author)

**Request Body** (all fields optional):
```json
{
  "title": "Updated Title",
  "content": "Updated content",
  "excerpt": "Updated summary",
  "status": "PUBLISHED",
  "tags": ["new-tag", "another-tag"]
}
```

**Response**:
```json
{
  "id": "clxxx1",
  "title": "Updated Title",
  "content": "Updated content",
  "excerpt": "Updated summary",
  "slug": "village-life-himalayas-1705000000000",
  "status": "PUBLISHED",
  "authorId": "user123",
  "publishedAt": "2025-01-19T11:00:00Z",  // Set when status changes to PUBLISHED
  "views": 234,
  "featured": false,
  "tags": ["new-tag", "another-tag"],
  "createdAt": "2025-01-08T08:00:00Z",
  "updatedAt": "2025-01-19T11:00:00Z"
}
```

**Notes**:
- Only the author can update their article
- `publishedAt` is automatically set when status changes to PUBLISHED for the first time
- All fields are optional - only send fields you want to update

**Error Responses**:
- `404`: Article not found or not owned by user
- `401`: Unauthorized

### Delete Article

Delete an article.

**Endpoint**: `DELETE /api/user/articles/[id]`

**Authentication**: Required (must be article author)

**Response**:
```json
{
  "success": true,
  "message": "Article deleted successfully"
}
```

**Error Responses**:
- `404`: Article not found or not owned by user
- `401`: Unauthorized

## Complaint/Suggestion APIs

The complaint system allows users to submit feedback, report issues, or make suggestions for improvement.

### Complaint Model

```typescript
{
  id: string;              // Unique identifier
  type: ComplaintType;     // COMPLAINT, SUGGESTION, FEEDBACK
  title: string;           // Brief title
  description: string;     // Detailed description
  authorId: string;        // User ID of author
  status: ComplaintStatus; // OPEN, IN_PROGRESS, REVIEWED, RESOLVED, CLOSED
  priority: Priority;      // LOW, MEDIUM, HIGH, URGENT
  category?: string;       // Optional category
  adminResponse?: string;  // Admin's response
  resolvedBy?: string;     // Admin user ID who resolved
  resolvedAt?: Date;       // Resolution timestamp
  metadata?: object;       // Additional data
  createdAt: Date;         // Creation timestamp
  updatedAt: Date;         // Last update timestamp
}
```

### List User Complaints

Get all complaints/suggestions submitted by the authenticated user.

**Endpoint**: `GET /api/user/complaints`

**Authentication**: Required

**Response**:
```json
[
  {
    "id": "clxxx1",
    "type": "COMPLAINT",
    "title": "Homestay Booking Issue",
    "description": "Unable to modify booking dates after confirmation.",
    "status": "IN_PROGRESS",
    "priority": "MEDIUM",
    "category": "Booking",
    "adminResponse": "We are looking into this issue and will provide an update soon.",
    "createdAt": "2025-01-17T10:00:00Z",
    "updatedAt": "2025-01-18T12:00:00Z",
    "resolvedAt": null
  },
  {
    "id": "clxxx2",
    "type": "SUGGESTION",
    "title": "Mobile App for Village Tour",
    "description": "It would be great to have a mobile app for the village tour with offline maps.",
    "status": "REVIEWED",
    "priority": "LOW",
    "category": "Features",
    "adminResponse": "Thank you for the suggestion! This is on our roadmap for 2025.",
    "createdAt": "2025-01-15T08:00:00Z",
    "updatedAt": "2025-01-16T14:00:00Z",
    "resolvedAt": null
  }
]
```

### Create Complaint/Suggestion

Submit a new complaint, suggestion, or feedback.

**Endpoint**: `POST /api/user/complaints`

**Authentication**: Required

**Request Body**:
```json
{
  "type": "COMPLAINT",  // or "SUGGESTION" or "FEEDBACK"
  "title": "Issue with booking system",
  "description": "Detailed description of the issue...",
  "priority": "MEDIUM",  // Optional: LOW, MEDIUM, HIGH, URGENT (defaults to MEDIUM)
  "category": "Booking"  // Optional
}
```

**Response** (201 Created):
```json
{
  "id": "clxxx3",
  "type": "COMPLAINT",
  "title": "Issue with booking system",
  "description": "Detailed description of the issue...",
  "authorId": "user123",
  "status": "OPEN",
  "priority": "MEDIUM",
  "category": "Booking",
  "adminResponse": null,
  "resolvedBy": null,
  "resolvedAt": null,
  "createdAt": "2025-01-19T10:00:00Z",
  "updatedAt": "2025-01-19T10:00:00Z"
}
```

**Validation**:
- `type` (required): Must be "COMPLAINT", "SUGGESTION", or "FEEDBACK"
- `title` (required): Brief summary
- `description` (required): Detailed description
- `priority` (optional): Defaults to MEDIUM if not specified

**Error Responses**:
- `400`: Missing required fields or invalid type
- `401`: Unauthorized

## Status Enums

### ArticleStatus

- `DRAFT`: Article is being written
- `REVIEW`: Article submitted for review
- `PUBLISHED`: Article is live and visible
- `ARCHIVED`: Article is hidden but preserved

### ComplaintType

- `COMPLAINT`: Issue or problem to be resolved
- `SUGGESTION`: Idea for improvement
- `FEEDBACK`: General feedback about service

### ComplaintStatus

- `OPEN`: Newly submitted, awaiting review
- `IN_PROGRESS`: Being actively worked on
- `REVIEWED`: Has been reviewed by admin
- `RESOLVED`: Issue has been resolved
- `CLOSED`: No further action needed

### Priority

- `LOW`: Can be addressed later
- `MEDIUM`: Normal priority (default)
- `HIGH`: Should be addressed soon
- `URGENT`: Requires immediate attention

## Usage Examples

### Creating and Publishing an Article

```typescript
// 1. Create draft
const response = await fetch('/api/user/articles', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Sustainable Living Tips',
    content: 'Here are some tips...',
    status: 'DRAFT'
  })
});
const article = await response.json();

// 2. Edit and publish
await fetch(`/api/user/articles/${article.id}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    content: 'Updated content with more tips...',
    status: 'PUBLISHED'
  })
});
```

### Submitting a Complaint

```typescript
const response = await fetch('/api/user/complaints', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'COMPLAINT',
    title: 'Payment not processed',
    description: 'I made a payment but it shows as pending',
    priority: 'HIGH',
    category: 'Payment'
  })
});
const complaint = await response.json();
```

### Fetching User's Content

```typescript
// Get all articles
const articles = await fetch('/api/user/articles').then(r => r.json());

// Get all complaints
const complaints = await fetch('/api/user/complaints').then(r => r.json());
```

## Security

- All endpoints require authentication
- Users can only access their own articles and complaints
- Article authors have full CRUD permissions on their articles
- Complaint authors can view their complaints but cannot edit/delete them (admin only)
- All inputs are validated and sanitized

## Rate Limiting

Consider implementing rate limiting for:
- Article creation: 10 articles per hour
- Complaint submission: 5 complaints per hour

## Future Enhancements

Potential improvements for these APIs:

1. **Articles**:
   - Public article listing endpoint
   - Search and filtering
   - Comments and reactions
   - Image upload for articles
   - Article categories/collections

2. **Complaints**:
   - Email notifications for status updates
   - Admin dashboard for managing complaints
   - Complaint updates by users (add comments)
   - File attachments for evidence
   - Priority auto-escalation

## Support

For API issues or questions:
- Check API logs in server console
- Verify authentication tokens are valid
- Ensure database migrations are run
- Contact support at support@damdayvillage.com
