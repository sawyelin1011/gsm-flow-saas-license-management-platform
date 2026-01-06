import React from 'react';
import { motion } from 'framer-motion';
import { 
  Rocket, 
  Layers, 
  Shield, 
  Cpu, 
  ArrowRight, 
  CheckCircle2, 
  Code2, 
  Zap,
  Layout,
  MousePointer2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { MOCK_PLANS } from '@shared/mock-data';
import { cn } from '@/lib/utils';
export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <ThemeToggle />
      {/* Hero Section */}
      <section className="relative py-24 md:py-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-rainbow opacity-10 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20 tracking-widest uppercase"
          >
            <Rocket className="w-4 h-4" />
            <span>V2 Fullstack SaaS Engine</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-display font-black tracking-tighter leading-[0.9]"
          >
            Ship Faster With <br />
            <span className="text-gradient">Pure Precision</span>
          </motion.h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
            The ultimate multipurpose boilerplate built for Cloudflare Workers, React 18, and Tailwind. 
            Production-ready, highly typed, and styled with perfection.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Button size="lg" className="btn-gradient rounded-full px-10 h-14 text-lg font-black shadow-glow" asChild>
              <Link to="/login">Start Building <ArrowRight className="ml-2 w-5 h-5" /></Link>
            </Button>
            <Button variant="outline" size="lg" className="rounded-full px-10 h-14 text-lg border-primary/20 hover:bg-primary/5 font-bold" asChild>
              <a href="https://github.com">Explore Source</a>
            </Button>
          </div>
        </div>
      </section>
      {/* Component Showcase Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center space-y-4">
            <h2 className="text-4xl font-black tracking-tight">UI Component Library</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Pre-integrated Shadcn UI components with custom cyan aesthetics and responsive defaults.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="glass group hover:border-primary/50 transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layout className="w-5 h-5 text-primary" />
                  Interactive Layouts
                </CardTitle>
                <CardDescription>Responsive sidebars and navigation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Badge variant="default" className="bg-primary shadow-glow">Active</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                </div>
                <Progress value={65} className="h-2" />
                <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase">
                  <span>Storage Usage</span>
                  <span>65%</span>
                </div>
              </CardContent>
            </Card>
            <Card className="glass group hover:border-primary/50 transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MousePointer2 className="w-5 h-5 text-primary" />
                  Action Elements
                </CardTitle>
                <CardDescription>Buttons, inputs and forms</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full btn-gradient h-10 font-bold">Primary Action</Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="h-8">Cancel</Button>
                  <Button variant="secondary" size="sm" className="h-8">Review</Button>
                </div>
              </CardContent>
            </Card>
            <Card className="glass group hover:border-primary/50 transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-primary" />
                  Technical Stack
                </CardTitle>
                <CardDescription>Cloudflare Workers & DOs</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Durable Object Storage</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Hono.js API Layer</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> React Query Data Flow</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/* Pricing Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Scalable Tiers</h2>
            <p className="text-muted-foreground">Generic subscription models for any SaaS use case.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {MOCK_PLANS.map((plan) => (
              <div 
                key={plan.id} 
                className={cn(
                  "p-8 rounded-3xl border bg-card transition-all duration-500",
                  plan.id === 'pro' ? "border-primary shadow-glow scale-105" : "border-border"
                )}
              >
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-black text-primary">${plan.price}</span>
                  <span className="text-muted-foreground text-sm">/mo</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm font-medium">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button className={cn("w-full h-12 font-bold rounded-xl", plan.id === 'pro' ? 'btn-gradient' : '')} variant={plan.id === 'pro' ? 'default' : 'outline'} asChild>
                  <Link to="/login">Get Started</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
      <footer className="py-12 border-t border-border/50 bg-muted/5 text-center text-muted-foreground text-xs font-bold uppercase tracking-widest">
        © {new Date().getFullYear()} Multipurpose SaaS Boilerplate · Build Better.
      </footer>
    </div>
  );
}