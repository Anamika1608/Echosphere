import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { toast } from 'sonner'; 
const Register = () => {
  const navigate = useNavigate();

  const [userType, setUserType] = useState<'resident' | 'owner'>('resident');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log(`Simulating registration for user type: ${userType}`);

    toast({
      title: 'Account Created Successfully!',
      description: `We are redirecting you to your ${userType} dashboard.`,
    });

    setTimeout(() => {
      navigate(userType === 'owner' ? '/dashboard/owner' : '/dashboard/resident');
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-50">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Create an Account</CardTitle>
          <CardDescription>Choose your role and enter your details to join.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid gap-3">
              <Label>I am signing up as a...</Label>
              <RadioGroup
                defaultValue="resident"
                value={userType}
                onValueChange={(value: 'resident' | 'owner') => setUserType(value)}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <RadioGroupItem value="resident" id="resident" className="peer sr-only" />
                  <Label
                    htmlFor="resident"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    Resident
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="owner" id="owner" className="peer sr-only" />
                  <Label
                    htmlFor="owner"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    Owner
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="full-name">Full Name</Label>
              <Input id="full-name" placeholder="Anamika Aggarwal" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="me@example.com" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>

            <Button type="submit" className="w-full bg-[#FF4500] hover:bg-[#E03E00] text-white">
              Create Account
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link to="/login" className="underline font-semibold">Login</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
