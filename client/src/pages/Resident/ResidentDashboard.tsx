import React from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { 
  PlusCircle, 
  History, 
  CalendarDays, 
  Mic, 
  User, 
  Settings, 
  Search,
  Bell,
  Mail,
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  Home,
  LogOut,
  Phone,
  MessageCircle,
  FileText,
  Shield,
  Wrench,
  TrendingUp,
  ArrowRight,
  Heart
} from 'lucide-react';

// Mock data
const myIssues = [
  { id: 1, title: 'Water Leak in Kitchen', priority: 'High', status: 'In Progress', time: '2 hours ago', category: 'PLUMBING' },
  { id: 2, title: 'AC Not Cooling Properly', priority: 'Medium', status: 'Assigned', time: '1 day ago', category: 'HVAC' },
  { id: 3, title: 'Light Bulb Replacement', priority: 'Low', status: 'Completed', time: '3 days ago', category: 'ELECTRICAL' },
];

const upcomingEvents = [
  { id: 1, title: 'Community Diwali Celebration', date: 'Tomorrow, 6:00 PM', location: 'Common Area', type: 'Celebration' },
  { id: 2, title: 'Monthly Residents Meeting', date: 'Friday, 2:00 PM', location: 'Community Hall', type: 'Meeting' },
  { id: 3, title: 'Yoga Session', date: 'Sunday, 7:00 AM', location: 'Garden Area', type: 'Wellness' },
];

const quickServices = [
  { id: 1, title: 'Report Issue', icon: AlertCircle, color: 'from-red-400 to-red-600', description: 'Report a maintenance issue' },
  { id: 2, title: 'Request Service', icon: Wrench, color: 'from-blue-400 to-blue-600', description: 'Request a new service' },
  { id: 3, title: 'Contact Support', icon: MessageCircle, color: 'from-green-400 to-green-600', description: 'Get help from support team' },
  { id: 4, title: 'View Documents', icon: FileText, color: 'from-purple-400 to-purple-600', description: 'Access community documents' },
];

const stats = [
  { label: 'Issues Resolved', value: '12', icon: CheckCircle, change: '+3 this month', color: 'text-green-600' },
  { label: 'Active Tickets', value: '2', icon: Clock, change: '2 pending', color: 'text-orange-600' },
  { label: 'Community Rating', value: '4.8', icon: Star, change: '+0.2 this month', color: 'text-yellow-600' },
  { label: 'Events Attended', value: '8', icon: CalendarDays, change: '+2 this month', color: 'text-blue-600' },
];

const ResidentDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-yellow-50">
      {/* Top Navigation */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-4 py-3 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <div>
              <span className="font-bold text-gray-900 text-lg">Community</span>
              <span className="text-[#FF4500] font-bold text-lg">AI</span>
            </div>
          </div>
          
          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search your community..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="relative">
              <Mail className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-semibold text-sm">AR</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-gray-900">Anushree</p>
                <p className="text-xs text-gray-500">Resident</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar */}
        <div className="hidden lg:block w-64 bg-white/80 backdrop-blur-md border-r border-gray-200/50 min-h-screen p-6">
          <div className="space-y-6">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">OVERVIEW</p>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start bg-gradient-to-r from-orange-50 to-red-50 text-orange-700 border border-orange-200">
                  <Home className="w-4 h-4 mr-3" />
                  Dashboard
                </Button>
                <Button variant="ghost" className="w-full justify-start hover:bg-orange-50">
                  <AlertCircle className="w-4 h-4 mr-3" />
                  My Issues
                </Button>
                <Button variant="ghost" className="w-full justify-start hover:bg-orange-50">
                  <Wrench className="w-4 h-4 mr-3" />
                  Services
                </Button>
                <Button variant="ghost" className="w-full justify-start hover:bg-orange-50">
                  <CalendarDays className="w-4 h-4 mr-3" />
                  Events
                </Button>
                <Button variant="ghost" className="w-full justify-start hover:bg-orange-50">
                  <FileText className="w-4 h-4 mr-3" />
                  Documents
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">SUPPORT</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-orange-50 transition-colors">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">BM</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Building Manager</p>
                    <p className="text-xs text-green-600 font-medium">● Available</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-orange-50 transition-colors">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">SD</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Security Desk</p>
                    <p className="text-xs text-green-600 font-medium">● 24/7</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-orange-50 transition-colors">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">HT</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Help Desk</p>
                    <p className="text-xs text-green-600 font-medium">● Online</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">SETTINGS</p>
              <Button variant="ghost" className="w-full justify-start hover:bg-orange-50">
                <Settings className="w-4 h-4 mr-3" />
                Settings
              </Button>
              <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                <LogOut className="w-4 h-4 mr-3" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-8">
          {/* Hero Section */}
          <div className=" rounded-3xl p-6 lg:p-8 mb-8 text-black relative overflow-hidden shadow-xl" style={{
            background: 'linear-gradient(90deg, #F4ECE0 0%, #FFC39E 100%)'
          }}>
            <div className="relative z-10">
              <p className="text-gray-500 text-sm font-medium mb-2">RESIDENT DASHBOARD</p>
              <h1 className="text-2xl lg:text-4xl font-bold mb-2">Welcome back, Anushree!</h1>
              <h1 className="text-2xl lg:text-4xl font-bold mb-6">How can we help you today?</h1>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="bg-white text-orange-600 hover:bg-gray-100 font-semibold mx-auto px-2">
                  <Mic className="mr-2 w-4 h-4" />
                  Voice Assistant
                </Button>
                <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-white hover:text-orange-600 mx-auto px-2">
                  Report Issue
                </Button>
              </div>
            </div>
            <div className="absolute right-4 lg:right-8 top-1/2 transform -translate-y-1/2 opacity-20">
              <div className="w-24 h-24 lg:w-32 lg:h-32 border-2 border-white rounded-full"></div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                    </div>
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color.replace('text-', 'bg-')} bg-opacity-10`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                  <p className="text-xs text-green-600 font-medium mt-2">{stat.change}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Services */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {quickServices.map((service) => (
                  <Card key={service.id} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
                    <CardContent className="p-4 text-center">
                      <div className={`w-12 h-12 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                        <service.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm mb-1">{service.title}</h3>
                      <p className="text-xs text-gray-600">{service.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* My Issues */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold">My Issues</CardTitle>
                    <Button variant="outline" size="sm" className="text-orange-600 border-orange-200 hover:bg-orange-50">
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Report New
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {myIssues.map((issue) => (
                      <div key={issue.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            issue.status === 'Completed' ? 'bg-green-500' :
                            issue.status === 'In Progress' ? 'bg-orange-500' :
                            'bg-blue-500'
                          }`}>
                            {issue.status === 'Completed' ? (
                              <CheckCircle className="w-5 h-5 text-white" />
                            ) : issue.status === 'In Progress' ? (
                              <Clock className="w-5 h-5 text-white" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-white" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{issue.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                issue.priority === 'High' ? 'bg-red-100 text-red-700' :
                                issue.priority === 'Medium' ? 'bg-orange-100 text-orange-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                                {issue.priority}
                              </span>
                              <span className="text-xs text-gray-500">{issue.time}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-600 font-medium">{issue.status}</p>
                          <Button size="sm" variant="outline" className="mt-1">
                            <ArrowRight className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Profile Card */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-orange-800">My Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center shadow-lg">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-lg text-gray-900">Anushree</p>
                      <p className="text-sm text-gray-600">anushree@example.com</p>
                      <p className="text-xs text-orange-600 font-medium">Apartment 3B</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="text-orange-600 border-orange-200 hover:bg-orange-50">
                      <Settings className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button variant="outline" className="text-orange-600 border-orange-200 hover:bg-orange-50">
                      <Shield className="w-4 h-4 mr-2" />
                      Privacy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Voice Assistant */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <CardTitle className="text-base font-bold text-orange-800">Voice Assistant</CardTitle>
                  <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Mic className="w-8 h-8 text-white" />
                    </div>
                    <p className="font-semibold text-gray-900">Speak to Report</p>
                    <p className="text-xs text-gray-600">Use voice commands to report issues quickly</p>
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold">
                    <Mic className="mr-2 w-4 h-4" />
                    Tap to Speak
                  </Button>
                </CardContent>
              </Card>

              {/* Upcoming Events */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <CardTitle className="text-base font-bold">Upcoming Events</CardTitle>
                  <Button variant="ghost" size="sm">
                    <PlusCircle className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-center gap-3 p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:bg-orange-50 transition-colors">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                        <CalendarDays className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{event.title}</p>
                        <p className="text-xs text-gray-600">{event.date}</p>
                        <p className="text-xs text-gray-500">{event.location}</p>
                      </div>
                      <Button size="sm" variant="outline" className="text-xs">
                        Join
                      </Button>
                    </div>
                  ))}
                  
                  <Button variant="outline" className="w-full mt-4 text-orange-600 border-orange-200 hover:bg-orange-50">
                    View All Events
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <CardTitle className="text-base font-bold">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start text-orange-600 border-orange-200 hover:bg-orange-50">
                    <AlertCircle className="w-4 h-4 mr-3" />
                    Report Issue
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-orange-600 border-orange-200 hover:bg-orange-50">
                    <Wrench className="w-4 h-4 mr-3" />
                    Request Service
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-orange-600 border-orange-200 hover:bg-orange-50">
                    <MessageCircle className="w-4 h-4 mr-3" />
                    Contact Support
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-orange-600 border-orange-200 hover:bg-orange-50">
                    <FileText className="w-4 h-4 mr-3" />
                    View Documents
                  </Button>
                </CardContent>
              </Card>

              {/* Community Stats */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <CardTitle className="text-base font-bold">Community Stats</CardTitle>
                  <Button variant="ghost" size="sm">
                    <TrendingUp className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">🏠</span>
                    </div>
                    <p className="font-bold text-gray-900">Happy Resident!</p>
                    <p className="text-xs text-gray-600">You're part of an amazing community</p>
                  </div>
                  
                  {/* Chart Area */}
                  <div className="h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl mb-4 flex items-end justify-center gap-1 p-4">
                    <div className="w-4 bg-gradient-to-br from-green-200 to-green-300 rounded-t" style={{height: '60%'}}></div>
                    <div className="w-4 bg-gradient-to-br from-green-400 to-green-500 rounded-t" style={{height: '80%'}}></div>
                    <div className="w-4 bg-gradient-to-br from-green-600 to-green-700 rounded-t" style={{height: '40%'}}></div>
                    <div className="w-4 bg-gradient-to-br from-orange-400 to-orange-500 rounded-t" style={{height: '90%'}}></div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">4.8</p>
                    <p className="text-xs text-gray-600">Community Rating</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResidentDashboard;