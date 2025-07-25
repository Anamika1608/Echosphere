import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

const Login = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-50">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your email to log in to your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" placeholder="owner@example.com" required /></div>
            <div className="grid gap-2">
                <div className="flex items-center"><Label htmlFor="password">Password</Label>
                    <Link to="#" className="ml-auto inline-block text-sm underline text-slate-500">Forgot password?</Link>
                </div>
                <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full bg-[#FF4500] hover:bg-[#E03E00] text-white">Login</Button>
          </div>
          <div className="mt-4 text-center text-sm">Don't have an account? <Link to="/register" className="underline font-semibold">Sign up</Link></div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;