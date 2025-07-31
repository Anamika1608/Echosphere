import React from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { 
  ListChecks, 
  Megaphone, 
  PlusCircle, 
  Mic, 
  User, 
  Settings, 
  Wrench, 
  Phone,
  Heart,
  ArrowRight,
  MoreHorizontal,
  Search,
  Bell,
  Mail,
  TrendingUp,
  Users,
  AlertCircle,
  Calendar,
  Star,
  BarChart3,
  Shield,
  Home,
  LogOut
} from 'lucide-react';

// Mock data
const technicians = [
  { id: 1, name: 'Ravi Kumar', specialty: 'Plumbing Specialist', category: 'MAINTENANCE', image: '👨‍🔧', status: 'Available', rating: 4.8 },
  { id: 2, name: 'Sunita Sharma', specialty: 'Electrical Expert', category: 'ELECTRICAL', image: '👩‍🔧', status: 'Busy', rating: 4.9 },
  { id: 3, name: 'Anil Singh', specialty: 'HVAC Technician', category: 'HVAC', image: '👨‍🔧', status: 'Available', rating: 4.7 },
];

const recentIssues = [
  { id: 1, title: 'Water Leak in Apartment 3B', priority: 'High', status: 'In Progress', time: '2 hours ago' },
  { id: 2, title: 'Electrical Issue in Common Area', priority: 'Critical', status: 'Assigned', time: '4 hours ago' },
  { id: 3, title: 'AC Not Working - Unit 5A', priority: 'Medium', status: 'Pending', time: '6 hours ago' },
];

const stats = [
  { label: 'Total Residents', value: '156', icon: Users, change: '+12%', color: 'text-blue-600' },
  { label: 'Active Issues', value: '8', icon: AlertCircle, change: '-3%', color: 'text-orange-600' },
  { label: 'Satisfaction Rate', value: '94%', icon: Star, change: '+2%', color: 'text-green-600' },
  { label: 'Monthly Revenue', value: '$12.5K', icon: TrendingUp, change: '+8%', color: 'text-purple-600' },
];

const OwnerDashboard = () => {
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
                <span className="text-white font-semibold text-sm">JR</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-gray-900">Jason Ranti</p>
                <p className="text-xs text-gray-500">Property Manager</p>
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
                  <Mail className="w-4 h-4 mr-3" />
                  Inbox
                </Button>
                <Button variant="ghost" className="w-full justify-start hover:bg-orange-50">
                  <Users className="w-4 h-4 mr-3" />
                  Residents
                </Button>
                <Button variant="ghost" className="w-full justify-start hover:bg-orange-50">
                  <Wrench className="w-4 h-4 mr-3" />
                  Maintenance
                </Button>
                <Button variant="ghost" className="w-full justify-start hover:bg-orange-50">
                  <BarChart3 className="w-4 h-4 mr-3" />
                  Analytics
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">STAFF</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-orange-50 transition-colors">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">BM</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Building Manager</p>
                    <p className="text-xs text-green-600 font-medium">● Active</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-orange-50 transition-colors">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">SD</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Security Desk</p>
                    <p className="text-xs text-green-600 font-medium">● On Duty</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-orange-50 transition-colors">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">JT</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Janitorial Team</p>
                    <p className="text-xs text-green-600 font-medium">● Available</p>
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
          <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-3xl p-6 lg:p-8 mb-8 text-white relative overflow-hidden shadow-xl">
            <div className="relative z-10">
              <p className="text-orange-100 text-sm font-medium mb-2">OWNER DASHBOARD</p>
              <h1 className="text-2xl lg:text-4xl font-bold mb-2">Manage Your Community with</h1>
              <h1 className="text-2xl lg:text-4xl font-bold mb-6">AI-Powered Solutions</h1>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="bg-white text-orange-600 hover:bg-gray-100 font-semibold">
                  <Mic className="mr-2 w-4 h-4" />
                  Voice Assistant
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600">
                  View Analytics
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
                  <p className="text-xs text-green-600 font-medium mt-2">{stat.change} from last month</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
                  <div className="absolute top-4 right-4">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  </div>
                  <CardHeader className="pb-2">
                    <p className="text-xs text-blue-600 font-medium">2/8 watched</p>
                    <CardTitle className="text-sm font-semibold">PROPERTY MGMT</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-bold text-gray-900 mb-2">Building Maintenance</h3>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                      Manage
                    </Button>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-pink-50 to-pink-100">
                  <div className="absolute top-4 right-4">
                    <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse"></div>
                  </div>
                  <CardHeader className="pb-2">
                    <p className="text-xs text-pink-600 font-medium">3/8 watched</p>
                    <CardTitle className="text-sm font-semibold">COMMUNITY</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-bold text-gray-900 mb-2">Event Planning</h3>
                    <Button size="sm" className="bg-pink-600 hover:bg-pink-700 text-white">
                      Plan Event
                    </Button>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-teal-50 to-teal-100">
                  <div className="absolute top-4 right-4">
                    <div className="w-3 h-3 bg-teal-500 rounded-full animate-pulse"></div>
                  </div>
                  <CardHeader className="pb-2">
                    <p className="text-xs text-teal-600 font-medium">6/12 watched</p>
                    <CardTitle className="text-sm font-semibold">RESIDENT SERVICES</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-bold text-gray-900 mb-2">Support Desk</h3>
                    <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white">
                      View Issues
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Issues */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold">Recent Issues</CardTitle>
                    <Button variant="outline" size="sm" className="text-orange-600 border-orange-200 hover:bg-orange-50">
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentIssues.map((issue) => (
                      <div key={issue.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center">
                            <AlertCircle className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{issue.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                issue.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                                issue.priority === 'High' ? 'bg-orange-100 text-orange-700' :
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

              {/* Technician Management */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold">Your Technicians</CardTitle>
                    <Button variant="outline" size="sm" className="text-orange-600 border-orange-200 hover:bg-orange-50">
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Add New
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {technicians.map((tech) => (
                      <Card key={tech.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-gray-50 to-white">
                        <div className="relative">
                          <div className="aspect-square bg-gradient-to-br from-orange-100 to-red-100 rounded-t-xl flex items-center justify-center text-4xl">
                            {tech.image}
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white"
                          >
                            <Heart className="w-4 h-4" />
                          </Button>
                        </div>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <p className="text-xs text-orange-600 font-semibold">{tech.category}</p>
                              <h3 className="font-bold text-gray-900 text-sm">{tech.name}</h3>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                              <span className="text-xs font-medium">{tech.rating}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <div className={`w-2 h-2 rounded-full ${
                                tech.status === 'Available' ? 'bg-green-500' : 'bg-orange-500'
                              }`}></div>
                              <span>{tech.status}</span>
                            </div>
                            <Button size="sm" variant="outline" className="text-xs">
                              Contact
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* AI Assistant */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <CardTitle className="text-base font-bold text-orange-800">AI Assistant</CardTitle>
                  <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Mic className="w-8 h-8 text-white" />
                    </div>
                    <p className="font-semibold text-gray-900">Voice Commands</p>
                    <p className="text-xs text-gray-600">Ask for reports, assign tasks, or get insights</p>
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold">
                    <Mic className="mr-2 w-4 h-4" />
                    Start Voice Assistant
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <CardTitle className="text-base font-bold">Quick Stats</CardTitle>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">👋</span>
                    </div>
                    <p className="font-bold text-gray-900">Good Morning Jason 🔥</p>
                    <p className="text-xs text-gray-600">Continue your journey to amazing your residents</p>
                  </div>
                  
                  {/* Chart Area */}
                  <div className="h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl mb-4 flex items-end justify-center gap-2 p-4">
                    <div className="w-8 bg-gradient-to-br from-orange-200 to-orange-300 rounded-t" style={{height: '40%'}}></div>
                    <div className="w-8 bg-gradient-to-br from-orange-400 to-orange-500 rounded-t" style={{height: '60%'}}></div>
                    <div className="w-8 bg-gradient-to-br from-orange-600 to-red-600 rounded-t" style={{height: '80%'}}></div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">94%</p>
                    <p className="text-xs text-gray-600">Resident Satisfaction</p>
                  </div>
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
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Community Meeting</p>
                      <p className="text-xs text-gray-600">Tomorrow, 2:00 PM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Maintenance Day</p>
                      <p className="text-xs text-gray-600">Friday, 9:00 AM</p>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full mt-4 text-orange-600 border-orange-200 hover:bg-orange-50">
                    View Calendar
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;