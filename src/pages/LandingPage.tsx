import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Zap,
  Globe,
  ArrowRight,
  CheckCircle2,
  Lock,
  LayoutDashboard,
  RefreshCw,
  Server,
  Code2,
  Database,
  Briefcase,
  Users,
  Target,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { LandingNavbar } from '@/components/LandingNavbar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';
export function LandingPage() {
  useEffect(() => {
    document.title = "GSM Flow - Sovereign Unlocking Platforms";
  }, []);
  const plans = [
    {
      id: 'launch',
      name: 'Launch Plan',
      price: 49,
      features: ['1 Sovereign Platform', 'Custom Domain Branding', 'Basic Support', 'Edge API Gateway']
    },
    {
      id: 'growth',
      name: 'Growth Plan',
      price: 149,
      features: ['10 Platform Nodes', 'Priority Support', 'Advanced Analytics', 'Zero Transaction Fees']
    },
    {
      id: 'agency',
      name: 'Agency Plan',
      price: 499,
      features: ['100 Platform Nodes', 'White-label Portal', '24/7 Dedicated Support', 'SLA Guarantee']
    }
  ];
  return (
    <div className="min-h-screen bg-background text-foreground bg-motion-lines">
      <LandingNavbar />
      <ThemeToggle />
      {/* Hero Section */}
      <section className="pt-40 pb-24 md:pt-56 md:pb-40 text-center relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black border border-primary/20 tracking-[0.2em] uppercase"
          >
            <Target className="w-3.5 h-3.5" />
            <span>Own Your Unlocking Authority</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[1.1] max-w-4xl mx-auto uppercase"
          >
            Sovereign <span className="text-gradient">GSM Service</span> <br />
            Platforms for Modern Operators
          </motion.h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
            Stop paying fees to marketplaces. Build your own branded unlocking ecosystem. Issue licenses, provision service nodes, and scale your GSM agency with total commercial sovereignty.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
            <Button size="lg" className="btn-gradient rounded-full px-10 h-14 text-sm font-black shadow-glow" onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}>
              View Pricing <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg" className="rounded-full px-10 h-14 text-sm font-bold bg-background/50 backdrop-blur" asChild>
              <Link to="/login">Client Portal Login</Link>
            </Button>
          </div>
        </div>
      </section>
      {/* What & How Section */}
      <section id="what" className="py-24 bg-muted/20 border-y border-border/50 bg-grid-cyan">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-black tracking-tight uppercase">Sovereignty is the Strategy</h2>
            <p className="text-muted-foreground font-medium text-lg leading-relaxed">
              GSM Flow isn't just a license tool; it's the commercial engine for your unlocking empire. We provide the layer that turns your hardware capabilities into a scalable software subscription business.
            </p>
            <ul className="space-y-4">
              <li className="flex gap-4 items-start">
                <div className="p-1 rounded bg-primary/10 text-primary mt-1"><CheckCircle2 className="w-4 h-4" /></div>
                <div className="text-sm font-bold uppercase tracking-tight">Full Branding Control — Your Domain, Your Brand.</div>
              </li>
              <li className="flex gap-4 items-start">
                <div className="p-1 rounded bg-primary/10 text-primary mt-1"><CheckCircle2 className="w-4 h-4" /></div>
                <div className="text-sm font-bold uppercase tracking-tight">Zero Marketplace Fees — Keep 100% of your revenue.</div>
              </li>
              <li className="flex gap-4 items-start">
                <div className="p-1 rounded bg-primary/10 text-primary mt-1"><CheckCircle2 className="w-4 h-4" /></div>
                <div className="text-sm font-bold uppercase tracking-tight">Global Node Latency — Real-time validation everywhere.</div>
              </li>
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-8 rounded-[2rem] bg-card border border-border/50 shadow-soft space-y-4">
              <Zap className="w-10 h-10 text-primary" />
              <h3 className="font-black text-xs uppercase">Provision</h3>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Deploy service nodes instantly.</p>
            </div>
            <div className="p-8 rounded-[2rem] bg-primary text-primary-foreground shadow-glow space-y-4 translate-y-8">
              <Lock className="w-10 h-10" />
              <h3 className="font-black text-xs uppercase">Sign</h3>
              <p className="text-[10px] opacity-80 font-medium uppercase tracking-widest">Cryptographic license generation.</p>
            </div>
          </div>
        </div>
      </section>
      {/* Capabilities Section */}
      <section id="capabilities" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-black tracking-tighter uppercase">Platform Capabilities</h2>
            <p className="text-muted-foreground uppercase text-xs font-bold tracking-[0.2em]">The tech stack behind your GSM authority.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <CapabilityItem icon={<Database />} title="Centralized Registry" desc="Manage every active cluster and installation from a single sovereign dashboard." />
            <CapabilityItem icon={<ShieldCheck />} title="Signed Authority" desc="Every license is cryptographically signed using HMAC-SHA256 protocols." />
            <CapabilityItem icon={<Globe />} title="Edge Validation" desc="Validation responses in <30ms via our globally distributed authority nodes." />
            <CapabilityItem icon={<Briefcase />} title="Billing Automation" desc="Automate invoice generation and subscription tiers for your service clients." />
            <CapabilityItem icon={<LayoutDashboard />} title="Operator Portal" desc="Grant your agents access to a white-labeled platform for node management." />
            <CapabilityItem icon={<RefreshCw />} title="Remote Sync" desc="Push critical protocol updates to all service nodes with zero downtime." />
          </div>
        </div>
      </section>
      {/* Who Section */}
      <section id="who" className="py-24 bg-muted/10 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-12 text-center">
          <WhoItem icon={<Users />} label="Individual Operators" desc="Solo pros looking to brand their specialized unlocking services." />
          <WhoItem icon={<Briefcase />} label="Service Agencies" desc="Growing teams managing multiple service nodes and resellers." />
          <WhoItem icon={<BarChart3 />} label="Wholesale Providers" desc="Large-scale clusters requiring high-throughput licensing authority." />
        </div>
      </section>
      {/* Comparison Section */}
      <section id="comparison" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black uppercase tracking-tight">Marketplace vs. Authority</h2>
          </div>
          <div className="overflow-hidden rounded-[2rem] border border-border/50 shadow-soft">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-muted/50 border-b border-border/50">
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest">Feature</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Traditional Marketplaces</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-primary">GSM Flow Authority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                <ComparisonRow feature="Transaction Fees" old="10% - 20%" current="0% (You keep it all)" />
                <ComparisonRow feature="Branding" old="Generic Profile" current="Full Custom Domain" />
                <ComparisonRow feature="Data Access" old="Restricted / Owned by Marketplace" current="100% Sovereignty" />
                <ComparisonRow feature="Scalability" old="Linear Fee Growth" current="Fixed Plan Predictability" />
              </tbody>
            </table>
          </div>
        </div>
      </section>
      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-grid-cyan">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black tracking-tighter mb-4 uppercase">Select Your Tier</h2>
            <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Scale your GSM empire on your terms</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <div key={plan.id} className={cn(
                "p-10 rounded-[2.5rem] border transition-all duration-500 flex flex-col justify-between group",
                plan.id === 'growth' ? "border-primary shadow-glow scale-105 bg-card z-10" : "border-border bg-card/80 backdrop-blur"
              )}>
                <div>
                  <h3 className="text-xl font-bold mb-1 uppercase tracking-tight">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-5xl font-black text-primary">${plan.price}</span>
                    <span className="text-muted-foreground text-xs font-bold uppercase tracking-widest">/mo</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 text-xs font-bold uppercase tracking-tighter">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button className={cn("w-full h-14 font-black rounded-2xl text-[10px] uppercase tracking-widest", plan.id === 'growth' ? 'btn-gradient' : 'bg-muted hover:bg-muted/80')} asChild>
                  <Link to="/login">Activate {plan.name.split(' ')[0]}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Final CTA Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-primary rounded-[3rem] p-12 md:p-24 text-center text-primary-foreground relative overflow-hidden shadow-glow">
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">Ready to Take Authority?</h2>
            <p className="text-lg font-medium opacity-90 max-w-xl mx-auto">Join the new era of sovereign GSM operators. Move off the marketplaces and onto your own platform today.</p>
            <Button size="lg" variant="secondary" className="rounded-full px-12 h-16 text-lg font-black text-primary shadow-xl hover:scale-105 transition-transform" asChild>
              <Link to="/login">Start Now</Link>
            </Button>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>
      </section>
      <footer className="py-24 border-t border-border/50 bg-muted/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-12">
          <div className="col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-primary" />
              <span className="text-sm font-black uppercase tracking-widest">GSM FLOW</span>
            </div>
            <p className="text-xs text-muted-foreground font-medium max-w-sm leading-relaxed uppercase tracking-widest">
              The premier commercial authority for sovereign GSM service platforms.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Platform</h4>
            <ul className="space-y-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <li><Link to="/docs" className="hover:text-primary transition-colors">API Docs</Link></li>
              <li><button onClick={() => document.getElementById('capabilities')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-primary transition-colors">Capabilities</button></li>
              <li><button onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-primary transition-colors">Pricing</button></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Company</h4>
            <ul className="space-y-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Support</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 pt-8 border-t border-border/30 text-center text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/50">
          © {new Date().getFullYear()} GSM Flow Authority. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
function CapabilityItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-8 rounded-[2rem] border border-border/50 bg-card hover:border-primary/50 transition-all group shadow-sm">
      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-sm font-black uppercase mb-2 tracking-tight">{title}</h3>
      <p className="text-[10px] text-muted-foreground font-medium uppercase leading-relaxed tracking-widest opacity-70">{desc}</p>
    </div>
  );
}
function WhoItem({ icon, label, desc }: { icon: React.ReactNode, label: string, desc: string }) {
  return (
    <div className="space-y-4">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto text-primary">{icon}</div>
      <h3 className="font-black text-xs uppercase tracking-widest">{label}</h3>
      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest leading-relaxed max-w-[200px] mx-auto opacity-70">{desc}</p>
    </div>
  );
}
function ComparisonRow({ feature, old, current }: { feature: string, old: string, current: string }) {
  return (
    <tr>
      <td className="p-6 text-[10px] font-black uppercase tracking-widest">{feature}</td>
      <td className="p-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 line-through decoration-rose-500/50">{old}</td>
      <td className="p-6 text-[10px] font-black uppercase tracking-widest text-primary">{current}</td>
    </tr>
  );
}