import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
export function Auth() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 1200);
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground shadow-glow floating">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-display font-bold tracking-tight">Access Portal</h1>
            <p className="text-muted-foreground">Authenticate to manage your license authority</p>
          </div>
        </div>
        <Card className="border-border/50 shadow-xl overflow-hidden glass">
          <CardHeader className="space-y-1 bg-muted/5 border-b border-border/50">
            <CardTitle className="text-2xl">Sign in</CardTitle>
            <CardDescription>
              Secure credentials required for dashboard access
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="admin@gsmflow.com" 
                  defaultValue="admin@gsmflow.com" 
                  className="bg-background/50 border-border/50 focus:ring-primary h-11"
                  required 
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Secret Key</Label>
                  <Button variant="link" className="px-0 h-auto text-xs text-primary font-bold">Recovery?</Button>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  defaultValue="password123" 
                  className="bg-background/50 border-border/50 focus:ring-primary h-11"
                  required 
                />
              </div>
              <Button type="submit" className="w-full btn-gradient h-12 font-bold shadow-glow" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <>Continue <ArrowRight className="ml-2 w-5 h-5" /></>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground bg-muted/5 border-t border-border/50 py-4">
            New operator?
            <Button variant="link" className="p-0 h-auto text-primary font-bold">Request Access</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}