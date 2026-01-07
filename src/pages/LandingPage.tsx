import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Zap,
  Globe,
  ArrowRight,
  CheckCircle2,
  Lock,
  Server,
  Code2,
  Cpu,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';
export function LandingPage() {
  const plans = [
    { id: 'basic', name: 'Node Starter', price: 29, features: ['1 Managed Node', 'Domain Binding', 'Standard Support', 'Real-time Validation'] },
    { id: 'pro', name: 'Cluster Pro', price: 89, features: ['10 Managed Nodes', 'Priority Support', 'Advanced Analytics', 'API Access', 'Global Edge Validation'] },
    { id: 'enterprise', name: 'Carrier Enterprise', price: 299, features: ['Unlimited Nodes', '24/7 Dedicated Support', 'SLA Guarantee', 'Custom Integrations', 'White-labeling'] }
  ];
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <ThemeToggle />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="py-24 md:py-40 text-center space-y-8 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black border border-primary/20 tracking-[0.2em] uppercase"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>The Ultimate Licensing Authority for GSM Systems</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]"
          >
            Secure Your <br />
            <span className="text-gradient">GSM Clusters</span>
          </motion.h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
            Deploy self-hosted GSM service systems with absolute authority. Issue cryptographically signed license keys and verify node integrity globally in milliseconds.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Button size="lg" className="btn-gradient rounded-full px-10 h-14 text-lg font-black shadow-glow" asChild>
              <Link to="/login">Start Issuing <ArrowRight className="ml-2 w-5 h-5" /></Link>
            </Button>
            <Button variant="outline" size="lg" className="rounded-full px-10 h-14 text-lg font-bold" asChild>
              <Link to="/docs">Protocol Docs</Link>
            </Button>
          </div>
        </section>
        {/* Features Section */}
        <section className="py-24 border-t border-border/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard 
              icon={<Lock className="w-8 h-8" />}
              title="Cryptographic Keys"
              description="Signed license keys that bind installations to specific hardware or domains."
            />
            <FeatureCard 
              icon={<Globe className="w-8 h-8" />}
              title="Domain Binding"
              description="Strict target verification prevents unauthorized node replication or domain spoofing."
            />
            <FeatureCard 
              icon={<Zap className="w-8 h-8" />}
              title="Edge Validation"
              description="Cloudflare Worker backed API ensures <50ms validation latency worldwide."
            />
          </div>
        </section>
        {/* Workflow Section */}
        <section className="py-24 bg-muted/30 rounded-[3rem] p-12 mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">How it Works</h2>
            <p className="text-muted-foreground">Three steps to global service authority.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center mx-auto text-2xl font-black">1</div>
              <h3 className="font-bold text-lg uppercase tracking-tight">Connect Node</h3>
              <p className="text-sm text-muted-foreground">Register your self-hosted GSM cluster in our registry with its target domain.</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center mx-auto text-2xl font-black">2</div>
              <h3 className="font-bold text-lg uppercase tracking-tight">Issue Key</h3>
              <p className="text-sm text-muted-foreground">System generates a unique, cryptographically signed license key for that specific node.</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center mx-auto text-2xl font-black">3</div>
              <h3 className="font-bold text-lg uppercase tracking-tight">Global Validation</h3>
              <p className="text-sm text-muted-foreground">Your nodes poll our edge API to verify validity and subscription status in real-time.</p>
            </div>
          </div>
        </section>
        {/* Pricing Section */}
        <section className="py-24">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div key={plan.id} className={cn(
                "p-8 rounded-3xl border transition-all duration-500 flex flex-col justify-between",
                plan.id === 'pro' ? "border-primary shadow-glow scale-105 bg-card" : "border-border bg-card/50"
              )}>
                <div>
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
                </div>
                <Button className={cn("w-full h-12 font-bold rounded-xl", plan.id === 'pro' ? 'btn-gradient' : '')} variant={plan.id === 'pro' ? 'default' : 'outline'} asChild>
                  <Link to="/login">Select Plan</Link>
                </Button>
              </div>
            ))}
          </div>
        </section>
        <footer className="py-12 text-center text-muted-foreground text-xs font-bold uppercase tracking-widest border-t border-border/50">
          © {new Date().getFullYear()} GSM Flow Licensing Authority · All Rights Reserved.
        </footer>
      </div>
    </div>
  );
}
function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="space-y-4 group">
      <div className="text-primary group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <h3 className="text-2xl font-black tracking-tighter uppercase">{title}</h3>
      <p className="text-muted-foreground leading-relaxed font-medium">{description}</p>
    </div>
  );
}