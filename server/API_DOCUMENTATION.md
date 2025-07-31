# Community AI API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Base URL](#base-url)
3. [Authentication](#authentication)
4. [Error Handling](#error-handling)
5. [Data Models](#data-models)
6. [API Endpoints](#api-endpoints)
   - [Authentication](#authentication-endpoints)
   - [PG Community Management](#pg-community-endpoints)
   - [PG Analytics](#pg-analytics-endpoints)
   - [Technician Management](#technician-endpoints)
   - [Voice Chat](#voice-chat-endpoints)

## Overview

The Community AI API is a RESTful service built with Node.js, Express, and PostgreSQL. It provides comprehensive management capabilities for PG (Paying Guest) communities, including user authentication, community management, analytics, technician management, and voice chat functionality.

### Technology Stack
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with HTTP-only cookies
- **Validation**: Zod schema validation
- **Security**: bcrypt for password hashing, CORS enabled

## Base URL

```
Development: http://localhost:3000
Production: [Your Production URL]
```

## Authentication

The API uses JWT-based authentication with HTTP-only cookies for security.

### Authentication Flow
1. User signs up/logs in via `/api/auth/signup` or `/api/auth/login`
2. Server sets `community_auth_token` cookie (HTTP-only, secure in production)
3. All protected endpoints require this cookie to be present
4. Logout clears the cookie

### Protected Routes
Most endpoints require authentication. The user's role (PG_OWNER or RESIDENT) determines access permissions.

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information (development only)"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Data Models

### User
```typescript
{
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  role: 'PG_OWNER' | 'RESIDENT';
  pgCommunityId?: string; // For residents
  createdAt: Date;
  updatedAt: Date;
}
```

### PG Community
```typescript
{
  id: string;
  name: string;
  address: string;
  description?: string;
  pgCode: string; // Unique code for residents
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Technician
```typescript
{
  id: string;
  name: string;
  phoneNumber: string;
  speciality: TechnicianField;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Raised Issue
```typescript
{
  id: string;
  ticketNumber: number;
  title: string;
  description: string;
  issueType: IssueType;
  priorityLevel: PriorityLevel;
  status: IssueStatus;
  location: string;
  imageUrls: string[];
  raisedById: string;
  pgCommunityId: string;
  assignedTechnicianId?: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}
```

### Requested Service
```typescript
{
  id: string;
  ticketNumber: number;
  title: string;
  description: string;
  serviceType: ServiceType;
  priorityLevel: PriorityLevel;
  status: ServiceStatus;
  location: string;
  isApprovedByOwner: boolean;
  ownerComment?: string;
  rejectionReason?: string;
  requestedById: string;
  pgCommunityId: string;
  assignedTechnicianId?: string;
  createdAt: Date;
  updatedAt: Date;
  approvedAt?: Date;
  completedAt?: Date;
}
```

### Event
```typescript
{
  id: string;
  title: string;
  description?: string;
  eventType: EventType;
  location: string;
  startDate: Date;
  endDate: Date;
  maxCapacity?: number;
  imageUrls: string[];
  requiresRegistration: boolean;
  registrationDeadline?: Date;
  createdById: string;
  pgCommunityId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Enums

#### UserRole
- `PG_OWNER` - Can manage PG communities
- `RESIDENT` - Lives in a PG community

#### TechnicianField
- `PLUMBING`
- `ELECTRICAL`
- `CARPENTRY`
- `CLEANING`
- `PAINTING`
- `AC_REPAIR`
- `APPLIANCE_REPAIR`
- `GENERAL_MAINTENANCE`

#### IssueType
- `PLUMBING`
- `ELECTRICAL`
- `HEATING_COOLING`
- `CLEANING`
- `SECURITY`
- `INTERNET_WIFI`
- `APPLIANCE`
- `STRUCTURAL`
- `PEST_CONTROL`
- `OTHER`

#### ServiceType
- `CLEANING`
- `MAINTENANCE`
- `REPAIR`
- `INSTALLATION`
- `UPGRADE`
- `INSPECTION`
- `OTHER`

#### PriorityLevel
- `P1` - Critical (immediate attention)
- `P2` - High (within 24 hours)
- `P3` - Medium (within 3 days)
- `P4` - Low (within a week)

#### IssueStatus
- `PENDING`
- `ASSIGNED`
- `IN_PROGRESS`
- `RESOLVED`

#### ServiceStatus
- `PENDING`
- `AWAITING_APPROVAL`
- `APPROVED`
- `ASSIGNED`
- `IN_PROGRESS`
- `COMPLETED`
- `REJECTED`

#### EventType
- `SOCIAL`
- `MAINTENANCE`
- `MEETING`
- `CELEBRATION`
- `WORKSHOP`
- `ANNOUNCEMENT`
- `OTHER`

## API Endpoints

### Authentication Endpoints

#### POST /api/auth/signup
Create a new user account.

**Request Body:**
```json
{
  "role": "PG_OWNER" | "RESIDENT",
  "name": "string",
  "email": "string",
  "password": "string (min 8 characters)",
  "profilePicture": "string (optional)",
  "pgCode": "string (required for RESIDENT, not allowed for PG_OWNER)"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string",
    "profilePicture": "string",
    "pgCommunityId": "string (for residents)"
  }
}
```

#### POST /api/auth/login
Authenticate user and get access token.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string",
    "profilePicture": "string",
    "pgCommunityId": "string (for residents)"
  }
}
```

#### GET /api/auth/logout
Logout user and clear authentication cookie.

**Response:**
```json
{
  "message": "Logged out successfully",
  "data": null
}
```

#### GET /api/auth/getUserProfile
Get current user's profile information.

**Headers:** Authentication required

**Response:**
```json
{
  "message": "Profile fetched successfully",
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string",
    "profilePicture": "string",
    "pgCommunityId": "string (for residents)"
  }
}
```

### PG Community Endpoints

#### GET /api/pg-community/code/:pgCode
Get PG community by code (public route for resident signup).

**Parameters:**
- `pgCode` (string) - Unique PG community code

**Response:**
```json
{
  "success": true,
  "message": "PG Community found",
  "data": {
    "id": "string",
    "name": "string",
    "address": "string",
    "description": "string",
    "pgCode": "string"
  }
}
```

#### GET /api/pg-community/search
Search PG communities (public route).

**Query Parameters:**
- `q` (string, required) - Search query
- `limit` (number, optional, default: 10, max: 50) - Number of results

**Response:**
```json
{
  "success": true,
  "message": "Search results retrieved successfully",
  "data": [
    {
      "id": "string",
      "name": "string",
      "address": "string",
      "description": "string",
      "pgCode": "string"
    }
  ],
  "count": 5
}
```

#### POST /api/pg-community
Create a new PG community (PG Owner only).

**Headers:** Authentication required

**Request Body:**
```json
{
  "name": "string",
  "address": "string",
  "description": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "PG Community created successfully",
  "data": {
    "id": "string",
    "name": "string",
    "address": "string",
    "description": "string",
    "pgCode": "string",
    "ownerId": "string"
  }
}
```

#### GET /api/pg-community/my-communities
Get all PG communities owned by authenticated user (PG Owner only).

**Headers:** Authentication required

**Response:**
```json
{
  "success": true,
  "message": "PG Communities retrieved successfully",
  "data": [
    {
      "id": "string",
      "name": "string",
      "address": "string",
      "description": "string",
      "pgCode": "string"
    }
  ],
  "count": 3
}
```

#### GET /api/pg-community/my-community
Get resident's PG community (Resident only).

**Headers:** Authentication required

**Response:**
```json
{
  "success": true,
  "message": "Your PG Community retrieved successfully",
  "data": {
    "id": "string",
    "name": "string",
    "address": "string",
    "description": "string",
    "pgCode": "string",
    "owner": {
      "id": "string",
      "name": "string",
      "email": "string"
    }
  }
}
```

#### GET /api/pg-community/:id
Get a specific PG community by ID.

**Headers:** Authentication required

**Parameters:**
- `id` (string) - PG community ID

**Response:**
```json
{
  "success": true,
  "message": "PG Community retrieved successfully",
  "data": {
    "id": "string",
    "name": "string",
    "address": "string",
    "description": "string",
    "pgCode": "string",
    "owner": {
      "id": "string",
      "name": "string",
      "email": "string"
    },
    "residents": [
      {
        "id": "string",
        "name": "string",
        "email": "string",
        "profilePicture": "string"
      }
    ]
  }
}
```

#### PUT /api/pg-community/:id
Update a PG community (PG Owner only).

**Headers:** Authentication required

**Parameters:**
- `id` (string) - PG community ID

**Request Body:**
```json
{
  "name": "string",
  "address": "string",
  "description": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "PG Community updated successfully",
  "data": {
    "id": "string",
    "name": "string",
    "address": "string",
    "description": "string",
    "pgCode": "string"
  }
}
```

#### DELETE /api/pg-community/:id
Delete a PG community (PG Owner only).

**Headers:** Authentication required

**Parameters:**
- `id` (string) - PG community ID

**Response:**
```json
{
  "success": true,
  "message": "PG Community deleted successfully"
}
```

#### GET /api/pg-community/:id/stats
Get PG community statistics (PG Owner only).

**Headers:** Authentication required

**Parameters:**
- `id` (string) - PG community ID

**Response:**
```json
{
  "success": true,
  "message": "PG Community statistics retrieved successfully",
  "data": {
    "totalResidents": 25,
    "totalIssues": 15,
    "totalServices": 8,
    "totalEvents": 5,
    "totalTechnicians": 3
  }
}
```

#### GET /api/pg-community/:id/residents
Get all residents of a PG community (PG Owner only).

**Headers:** Authentication required

**Parameters:**
- `id` (string) - PG community ID

**Response:**
```json
{
  "success": true,
  "message": "Residents retrieved successfully",
  "data": {
    "pgCommunity": {
      "id": "string",
      "name": "string",
      "pgCode": "string"
    },
    "residents": [
      {
        "id": "string",
        "name": "string",
        "email": "string",
        "profilePicture": "string"
      }
    ],
    "count": 25
  }
}
```

### PG Analytics Endpoints

#### GET /api/pg-analytics/:id/dashboard
Get dashboard overview for a PG community.

**Headers:** Authentication required

**Parameters:**
- `id` (string) - PG community ID

**Response:**
```json
{
  "success": true,
  "message": "Dashboard overview retrieved successfully",
  "data": {
    "totalResidents": 25,
    "totalIssues": 15,
    "totalServices": 8,
    "totalEvents": 5,
    "totalTechnicians": 3,
    "recentIssues": [...],
    "recentServices": [...],
    "upcomingEvents": [...]
  }
}
```

#### GET /api/pg-analytics/:id/issues
Get all raised issues for a PG community with filters and pagination.

**Headers:** Authentication required

**Parameters:**
- `id` (string) - PG community ID

**Query Parameters:**
- `page` (number, optional, default: 1) - Page number
- `limit` (number, optional, default: 10) - Items per page
- `status` (string, optional) - Filter by status
- `priority` (string, optional) - Filter by priority
- `issueType` (string, optional) - Filter by issue type
- `sortBy` (string, optional, default: "createdAt") - Sort field
- `sortOrder` (string, optional, default: "desc") - Sort order

**Response:**
```json
{
  "success": true,
  "message": "Issues retrieved successfully",
  "data": [
    {
      "id": "string",
      "ticketNumber": 123,
      "title": "string",
      "description": "string",
      "issueType": "string",
      "priorityLevel": "string",
      "status": "string",
      "location": "string",
      "imageUrls": ["string"],
      "raisedBy": {
        "id": "string",
        "name": "string"
      },
      "assignedTechnician": {
        "id": "string",
        "name": "string"
      },
      "createdAt": "date",
      "updatedAt": "date"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  },
  "summary": {
    "total": 25,
    "pending": 5,
    "assigned": 8,
    "inProgress": 7,
    "resolved": 5
  }
}
```

#### GET /api/pg-analytics/:id/services
Get all requested services for a PG community with filters and pagination.

**Headers:** Authentication required

**Parameters:**
- `id` (string) - PG community ID

**Query Parameters:**
- `page` (number, optional, default: 1) - Page number
- `limit` (number, optional, default: 10) - Items per page
- `status` (string, optional) - Filter by status
- `priority` (string, optional) - Filter by priority
- `serviceType` (string, optional) - Filter by service type
- `sortBy` (string, optional, default: "createdAt") - Sort field
- `sortOrder` (string, optional, default: "desc") - Sort order

**Response:**
```json
{
  "success": true,
  "message": "Services retrieved successfully",
  "data": [
    {
      "id": "string",
      "ticketNumber": 456,
      "title": "string",
      "description": "string",
      "serviceType": "string",
      "priorityLevel": "string",
      "status": "string",
      "location": "string",
      "isApprovedByOwner": true,
      "ownerComment": "string",
      "requestedBy": {
        "id": "string",
        "name": "string"
      },
      "assignedTechnician": {
        "id": "string",
        "name": "string"
      },
      "createdAt": "date",
      "updatedAt": "date"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "totalPages": 2
  },
  "summary": {
    "total": 15,
    "pending": 3,
    "awaitingApproval": 2,
    "approved": 5,
    "assigned": 3,
    "inProgress": 1,
    "completed": 1
  }
}
```

#### GET /api/pg-analytics/:id/events
Get all events for a PG community with filters and pagination.

**Headers:** Authentication required

**Parameters:**
- `id` (string) - PG community ID

**Query Parameters:**
- `page` (number, optional, default: 1) - Page number
- `limit` (number, optional, default: 10) - Items per page
- `eventType` (string, optional) - Filter by event type
- `upcoming` (boolean, optional, default: false) - Filter upcoming events
- `sortBy` (string, optional, default: "startDate") - Sort field
- `sortOrder` (string, optional, default: "desc") - Sort order

**Response:**
```json
{
  "success": true,
  "message": "Events retrieved successfully",
  "data": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "eventType": "string",
      "location": "string",
      "startDate": "date",
      "endDate": "date",
      "maxCapacity": 50,
      "imageUrls": ["string"],
      "requiresRegistration": true,
      "registrationDeadline": "date",
      "createdBy": {
        "id": "string",
        "name": "string"
      },
      "attendances": [
        {
          "userId": "string",
          "status": "string",
          "registeredAt": "date"
        }
      ],
      "createdAt": "date"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 8,
    "totalPages": 1
  },
  "summary": {
    "total": 8,
    "upcoming": 3,
    "past": 5
  }
}
```

#### GET /api/pg-analytics/:id/analytics
Get comprehensive analytics for a PG community.

**Headers:** Authentication required

**Parameters:**
- `id` (string) - PG community ID

**Query Parameters:**
- `timeframe` (number, optional, default: 30) - Days to analyze

**Response:**
```json
{
  "success": true,
  "message": "Analytics retrieved successfully",
  "data": {
    "timeframe": 30,
    "issues": {
      "total": 25,
      "byType": {...},
      "byPriority": {...},
      "byStatus": {...},
      "trend": [...]
    },
    "services": {
      "total": 15,
      "byType": {...},
      "byPriority": {...},
      "byStatus": {...},
      "trend": [...]
    },
    "events": {
      "total": 8,
      "byType": {...},
      "attendance": {...},
      "trend": [...]
    },
    "technicians": {
      "total": 3,
      "workload": {...},
      "performance": {...}
    }
  }
}
```

#### GET /api/pg-analytics/:id/event-analytics
Get event-specific analytics for a PG community.

**Headers:** Authentication required

**Parameters:**
- `id` (string) - PG community ID

**Query Parameters:**
- `timeframe` (number, optional, default: 30) - Days to analyze

**Response:**
```json
{
  "success": true,
  "message": "Event analytics retrieved successfully",
  "data": {
    "timeframe": 30,
    "totalEvents": 8,
    "totalAttendees": 45,
    "averageAttendance": 5.6,
    "popularEventTypes": [...],
    "attendanceTrend": [...],
    "feedback": {
      "averageRating": 4.2,
      "totalFeedbacks": 12,
      "ratingDistribution": {...}
    }
  }
}
```

#### GET /api/pg-analytics/:id/activities
Get recent activities for a PG community.

**Headers:** Authentication required

**Parameters:**
- `id` (string) - PG community ID

**Query Parameters:**
- `limit` (number, optional, default: 20) - Number of activities

**Response:**
```json
{
  "success": true,
  "message": "Recent activities retrieved successfully",
  "data": [
    {
      "id": "string",
      "type": "ISSUE_CREATED" | "SERVICE_REQUESTED" | "EVENT_CREATED" | "TECHNICIAN_ASSIGNED",
      "description": "string",
      "userId": "string",
      "userName": "string",
      "timestamp": "date",
      "metadata": {...}
    }
  ]
}
```

### Technician Endpoints

#### POST /api/technician
Create a new technician for a specific PG community (PG Owner only).

**Headers:** Authentication required

**Request Body:**
```json
{
  "name": "string",
  "phoneNumber": "string",
  "speciality": "TechnicianField",
  "isAvailable": true,
  "pgCommunityId": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Technician created successfully",
  "data": {
    "id": "string",
    "name": "string",
    "phoneNumber": "string",
    "speciality": "string",
    "isAvailable": true,
    "pgAssignments": [...]
  }
}
```

#### GET /api/technician/pg/:pgCommunityId
Get all technicians for a specific PG community.

**Headers:** Authentication required

**Parameters:**
- `pgCommunityId` (string) - PG community ID

**Query Parameters:**
- `speciality` (string, optional) - Filter by speciality

**Response:**
```json
{
  "success": true,
  "message": "Technicians retrieved successfully",
  "data": [
    {
      "id": "string",
      "name": "string",
      "phoneNumber": "string",
      "speciality": "string",
      "isAvailable": true,
      "assignedIssues": [...],
      "assignedServices": [...]
    }
  ]
}
```

#### GET /api/technician/owner/available/:pgCommunityId
Get available technicians from other PG communities that can be imported (PG Owner only).

**Headers:** Authentication required

**Parameters:**
- `pgCommunityId` (string) - PG community ID

**Response:**
```json
{
  "success": true,
  "message": "Available technicians retrieved successfully",
  "data": [
    {
      "id": "string",
      "name": "string",
      "phoneNumber": "string",
      "speciality": "string",
      "isAvailable": true,
      "currentPgCommunities": [...]
    }
  ]
}
```

#### GET /api/technician/owner/all
Get all technicians managed by the owner across all their PG communities (PG Owner only).

**Headers:** Authentication required

**Response:**
```json
{
  "success": true,
  "message": "Technicians retrieved successfully",
  "data": [
    {
      "id": "string",
      "name": "string",
      "phoneNumber": "string",
      "speciality": "string",
      "isAvailable": true,
      "pgAssignments": [...],
      "workload": {
        "totalIssues": 5,
        "totalServices": 3,
        "pendingTasks": 2
      }
    }
  ]
}
```

#### GET /api/technician/:id
Get technician by ID with workload details (PG Owner only).

**Headers:** Authentication required

**Parameters:**
- `id` (string) - Technician ID

**Response:**
```json
{
  "success": true,
  "message": "Technician retrieved successfully",
  "data": {
    "id": "string",
    "name": "string",
    "phoneNumber": "string",
    "speciality": "string",
    "isAvailable": true,
    "pgAssignments": [...],
    "assignedIssues": [...],
    "assignedServices": [...],
    "workload": {
      "totalIssues": 5,
      "totalServices": 3,
      "pendingTasks": 2,
      "completedTasks": 6
    }
  }
}
```

#### PUT /api/technician/:id/availability
Update technician availability status (PG Owner only).

**Headers:** Authentication required

**Parameters:**
- `id` (string) - Technician ID

**Request Body:**
```json
{
  "isAvailable": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Technician availability updated successfully",
  "data": {
    "id": "string",
    "name": "string",
    "isAvailable": true
  }
}
```

#### POST /api/technician/:id/assign
Assign technician to additional PG communities (PG Owner only).

**Headers:** Authentication required

**Parameters:**
- `id` (string) - Technician ID

**Request Body:**
```json
{
  "pgCommunityIds": ["string"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Technician assigned to PG communities successfully",
  "data": {
    "id": "string",
    "name": "string",
    "pgAssignments": [...]
  }
}
```

#### DELETE /api/technician/:id/remove
Remove technician from specific PG communities (PG Owner only).

**Headers:** Authentication required

**Parameters:**
- `id` (string) - Technician ID

**Request Body:**
```json
{
  "pgCommunityIds": ["string"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Technician removed from PG communities successfully",
  "data": {
    "id": "string",
    "name": "string",
    "pgAssignments": [...]
  }
}
```

#### GET /api/technician/:id/workload
Get detailed workload statistics for a technician (PG Owner only).

**Headers:** Authentication required

**Parameters:**
- `id` (string) - Technician ID

**Response:**
```json
{
  "success": true,
  "message": "Technician workload retrieved successfully",
  "data": {
    "technician": {
      "id": "string",
      "name": "string",
      "speciality": "string"
    },
    "workload": {
      "totalIssues": 5,
      "totalServices": 3,
      "pendingTasks": 2,
      "completedTasks": 6,
      "averageResolutionTime": "2.5 days"
    },
    "byPgCommunity": [...],
    "byPriority": {...},
    "byStatus": {...},
    "recentActivity": [...]
  }
}
```

#### PUT /api/technician/:id
Update technician details (PG Owner only).

**Headers:** Authentication required

**Parameters:**
- `id` (string) - Technician ID

**Request Body:**
```json
{
  "name": "string",
  "phoneNumber": "string",
  "speciality": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Technician updated successfully",
  "data": {
    "id": "string",
    "name": "string",
    "phoneNumber": "string",
    "speciality": "string",
    "isAvailable": true
  }
}
```

#### DELETE /api/technician/:id
Delete a technician (PG Owner only, only if not assigned to any tasks).

**Headers:** Authentication required

**Parameters:**
- `id` (string) - Technician ID

**Response:**
```json
{
  "success": true,
  "message": "Technician deleted successfully"
}
```

### Voice Chat Endpoints

#### POST /api/voice-chat/getResidentCallData
Get resident call data for voice chat functionality.

**Request Body:**
```json
{
  // Voice chat specific data
}
```

**Response:**
```json
{
  "message": "Resident data in controller received",
  "data": {
    // Voice chat response data
  }
}
```

## Development Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- npm or pnpm

### Installation
1. Clone the repository
2. Navigate to server directory: `cd server`
3. Install dependencies: `npm install`
4. Set up environment variables (create `.env` file)
5. Run database migrations: `npx prisma migrate dev`
6. Start development server: `npm run dev`

### Environment Variables
```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
JWT_SECRET="your-jwt-secret"
NODE_ENV="development"
PORT=3000
FRONTEND_URL="http://localhost:5173"
```

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server

## Security Considerations

1. **Authentication**: JWT tokens stored in HTTP-only cookies
2. **Password Hashing**: bcrypt for secure password storage
3. **Input Validation**: Zod schema validation for all inputs
4. **CORS**: Configured for frontend origin
5. **Role-based Access**: Different permissions for PG owners and residents
6. **Data Ownership**: Users can only access their own data

## Rate Limiting

Currently not implemented. Consider adding rate limiting for production use.

## Monitoring and Logging

The API uses basic console logging. Consider implementing structured logging with tools like Winston or Pino for production.

## Testing

Test files are not included in the current codebase. Consider adding:
- Unit tests for services
- Integration tests for API endpoints
- E2E tests for critical user flows

## Deployment

1. Build the application: `npm run build`
2. Set production environment variables
3. Run database migrations: `npx prisma migrate deploy`
4. Start the server: `npm start`

## Support

For API support and questions, please refer to the project documentation or contact the development team. 