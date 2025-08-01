// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Button } from '../../components/ui/button';
// import { 
//   Card, 
//   CardHeader, 
//   CardTitle, 
//   CardDescription, 
//   CardContent 
// } from '../../components/ui/card';
// import {
//   PlusCircle,
//   History,
//   CalendarDays,
//   Mic,
//   User,
//   Settings,
//   LogOut,
//   AlertCircle,
//   Clock,
//   CheckCircle,
//   XCircle,
//   Calendar,
//   MapPin,
//   Users,
//   Activity,
//   Wrench,
//   TrendingUp
// } from 'lucide-react';
// import userStore from '@/store/userStore';
// import { handleUserLogout } from '@/services/authService';

// const serverUrl = 'http://localhost:3000/api';

// // Simple Badge Component
// const Badge = ({ children, className = "", variant = "default" }: { 
//   children: React.ReactNode; 
//   className?: string; 
//   variant?: string; 
// }) => {
//   const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold";
//   const variantClasses = {
//     default: "bg-gray-100 text-gray-800",
//     outline: "border border-gray-200 bg-white text-gray-800"
//   };
  
//   return (
//     <span className={`${baseClasses} ${variantClasses[variant as keyof typeof variantClasses] || variantClasses.default} ${className}`}>
//       {children}
//     </span>
//   );
// };

// // Types for API responses
// interface Issue {
//   id: string;
//   title: string;
//   ticketNumber: string;
//   status: 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED';
//   priorityLevel: 'P1' | 'P2' | 'P3' | 'P4';
//   issueType: string;
//   createdAt: string;
//   assignedTechnician?: {
//     name: string;
//     phoneNumber: string;
//     speciality: string;
//   };
// }

// interface Service {
//   id: string;
//   title: string;
//   ticketNumber: string;
//   status: 'PENDING' | 'AWAITING_APPROVAL' | 'APPROVED' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';
//   priorityLevel: 'P1' | 'P2' | 'P3' | 'P4';
//   serviceType: string;
//   createdAt: string;
//   assignedTechnician?: {
//     name: string;
//     phoneNumber: string;
//     speciality: string;
//   };
// }

// interface Event {
//   id: string;
//   title: string;
//   eventType: string;
//   startDate: string;
//   endDate: string;
//   description?: string;
//   userAttendanceStatus?: 'REGISTERED' | 'ATTENDED' | 'MISSED';
//   _count: {
//     attendances: number;
//     feedbacks: number;
//   };
// }

// interface DashboardData {
//   user: {
//     id: string;
//     name: string;
//     email: string;
//     role: string;
//     profilePicture?: string;
//     pgCommunity: {
//       id: string;
//       name: string;
//       address: string;
//       pgCode: string;
//     };
//   };
//   quickStats: {
//     totalIssuesRaised: number;
//     totalServicesRequested: number;
//     totalEventsAttended: number;
//     pendingIssues: number;
//     pendingServices: number;
//     upcomingEvents: number;
//   };
//   summaries: {
//     issues: any;
//     services: any;
//     events: any;
//   };
//   recentActivities: any[];
// }

// const ResidentDashboard = () => {
//   const { user } = userStore();
//   const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
//   const [userIssues, setUserIssues] = useState<Issue[]>([]);
//   const [userServices, setUserServices] = useState<Service[]>([]);
//   const [userEvents, setUserEvents] = useState<Event[]>([]);
//   const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('overview');

//   // Fetch dashboard data
//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
      
//       // Fetch user dashboard overview
//       const dashboardResponse = await axios.get(`${serverUrl}/pg-analytics/user/dashboard`, {
//         withCredentials: true
//       });
      
//       if (dashboardResponse.data.success) {
//         setDashboardData(dashboardResponse.data.data);
        
//         // Fetch user's issues, services, events, and upcoming events in parallel
//         const [issuesRes, servicesRes, eventsRes, upcomingRes] = await Promise.all([
//           axios.get(`${serverUrl}/pg-analytics/user/issues?limit=5&sortBy=createdAt&sortOrder=desc`, {
//             withCredentials: true
//           }),
//           axios.get(`${serverUrl}/pg-analytics/user/services?limit=5&sortBy=createdAt&sortOrder=desc`, {
//             withCredentials: true
//           }),
//           axios.get(`${serverUrl}/pg-analytics/user/events?limit=5&sortBy=createdAt&sortOrder=desc`, {
//             withCredentials: true
//           }),
//           axios.get(`${serverUrl}/pg-analytics/${dashboardResponse.data.data.user.pgCommunity.id}/events?upcoming=true&limit=5`, {
//             withCredentials: true
//           })
//         ]);

//         if (issuesRes.data.success) setUserIssues(issuesRes.data.data);
//         if (servicesRes.data.success) setUserServices(servicesRes.data.data);
//         if (eventsRes.data.success) setUserEvents(eventsRes.data.data);
//         if (upcomingRes.data.success) setUpcomingEvents(upcomingRes.data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getPriorityColor = (priority: string) => {
//     switch (priority) {
//       case 'P1': return 'bg-red-100 text-red-800 border-red-200';
//       case 'P2': return 'bg-orange-100 text-orange-800 border-orange-200';
//       case 'P3': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//       case 'P4': return 'bg-green-100 text-green-800 border-green-200';
//       default: return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'PENDING': return 'bg-yellow-100 text-yellow-800';
//       case 'ASSIGNED': return 'bg-blue-100 text-blue-800';
//       case 'IN_PROGRESS': return 'bg-purple-100 text-purple-800';
//       case 'RESOLVED': case 'COMPLETED': return 'bg-green-100 text-green-800';
//       case 'REJECTED': return 'bg-red-100 text-red-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'PENDING': return <Clock className="h-4 w-4" />;
//       case 'ASSIGNED': case 'IN_PROGRESS': return <Activity className="h-4 w-4" />;
//       case 'RESOLVED': case 'COMPLETED': return <CheckCircle className="h-4 w-4" />;
//       case 'REJECTED': return <XCircle className="h-4 w-4" />;
//       default: return <AlertCircle className="h-4 w-4" />;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
//         <div className="flex items-center justify-center h-64">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
//             <p className="text-slate-600">Loading dashboard...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const tabs = [
//     { id: 'overview', label: 'Overview', icon: TrendingUp },
//     { id: 'issues', label: 'My Issues', icon: AlertCircle },
//     { id: 'services', label: 'My Services', icon: Wrench },
//     { id: 'events', label: 'Events', icon: Calendar }
//   ];

//   return (
//     <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
//       <header className="mb-8 flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">
//             Welcome, {user.name}
//           </h1>
//           <p className="text-slate-500">
//             {dashboardData?.user.pgCommunity.name} • {dashboardData?.user.pgCommunity.pgCode}
//           </p>
//         </div>
//         <button onClick={handleUserLogout} className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
//           <LogOut className="h-5 w-5" />
//         </button>
//       </header>

//       {/* Simple Tab Navigation */}
//       <div className="mb-6">
//         <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
//           {tabs.map((tab) => {
//             const Icon = tab.icon;
//             return (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
//                   activeTab === tab.id
//                     ? 'bg-white text-gray-900 shadow-sm'
//                     : 'text-gray-600 hover:text-gray-900'
//                 }`}
//               >
//                 <Icon className="h-4 w-4 mr-2" />
//                 {tab.label}
//               </button>
//             );
//           })}
//         </div>
//       </div>

//       {/* Tab Content */}
//       {activeTab === 'overview' && (
//         <div className="space-y-6">
//           {/* Quick Stats Cards */}
//           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//             <Card>
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-2xl font-bold">{dashboardData?.quickStats.totalIssuesRaised || 0}</p>
//                     <p className="text-sm text-muted-foreground">Issues Raised</p>
//                   </div>
//                   <AlertCircle className="h-8 w-8 text-red-500" />
//                 </div>
//                 {dashboardData?.quickStats.pendingIssues ? (
//                   <p className="text-xs text-orange-600 mt-2">
//                     {dashboardData.quickStats.pendingIssues} pending
//                   </p>
//                 ) : null}
//               </CardContent>
//             </Card>

//             <Card>
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-2xl font-bold">{dashboardData?.quickStats.totalServicesRequested || 0}</p>
//                     <p className="text-sm text-muted-foreground">Services Requested</p>
//                   </div>
//                   <Wrench className="h-8 w-8 text-blue-500" />
//                 </div>
//                 {dashboardData?.quickStats.pendingServices ? (
//                   <p className="text-xs text-orange-600 mt-2">
//                     {dashboardData.quickStats.pendingServices} pending
//                   </p>
//                 ) : null}
//               </CardContent>
//             </Card>

//             <Card>
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-2xl font-bold">{dashboardData?.quickStats.totalEventsAttended || 0}</p>
//                     <p className="text-sm text-muted-foreground">Events Attended</p>
//                   </div>
//                   <Calendar className="h-8 w-8 text-green-500" />
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-2xl font-bold">{dashboardData?.quickStats.upcomingEvents || 0}</p>
//                     <p className="text-sm text-muted-foreground">Upcoming Events</p>
//                   </div>
//                   <CalendarDays className="h-8 w-8 text-purple-500" />
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Profile and Quick Actions */}
//           <div className="grid gap-6 md:grid-cols-3">
//             {/* Profile Card */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center justify-between">
//                   My Profile
//                   <User className="h-5 w-5 text-slate-400" />
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex items-center gap-4 mb-4">
//                   <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden">
//                     {user.profilePicture ? (
//                       <img 
//                         src={user.profilePicture} 
//                         alt="user-profile" 
//                         className="w-full h-full object-cover rounded-md"
//                       />
//                     ) : (
//                       <User className="h-8 w-8 text-orange-600" />
//                     )}
//                   </div>
//                   <div>
//                     <p className="font-bold text-lg">{user.name}</p>
//                     <p className="text-sm text-muted-foreground">{user.email}</p>
//                     <Badge variant="outline" className="mt-1 text-xs">
//                       {user.role?.replace('_', ' ')}
//                     </Badge>
//                   </div>
//                 </div>
//                 <Button variant="outline" className="w-full">
//                   <Settings className="mr-2 h-4 w-4" />
//                   Edit Profile
//                 </Button>
//               </CardContent>
//             </Card>

//             {/* PG Community Info */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center justify-between">
//                   My PG Community
//                   <MapPin className="h-5 w-5 text-slate-400" />
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-3">
//                   <div>
//                     <p className="font-semibold text-lg">{dashboardData?.user.pgCommunity.name}</p>
//                     <p className="text-sm text-muted-foreground">Code: {dashboardData?.user.pgCommunity.pgCode}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium">Address:</p>
//                     <p className="text-sm text-muted-foreground">{dashboardData?.user.pgCommunity.address}</p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Voice Assistant */}
//             <Card className="bg-orange-50 border-orange-200">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2 text-orange-800">
//                   <Mic />
//                   Voice Assistant
//                 </CardTitle>
//                 <CardDescription>Speak to raise a new issue or check status.</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <Button className="w-full bg-[#FF4500] hover:bg-[#E03E00] text-white">
//                   <Mic className="mr-2 h-4 w-4" />
//                   Tap to Speak
//                 </Button>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Recent Activities */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Recent Activities</CardTitle>
//               <CardDescription>Your latest interactions in the community</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {dashboardData?.recentActivities.slice(0, 5).map((activity, index) => (
//                   <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
//                     <div className="flex-shrink-0">
//                       {activity.type === 'ISSUE' && <AlertCircle className="h-5 w-5 text-red-500" />}
//                       {activity.type === 'SERVICE' && <Wrench className="h-5 w-5 text-blue-500" />}
//                       {activity.type === 'EVENT_ATTENDANCE' && <Calendar className="h-5 w-5 text-green-500" />}
//                     </div>
//                     <div className="flex-1">
//                       <p className="font-medium">{activity.title}</p>
//                       <p className="text-sm text-muted-foreground">{activity.description}</p>
//                       <p className="text-xs text-muted-foreground">
//                         {new Date(activity.createdAt).toLocaleDateString()}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//                 {!dashboardData?.recentActivities.length && (
//                   <p className="text-center text-muted-foreground py-4">No recent activities</p>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       )}

//       {activeTab === 'issues' && (
//         <div className="space-y-6">

//           <div className="grid gap-4">
//             {userIssues.map((issue) => (
//               <Card key={issue.id}>
//                 <CardContent className="p-6">
//                   <div className="flex items-start justify-between">
//                     <div className="flex-1">
//                       <div className="flex items-center gap-2 mb-2">
//                         <h3 className="font-semibold">{issue.title}</h3>
//                         <Badge variant="outline">#{issue.ticketNumber}</Badge>
//                       </div>
//                       <div className="flex items-center gap-4 mb-2">
//                         <Badge className={getPriorityColor(issue.priorityLevel)}>
//                           {issue.priorityLevel}
//                         </Badge>
//                         <Badge className={getStatusColor(issue.status)}>
//                           {getStatusIcon(issue.status)}
//                           <span className="ml-1">{issue.status.replace('_', ' ')}</span>
//                         </Badge>
//                         <span className="text-sm text-muted-foreground">{issue.issueType}</span>
//                       </div>
//                       {issue.assignedTechnician && (
//                         <p className="text-sm text-muted-foreground">
//                           Assigned to: {issue.assignedTechnician.name} ({issue.assignedTechnician.speciality})
//                         </p>
//                       )}
//                       <p className="text-xs text-muted-foreground mt-2">
//                         Created: {new Date(issue.createdAt).toLocaleDateString()}
//                       </p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//             {!userIssues.length && (
//               <Card>
//                 <CardContent className="p-8 text-center">
//                   <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//                   <p className="text-muted-foreground">You haven't raised any issues yet.</p>
//                   <Button className="mt-4">
//                     <PlusCircle className="mr-2 h-4 w-4" />
//                     Raise Your First Issue
//                   </Button>
//                 </CardContent>
//               </Card>
//             )}
//           </div>
//         </div>
//       )}

//       {activeTab === 'services' && (
//         <div className="space-y-6">

//           <div className="grid gap-4">
//             {userServices.map((service) => (
//               <Card key={service.id}>
//                 <CardContent className="p-6">
//                   <div className="flex items-start justify-between">
//                     <div className="flex-1">
//                       <div className="flex items-center gap-2 mb-2">
//                         <h3 className="font-semibold">{service.title}</h3>
//                         <Badge variant="outline">#{service.ticketNumber}</Badge>
//                       </div>
//                       <div className="flex items-center gap-4 mb-2">
//                         <Badge className={getPriorityColor(service.priorityLevel)}>
//                           {service.priorityLevel}
//                         </Badge>
//                         <Badge className={getStatusColor(service.status)}>
//                           {getStatusIcon(service.status)}
//                           <span className="ml-1">{service.status.replace('_', ' ')}</span>
//                         </Badge>
//                         <span className="text-sm text-muted-foreground">{service.serviceType}</span>
//                       </div>
//                       {service.assignedTechnician && (
//                         <p className="text-sm text-muted-foreground">
//                           Assigned to: {service.assignedTechnician.name} ({service.assignedTechnician.speciality})
//                         </p>
//                       )}
//                       <p className="text-xs text-muted-foreground mt-2">
//                         Requested: {new Date(service.createdAt).toLocaleDateString()}
//                       </p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//             {!userServices.length && (
//               <Card>
//                 <CardContent className="p-8 text-center">
//                   <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//                   <p className="text-muted-foreground">You haven't requested any services yet.</p>
//                   <Button className="mt-4">
//                     <PlusCircle className="mr-2 h-4 w-4" />
//                     Request Your First Service
//                   </Button>
//                 </CardContent>
//               </Card>
//             )}
//           </div>
//         </div>
//       )}

//       {activeTab === 'events' && (
//         <div className="space-y-6">
//           <h2 className="text-2xl font-bold">Events</h2>
          
//           <div className="grid gap-6 md:grid-cols-2">
            
//             {/* Upcoming Events */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <CalendarDays className="h-5 w-5" />
//                   Upcoming Events
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {upcomingEvents.slice(0, 3).map((event) => (
//                     <div key={event.id} className="p-3 bg-slate-50 rounded-lg">
//                       <h4 className="font-medium">{event.title}</h4>
//                       <p className="text-sm text-muted-foreground">{event.eventType}</p>
//                       <p className="text-xs text-muted-foreground">
//                         {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
//                       </p>
//                       <div className="flex items-center gap-2 mt-2">
//                         <Badge variant="outline">
//                           <Users className="h-3 w-3 mr-1" />
//                           {event._count.attendances} registered
//                         </Badge>
//                       </div>
//                     </div>
//                   ))}
//                   {!upcomingEvents.length && (
//                     <p className="text-center text-muted-foreground py-4">No upcoming events</p>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>

//             {/* My Event History */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <History className="h-5 w-5" />
//                   My Event History
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {userEvents.slice(0, 3).map((event) => (
//                     <div key={event.id} className="p-3 bg-slate-50 rounded-lg">
//                       <h4 className="font-medium">{event.title}</h4>
//                       <p className="text-sm text-muted-foreground">{event.eventType}</p>
//                       <p className="text-xs text-muted-foreground">
//                         {new Date(event.startDate).toLocaleDateString()}
//                       </p>
//                       {event.userAttendanceStatus && (
//                         <Badge 
//                           variant="outline" 
//                           className={`mt-2 ${
//                             event.userAttendanceStatus === 'ATTENDED' 
//                               ? 'bg-green-100 text-green-800' 
//                               : event.userAttendanceStatus === 'MISSED'
//                               ? 'bg-red-100 text-red-800'
//                               : 'bg-blue-100 text-blue-800'
//                           }`}
//                         >
//                           {event.userAttendanceStatus}
//                         </Badge>
//                       )}
//                     </div>
//                   ))}
//                   {!userEvents.length && (
//                     <p className="text-center text-muted-foreground py-4">No events attended yet</p>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ResidentDashboard;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../../components/ui/button';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '../../components/ui/card';
import {
  PlusCircle,
  History,
  CalendarDays,
  Mic,
  User,
  Settings,
  LogOut,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  MapPin,
  Users,
  Activity,
  Wrench,
  TrendingUp,
  Menu,
  X,
  ArrowLeft
} from 'lucide-react';
import userStore from '@/store/userStore';
import { handleUserLogout } from '@/services/authService';

const serverUrl = 'http://localhost:3000/api';

// Simple Badge Component
const Badge = ({ children, className = "", variant = "default" }: { 
  children: React.ReactNode; 
  className?: string; 
  variant?: string; 
}) => {
  const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold";
  const variantClasses = {
    default: "bg-gray-100 text-gray-800",
    outline: "border border-gray-200 bg-white text-gray-800"
  };
  
  return (
    <span className={`${baseClasses} ${variantClasses[variant as keyof typeof variantClasses] || variantClasses.default} ${className}`}>
      {children}
    </span>
  );
};

// Types for API responses
interface Issue {
  id: string;
  title: string;
  ticketNumber: string;
  status: 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED';
  priorityLevel: 'P1' | 'P2' | 'P3' | 'P4';
  issueType: string;
  createdAt: string;
  assignedTechnician?: {
    name: string;
    phoneNumber: string;
    speciality: string;
  };
}

interface Service {
  id: string;
  title: string;
  ticketNumber: string;
  status: 'PENDING' | 'AWAITING_APPROVAL' | 'APPROVED' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';
  priorityLevel: 'P1' | 'P2' | 'P3' | 'P4';
  serviceType: string;
  createdAt: string;
  assignedTechnician?: {
    name: string;
    phoneNumber: string;
    speciality: string;
  };
}

interface Event {
  id: string;
  title: string;
  eventType: string;
  startDate: string;
  endDate: string;
  description?: string;
  userAttendanceStatus?: 'REGISTERED' | 'ATTENDED' | 'MISSED';
  _count: {
    attendances: number;
    feedbacks: number;
  };
}

interface DashboardData {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    profilePicture?: string;
    pgCommunity: {
      id: string;
      name: string;
      address: string;
      pgCode: string;
    };
  };
  quickStats: {
    totalIssuesRaised: number;
    totalServicesRequested: number;
    totalEventsAttended: number;
    pendingIssues: number;
    pendingServices: number;
    upcomingEvents: number;
  };
  summaries: {
    issues: any;
    services: any;
    events: any;
  };
  recentActivities: any[];
}

type TabType = 'overview' | 'issues' | 'services' | 'events';

interface TabConfig {
  id: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const tabs: TabConfig[] = [
  { id: 'overview', label: 'Overview', icon: TrendingUp },
  { id: 'issues', label: 'My Issues', icon: AlertCircle },
  { id: 'services', label: 'My Services', icon: Wrench },
  { id: 'events', label: 'Events', icon: Calendar }
];

const ResidentDashboard = () => {
  const { user } = userStore();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [userIssues, setUserIssues] = useState<Issue[]>([]);
  const [userServices, setUserServices] = useState<Service[]>([]);
  const [userEvents, setUserEvents] = useState<Event[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch user dashboard overview
      const dashboardResponse = await axios.get(`${serverUrl}/pg-analytics/user/dashboard`, {
        withCredentials: true
      });
      
      if (dashboardResponse.data.success) {
        setDashboardData(dashboardResponse.data.data);
        
        // Fetch user's issues, services, events, and upcoming events in parallel
        const [issuesRes, servicesRes, eventsRes, upcomingRes] = await Promise.all([
          axios.get(`${serverUrl}/pg-analytics/user/issues?limit=5&sortBy=createdAt&sortOrder=desc`, {
            withCredentials: true
          }),
          axios.get(`${serverUrl}/pg-analytics/user/services?limit=5&sortBy=createdAt&sortOrder=desc`, {
            withCredentials: true
          }),
          axios.get(`${serverUrl}/pg-analytics/user/events?limit=5&sortBy=createdAt&sortOrder=desc`, {
            withCredentials: true
          }),
          axios.get(`${serverUrl}/pg-analytics/${dashboardResponse.data.data.user.pgCommunity.id}/events?upcoming=true&limit=5`, {
            withCredentials: true
          })
        ]);

        if (issuesRes.data.success) setUserIssues(issuesRes.data.data);
        if (servicesRes.data.success) setUserServices(servicesRes.data.data);
        if (eventsRes.data.success) setUserEvents(eventsRes.data.data);
        if (upcomingRes.data.success) setUpcomingEvents(upcomingRes.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'P1': return 'bg-red-100 text-red-800 border-red-200';
      case 'P2': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'P3': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'P4': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'ASSIGNED': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-purple-100 text-purple-800';
      case 'RESOLVED': case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="h-4 w-4" />;
      case 'ASSIGNED': case 'IN_PROGRESS': return <Activity className="h-4 w-4" />;
      case 'RESOLVED': case 'COMPLETED': return <CheckCircle className="h-4 w-4" />;
      case 'REJECTED': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleTabChange = (tabId: TabType) => {
    setActiveTab(tabId);
    setIsMenuOpen(false);
  };

  const getActiveTabLabel = () => {
    const activeTabConfig = tabs.find(tab => tab.id === activeTab);
    return activeTabConfig?.label || 'Overview';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center px-4" style={{ backgroundImage: 'radial-gradient(292.12% 100% at 50% 0%, #F9F7F5 0%, #FFF8F1 21.63%, #FFE4C9 45.15%, #FFE9C9 67.31%,#FFFAF3 100%)' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#FF4500]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundImage: 'radial-gradient(292.12% 100% at 50% 0%, #F9F7F5 0%, #FFF8F1 21.63%, #FFE4C9 45.15%, #FFE9C9 67.31%,#FFFAF3 100%)' }}>
      {/* Mobile Header */}
      <div className="bg-white shadow-lg shadow-black/5 border-b border-orange-100">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center overflow-hidden">
                {user.profilePicture ? (
                  <img 
                    src={user.profilePicture} 
                    alt="profile" 
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <User className="h-5 w-5 text-[#FF4500]" />
                )}
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">{user.name}</h1>
                <p className="text-xs text-gray-500">{dashboardData?.user.pgCommunity.name}</p>
              </div>
            </div>
            
            {/* Hamburger Menu Button */}
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-[#FF4500] p-2 rounded-xl hover:bg-orange-50 transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={toggleMenu}>
          <div className="absolute top-2 right-2 w-[96%] rounded-xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Menu</h2>
                <button
                  onClick={toggleMenu}
                  className="text-gray-700 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {/* User Profile Section */}
              <div className="mb-6 p-4 bg-orange-50 rounded-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center overflow-hidden">
                    {user.profilePicture ? (
                      <img 
                        src={user.profilePicture} 
                        alt="profile" 
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <User className="h-6 w-6 text-[#FF4500]" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{dashboardData?.user.pgCommunity.name}</span>
                </div>
              </div>

              {/* Navigation Tabs */}
              <nav className="mb-6">
                <ul className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <li key={tab.id}>
                        <button
                          onClick={() => handleTabChange(tab.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-2xl transition-all duration-200 ${
                            activeTab === tab.id
                              ? 'bg-[#FF4500] text-white shadow-lg'
                              : 'text-gray-600 hover:bg-orange-50 hover:text-[#FF4500]'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          {tab.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* Quick Actions */}
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-orange-50 hover:text-[#FF4500] rounded-2xl transition-all duration-200">
                  <Settings className="h-5 w-5" />
                  Settings
                </button>
                <button 
                  onClick={handleUserLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-2xl transition-all duration-200"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="px-4 py-6">
        {/* Current Tab Indicator */}
        <div className="mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-gray-200 shadow-md border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{getActiveTabLabel()}</h2>
                <p className="text-sm text-gray-500">Resident Dashboard</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                {(() => {
                  const activeTabConfig = tabs.find(tab => tab.id === activeTab);
                  const Icon = activeTabConfig?.icon || TrendingUp;
                  return <Icon className="h-6 w-6 text-[#FF4500]" />;
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white/50 rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
          {activeTab === 'overview' && (
            <div className="p-6 space-y-6">
              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-orange-100">
                  <div className="flex items-center justify-between mb-2">
                    <AlertCircle className="h-6 w-6 text-red-500" />
                    <span className="text-2xl font-bold text-gray-900">{dashboardData?.quickStats.totalIssuesRaised || 0}</span>
                  </div>
                  <p className="text-sm text-gray-600">Issues Raised</p>
                  {dashboardData?.quickStats.pendingIssues ? (
                    <p className="text-xs text-orange-600 mt-1">
                      {dashboardData.quickStats.pendingIssues} pending
                    </p>
                  ) : null}
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-sm border border-orange-100">
                  <div className="flex items-center justify-between mb-2">
                    <Wrench className="h-6 w-6 text-blue-500" />
                    <span className="text-2xl font-bold text-gray-900">{dashboardData?.quickStats.totalServicesRequested || 0}</span>
                  </div>
                  <p className="text-sm text-gray-600">Services Requested</p>
                  {dashboardData?.quickStats.pendingServices ? (
                    <p className="text-xs text-orange-600 mt-1">
                      {dashboardData.quickStats.pendingServices} pending
                    </p>
                  ) : null}
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-sm border border-orange-100">
                  <div className="flex items-center justify-between mb-2">
                    <Calendar className="h-6 w-6 text-green-500" />
                    <span className="text-2xl font-bold text-gray-900">{dashboardData?.quickStats.totalEventsAttended || 0}</span>
                  </div>
                  <p className="text-sm text-gray-600">Events Attended</p>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-sm border border-orange-100">
                  <div className="flex items-center justify-between mb-2">
                    <CalendarDays className="h-6 w-6 text-purple-500" />
                    <span className="text-2xl font-bold text-gray-900">{dashboardData?.quickStats.upcomingEvents || 0}</span>
                  </div>
                  <p className="text-sm text-gray-600">Upcoming Events</p>
                </div>
              </div>

              {/* Voice Assistant Card */}
              <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Mic className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Voice Assistant</h3>
                    <p className="text-sm text-white/80">Speak to raise issues or check status</p>
                  </div>
                </div>
                <button className="w-full bg-white/20 hover:bg-white/30 text-white px-4 py-3 rounded-xl transition-colors font-medium">
                  <Mic className="h-4 w-4 mr-2 inline-block" />
                  Tap to Speak
                </button>
              </div>

              {/* Recent Activities */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
                <h3 className="font-bold text-lg text-gray-900 mb-4">Recent Activities</h3>
                <div className="space-y-3">
                  {dashboardData?.recentActivities.slice(0, 3).map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="flex-shrink-0">
                        {activity.type === 'ISSUE' && <AlertCircle className="h-5 w-5 text-red-500" />}
                        {activity.type === 'SERVICE' && <Wrench className="h-5 w-5 text-blue-500" />}
                        {activity.type === 'EVENT_ATTENDANCE' && <Calendar className="h-5 w-5 text-green-500" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{activity.title}</p>
                        <p className="text-xs text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(activity.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {!dashboardData?.recentActivities.length && (
                    <p className="text-center text-gray-500 py-4">No recent activities</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'issues' && (
            <div className="p-6 space-y-4">
              {userIssues.map((issue) => (
                <div key={issue.id} className="bg-white rounded-2xl p-4 shadow-sm border border-orange-100">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{issue.title}</h3>
                        <Badge variant="outline">#{issue.ticketNumber}</Badge>
                      </div>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Badge className={getPriorityColor(issue.priorityLevel)}>
                          {issue.priorityLevel}
                        </Badge>
                        <Badge className={getStatusColor(issue.status)}>
                          {getStatusIcon(issue.status)}
                          <span className="ml-1">{issue.status.replace('_', ' ')}</span>
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{issue.issueType}</p>
                      {issue.assignedTechnician && (
                        <p className="text-sm text-gray-600">
                          Assigned: {issue.assignedTechnician.name} ({issue.assignedTechnician.speciality})
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        Created: {new Date(issue.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {!userIssues.length && (
                <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-orange-100">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">You haven't raised any issues yet.</p>
                  <button className="bg-[#FF4500] text-white px-4 py-2 rounded-xl hover:bg-[#E03E00] transition-colors">
                    <PlusCircle className="h-4 w-4 mr-2 inline-block" />
                    Raise Your First Issue
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'services' && (
            <div className="p-6 space-y-4">
              {userServices.map((service) => (
                <div key={service.id} className="bg-white rounded-2xl p-4 shadow-sm border border-orange-100">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{service.title}</h3>
                        <Badge variant="outline">#{service.ticketNumber}</Badge>
                      </div>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Badge className={getPriorityColor(service.priorityLevel)}>
                          {service.priorityLevel}
                        </Badge>
                        <Badge className={getStatusColor(service.status)}>
                          {getStatusIcon(service.status)}
                          <span className="ml-1">{service.status.replace('_', ' ')}</span>
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{service.serviceType}</p>
                      {service.assignedTechnician && (
                        <p className="text-sm text-gray-600">
                          Assigned: {service.assignedTechnician.name} ({service.assignedTechnician.speciality})
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        Requested: {new Date(service.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {!userServices.length && (
                <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-orange-100">
                  <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">You haven't requested any services yet.</p>
                  <button className="bg-[#FF4500] text-white px-4 py-2 rounded-xl hover:bg-[#E03E00] transition-colors">
                    <PlusCircle className="h-4 w-4 mr-2 inline-block" />
                    Request Your First Service
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'events' && (
            <div className="p-6 space-y-6">
              {/* Upcoming Events */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-orange-100">
                <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-[#FF4500]" />
                  Upcoming Events
                </h3>
                <div className="space-y-3">
                  {upcomingEvents.slice(0, 3).map((event) => (
                    <div key={event.id} className="p-3 bg-gray-50 rounded-xl">
                      <h4 className="font-medium text-gray-900">{event.title}</h4>
                      <p className="text-sm text-gray-600">{event.eventType}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          <Users className="h-3 w-3 mr-1" />
                          {event._count.attendances} registered
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {!upcomingEvents.length && (
                    <p className="text-center text-gray-500 py-4">No upcoming events</p>
                  )}
                </div>
              </div>

              {/* Event History */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-orange-100">
                <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                  <History className="h-5 w-5 text-[#FF4500]" />
                  My Event History
                </h3>
                <div className="space-y-3">
                  {userEvents.slice(0, 3).map((event) => (
                    <div key={event.id} className="p-3 bg-gray-50 rounded-xl">
                      <h4 className="font-medium text-gray-900">{event.title}</h4>
                      <p className="text-sm text-gray-600">{event.eventType}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(event.startDate).toLocaleDateString()}
                      </p>
                      {event.userAttendanceStatus && (
                        <Badge 
                          variant="outline" 
                          className={`mt-2 text-xs ${
                            event.userAttendanceStatus === 'ATTENDED' 
                              ? 'bg-green-100 text-green-800' 
                              : event.userAttendanceStatus === 'MISSED'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {event.userAttendanceStatus}
                        </Badge>
                      )}
                    </div>
                  ))}
                  {!userEvents.length && (
                    <p className="text-center text-gray-500 py-4">No events attended yet</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResidentDashboard;