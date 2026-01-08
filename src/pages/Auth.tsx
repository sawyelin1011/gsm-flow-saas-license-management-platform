import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Loader2, Lock, Mail, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api, setAuthToken } from '@/lib/api-client';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { AuthResponse } from '@shared/types';
const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});
const signupSchema = loginSchema.extend({
  name: z.string().min(2, 'Name must be at least 2 characters')
});
export function Auth() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: 'admin@gsmflow.com', password: 'password123' }
  });
  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema)
  });
  const onLogin = async (data: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      const res = await api<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      setAuthToken(res.token);
      toast.success('Access granted');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };
  const onSignup = async (data: z.infer<typeof signupSchema>) => {
    setIsLoading(true);
    try {
      const res = await api<AuthResponse>('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      setAuthToken(res.token);
      toast.success('Account provisioned');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-primary-foreground shadow-glow mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black tracking-tight uppercase">Authority Node</h1>
          <p className="text-sm text-muted-foreground uppercase font-bold tracking-widest">Sovereign Licensing Access</p>
        </div>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login" className="text-[10px] font-black uppercase">Sign In</TabsTrigger>
            <TabsTrigger value="signup" className="text-[10px] font-black uppercase">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Card className="glass">
              <CardContent className="pt-6">
                <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground">Registry Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input {...loginForm.register('email')} className="pl-10 h-11" placeholder="admin@gsmflow.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground">Secret Key</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input {...loginForm.register('password')} type="password" className="pl-10 h-11" />
                    </div>
                  </div>
                  <Button type="submit" className="w-full btn-gradient h-12 font-black" disabled={isLoading}>
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Authorize Link"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="signup">
            <Card className="glass">
              <CardContent className="pt-6">
                <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground">Operator Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input {...signupForm.register('name')} className="pl-10 h-11" placeholder="Global Admin" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground">Registry Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input {...signupForm.register('email')} className="pl-10 h-11" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground">Secret Key</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input {...signupForm.register('password')} type="password" className="pl-10 h-11" />
                    </div>
                  </div>
                  <Button type="submit" className="w-full btn-gradient h-12 font-black" disabled={isLoading}>
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Provision Node"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}