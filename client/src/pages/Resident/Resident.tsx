import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { PlusCircle, History, CalendarDays, Mic, User, Settings } from 'lucide-react';
import userStore from '@/store/userStore';

const Resident = () => {
  const {auth} = userStore()
  
  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{`Welcome, ${auth.user.name}`}</h1>
        <p className="text-slate-500">Here's a look at your community.</p>
      </header>

      <main className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* --- NEW PROFILE CARD --- */}
        <Card className="sm:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              My Profile
              <User className="h-5 w-5 text-slate-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
                <User className="h-8 w-8 text-[#FF4500]" />
              </div>
              <div>
                <p className="font-bold text-lg">{`${auth.user.name}`}</p>
                <p className="text-sm text-muted-foreground">{`${auth.user.email}`}</p>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-6">
              <Settings className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        {/* --- Existing AI Assistant Card --- */}
        <Card className="sm:col-span-2 lg:col-span-2 bg-orange-50 border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Mic/>Voice Assistant
            </CardTitle>
            <CardDescription>Speak to raise a new issue or check an existing one.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="bg-[#FF4500] hover:bg-[#E03E00] text-white">
              <Mic className="mr-2 h-4 w-4"/>Tap to Speak
            </Button>
          </CardContent>
        </Card>
        
        {/* --- Other existing cards --- */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">Raise New Issue <PlusCircle className="text-slate-400"/></CardTitle>
          </CardHeader>
          <CardContent><Button variant="outline" className="w-full">Create a Ticket</Button></CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">See Issue Status <History className="text-slate-400"/></CardTitle>
            <CardDescription><strong>1 issue</strong> is in progress.</CardDescription>
          </CardHeader>
          <CardContent><Button variant="outline" className="w-full">View All Tickets</Button></CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">Upcoming Events <CalendarDays className="text-slate-400"/></CardTitle>
            <CardDescription>Diwali celebration next weekend!</CardDescription>
          </CardHeader>
          <CardContent><Button variant="outline" className="w-full">View Calendar</Button></CardContent>
        </Card>
      </main>
    </div>
  );
}

export default Resident;