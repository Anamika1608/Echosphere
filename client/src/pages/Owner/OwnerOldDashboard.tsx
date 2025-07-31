import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { ListChecks, Megaphone, PlusCircle, Mic, User, Settings, Wrench, Mail, Phone, LogOut } from 'lucide-react';
import axios from 'axios';
import { useEffect } from 'react';
import { serverUrl } from '@/utils';
import { useNavigate } from 'react-router-dom';

import userStore from '@/store/userStore';
import { handleUserLogout } from '@/services/authService';


// Mock data for technicians - in a real app, this would come from an API
const technicians = [
  { id: 1, name: 'Ravi Kumar', specialty: 'Plumbing & Waterworks', phone: '+91 98765 43210' },
  { id: 2, name: 'Sunita Sharma', specialty: 'Electrical & Appliances', phone: '+91 98765 43211' },
  { id: 3, name: 'Anil Singh', specialty: 'HVAC & AC Repair', phone: '+91 98765 43212' },
  { id: 4, name: 'Priya Mehta', specialty: 'General Maintenance', phone: '+91 98765 43213' },
];

const OwnerOldDashboard = () => {

  const { user } = userStore()
  const navigate = useNavigate()

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Owner Dashboard</h1>
          <p className="text-slate-500">Manage your community, effortlessly.</p>
        </div>
        <button onClick={() => handleUserLogout(navigate)}>
          <LogOut />
        </button>
      </header>

      <main className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {/* --- NEW OWNER PROFILE CARD --- */}
        <Card className="md:col-span-1 xl:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Owner Profile <User className="h-5 w-5 text-slate-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 flex items-center justify-center">
                <img src={user.profilePicture ?? undefined} alt='user-profile' className='rounded-md' />
              </div>
              <div>
                <p className="font-bold text-lg">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-6"><Settings className="mr-2 h-4 w-4" />Edit Profile</Button>
          </CardContent>
        </Card>

        {/* --- AI Assistant Card (Adjusted to fit layout) --- */}
        <Card className="md:col-span-1 xl:col-span-3 bg-orange-50 border-orange-200">
          <CardHeader><CardTitle className="flex items-center gap-2 text-orange-800"><Mic />AI Assistant</CardTitle><CardDescription>Your command center. Ask for event ideas, issue summaries, and more.</CardDescription></CardHeader>
          <CardContent><Button className="bg-[#FF4500] hover:bg-[#E03E00] text-white"><Mic className="mr-2 h-4 w-4" />Use AI Command</Button></CardContent>
        </Card>

        {/* --- NEW TECHNICIAN LIST --- */}
        <Card className="md:col-span-2 xl:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" /> Technician List
            </CardTitle>
            <CardDescription>Your registered maintenance staff and their contact information.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {technicians.map((tech) => (
                <div key={tech.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-lg border hover:bg-slate-50">
                  <div className="flex items-center gap-4 mb-2 sm:mb-0">
                    <div className="p-3 bg-slate-100 rounded-full"><Wrench className="w-5 h-5 text-slate-600" /></div>
                    <div>
                      <p className="font-semibold">{tech.name}</p>
                      <p className="text-sm text-muted-foreground">{tech.specialty}</p>
                    </div>
                  </div>
                  <a href={`tel:${tech.phone}`} className="flex items-center gap-2 text-sm text-primary font-medium hover:underline pl-14 sm:pl-0">
                    <Phone className="w-4 h-4" /> {tech.phone}
                  </a>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* --- Existing Cards --- */}
        <Card><CardHeader><CardTitle className="flex items-center justify-between">Review Issues<ListChecks className="text-slate-400" /></CardTitle><CardDescription>3 new issues to approve.</CardDescription></CardHeader><CardContent><Button variant="outline" className="w-full">Review Now</Button></CardContent></Card>
        <Card><CardHeader><CardTitle className="flex items-center justify-between">Broadcast Message<Megaphone className="text-slate-400" /></CardTitle><CardDescription>Send announcements.</CardDescription></CardHeader><CardContent><Button variant="outline" className="w-full">Broadcast</Button></CardContent></Card>
        <Card><CardHeader><CardTitle className="flex items-center justify-between">Add New Event <PlusCircle className="text-slate-400" /></CardTitle><CardDescription>Plan a community gathering.</CardDescription></CardHeader><CardContent><Button variant="outline" className="w-full">Create Event</Button></CardContent></Card>
      </main>
    </div>
  );
}

export default OwnerOldDashboard;