# Community AI - Repository Index

## 📋 Project Overview

**Community AI** is a comprehensive property management platform that connects residents, property owners, and maintenance staff through an AI-powered interface. The application facilitates issue reporting, service requests, and community management with voice-enabled features.

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript + Prisma ORM 
- **Database**: PostgreSQL
- **Authentication**: JWT + bcrypt
- **UI Components**: Radix UI + shadcn/ui
- **Styling**: Tailwind CSS + Framer Motion
- **Voice Features**: Custom voice chat implementation

## 🎯 Core Features

### 1. **Multi-Role User System**
- **Residents**: Report issues, request services, view community events
- **Property Owners**: Manage properties, approve requests, oversee maintenance
- **Technicians**: Handle assigned tasks, update status, communicate with residents

### 2. **Issue Management System**
- **Issue Types**: Plumbing, Electrical, HVAC, Security, Internet, Appliances, Structural, Pest Control
- **Priority Levels**: P1 (Critical), P2 (High), P3 (Medium), P4 (Low)
- **Status Tracking**: Pending → Assigned → In Progress → Resolved
- **Image Support**: Multiple image uploads for issue documentation

### 3. **Service Request System**
- **Service Types**: Cleaning, Maintenance, Repair, Installation, Upgrade, Inspection
- **Approval Workflow**: Owner approval required for service requests
- **Status Flow**: Pending → Awaiting Approval → Approved → Assigned → In Progress → Completed

### 4. **Voice-Enabled Features**
- **Voice Assistant**: AI-powered voice interface for residents
- **Voice Commands**: Raise issues, check status, request services
- **Natural Language Processing**: Convert speech to actionable requests

### 5. **Dashboard Interfaces**

#### Owner Dashboard (`/dashboard/owner`)
- Property management overview
- Staff management (technicians, building managers)
- Issue review and approval system
- Community event planning
- AI assistant for management tasks
- Statistics and analytics

#### Resident Dashboard (`/dashboard/resident`)
- Personal profile management
- Voice assistant for quick actions
- Issue reporting and tracking
- Service request submission
- Community event calendar
- Issue history and status

### Key UI Components
- **Hero Section**: Landing page with gradient backgrounds
- **Dashboard Cards**: Information-dense cards with actions
- **Voice Interface**: Mic-enabled buttons for voice commands
- **Navigation**: Sidebar navigation for dashboard users
- **Status Indicators**: Visual status tracking for issues/services

## 🚀 Development Setup

### Frontend (Client)
```bash
cd client
npm install
npm run dev
```

### Backend (Server)
```bash
cd server
npm install
npm run dev
```

### Database
```bash
cd server
npx prisma generate
npx prisma db push
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Input Validation**: Zod schema validation
- **CORS Configuration**: Cross-origin resource sharing setup
- **Helmet**: Security headers middleware

## 📱 Key User Flows

### Resident Journey
1. **Registration/Login** → Access resident dashboard
2. **Voice Assistant** → Speak to raise issues or check status
3. **Issue Reporting** → Submit detailed issue with images
4. **Service Requests** → Request maintenance services
5. **Status Tracking** → Monitor issue/service progress

### Owner Journey
1. **Dashboard Overview** → View property statistics and staff
2. **Issue Management** → Review and assign issues to technicians
3. **Service Approval** → Approve/reject service requests
4. **Staff Management** → Manage technicians and building staff
5. **Community Events** → Plan and announce community activities

### Technician Journey
1. **Task Assignment** → Receive assigned issues and services
2. **Status Updates** → Update progress on assigned tasks
3. **Communication** → Interact with residents and owners
4. **Availability Management** → Set availability status

## 🎯 Future Enhancements

- **Real-time Notifications**: WebSocket integration for live updates
- **Mobile App**: React Native application
- **Advanced Analytics**: Detailed reporting and insights
- **Payment Integration**: Service payment processing
- **Multi-language Support**: Internationalization
- **AI Chatbot**: Enhanced conversational AI
- **Document Management**: File upload and management system

## 📊 Performance Considerations

- **Code Splitting**: Route-based code splitting for faster loading
- **Image Optimization**: Efficient image handling and compression
- **Database Indexing**: Optimized queries with proper indexing
- **Caching**: Redis integration for improved performance
- **CDN**: Static asset delivery optimization

This repository represents a modern, scalable property management platform with AI-powered features designed to streamline community management and enhance resident experience. 
