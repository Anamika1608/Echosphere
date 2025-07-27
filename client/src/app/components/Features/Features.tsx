import { Card, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Mic, LayoutDashboard, Lightbulb, Bell } from 'lucide-react';

const freeTierFeatures = [
  { icon: Mic, title: "Voice Complaint Raising", description: "Instantly create tickets by simply speaking your issue." },
  { icon: LayoutDashboard, title: "Unified Dashboard", description: "Track issue statuses and community updates in one place." },
  { icon: Lightbulb, title: "AI Event Suggestions", description: "Get smart, data-driven ideas for engaging community events." },
  { icon: Bell, title: "Admin Auto-Alerts", description: "Never miss a high-priority issue with instant notifications." }
];

const Features: React.FC = () => {
  return (
    <section id="features" className="container mx-auto px-8 py-16 sm:py-24">
      <div className="text-center mb-12">
        <span className="text-sm font-semibold text-[#FF4500]">FREE-TIER FEATURES</span>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mt-2">All The Essentials, For Free</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {freeTierFeatures.map(({ icon: Icon, title, description }, index) => (
          <Card
            key={index}
            className="text-center border-transparent hover:border-[#FF4500] hover:shadow-xl transition-all duration-300 py-4 min-h-[200px]"
            style={{
              backgroundImage: 'linear-gradient(180deg, #FFF 3.84%, #FFF3EE 51.8%, #FFD3C3 99.77%)',
              backgroundColor: '#fff',
            }}
          >
            <CardHeader>
              <div className="mx-auto w-fit bg-orange-100 p-4 rounded-full mb-4">
                <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-[#FF4500]" />
              </div>
              <CardTitle className="text-gray-800 text-lg font-semibold">{title}</CardTitle>
              <CardDescription className="mt-2 text-gray-600 text-sm">{description}</CardDescription>
            </CardHeader>
          </Card>

        ))}
      </div>
    </section>
  );
}
export default Features;