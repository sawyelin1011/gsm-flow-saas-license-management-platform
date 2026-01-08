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
  Database,
  Briefcase,
  Users,
  Target,
  BarChart3,
  Cpu,
  Layers
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
    <div className="min-h-screen bg-background text-foreground bg-motion-lines relative">
      <LandingNavbar />
      <ThemeToggle />
      {/* Hero Section */}
      <section className="pt-48 pb-24 md:pt-64 md:pb-40 text-center relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-[11px] font-black border border-primary/20 tracking-[0.25em] uppercase"
          >
            <Target className="w-4 h-4" />
            <span>Own Your Unlocking Authority</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95] max-w-5xl mx-auto uppercase"
          >
            Sovereign <span className="text-gradient">GSM Service</span> <br />
            Platforms
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Stop paying fees to marketplaces. Build your own branded unlocking ecosystem. Issue licenses, provision nodes, and scale with total commercial sovereignty.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-6 pt-10"
          >
            <Button size="lg" className="btn-gradient rounded-full px-12 h-16 text-sm font-black shadow-glow group" onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}>
              Get Started <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" className="rounded-full px-12 h-16 text-sm font-bold bg-background/50 backdrop-blur border-border/50 hover:bg-muted/50" asChild>
              <Link to="/login">Client Portal</Link>
            </Button>
          </motion.div>
        </div>
        {/* Background decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[120%] h-full opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-grid-cyan" />
        </div>
      </section>
      {/* Service Flow Process Section (The "How It Works" Visualization) */}
      <section className="py-24 bg-muted/5 border-y border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-black uppercase tracking-tight mb-4">The Provisioning Flow</h2>
            <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">Automation from Registry to Global Edge</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <FlowStep 
              number="01" 
              icon={<Database className="w-8 h-8" />} 
              title="Operator Registry" 
              desc="Create your account and define your subscription tiers and node capacity." 
            />
            <FlowStep 
              number="02" 
              icon={<ShieldCheck className="w-8 h-8" />} 
              title="Cryptographic Sign" 
              desc="Generate unique license keys signed via HMAC-SHA256 protocols for domain security." 
            />
            <FlowStep 
              number="03" 
              icon={<Globe className="w-8 h-8" />} 
              title="Edge Deployment" 
              desc="Your service node is live globally with sub-30ms validation latency." 
              last
            />
            {/* Animated connectors for desktop */}
            <div className="hidden md:block absolute top-[4.5rem] left-[25%] right-[25%] -z-10">
              <div className="h-px border-t-2 border-dashed border-primary/20 w-full animate-pulse" />
            </div>
          </div>
        </div>
      </section>
      {/* Capabilities Section */}
      <section id="capabilities" className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none">Total Platform <br/><span className="text-primary">Capabilities</span></h2>
              <p className="text-lg text-muted-foreground font-medium max-w-md">
                We handle the technical complexity of licensing and validation so you can focus on servicing your clients.
              </p>
              <ul className="space-y-4 pt-4">
                <ListItem text="Global Distributed Registry" />
                <ListItem text="Domain-Bound License Authority" />
                <ListItem text="Real-time Node Telemetry" />
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <CapabilityCard icon={<Cpu />} title="HMAC Protocols" desc="Secure signatures" />
              <CapabilityCard icon={<Zap />} title="Edge Optimized" desc="Fast validation" primary />
              <CapabilityCard icon={<Layers />} title="White-labeled" desc="Your brand first" />
              <CapabilityCard icon={<RefreshCw />} title="Remote Push" desc="Zero downtime" />
            </div>
          </div>
        </div>
      </section>
      {/* Comparison Section (Responsive Table/Cards) */}
      <section id="comparison" className="py-24 bg-muted/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black uppercase tracking-tighter">Authority vs Marketplace</h2>
            <p className="text-muted-foreground uppercase text-[10px] font-black tracking-[0.3em] mt-2">Why sovereign operators win</p>
          </div>
          <div className="hidden md:block rounded-[2.5rem] border border-border/50 overflow-hidden shadow-soft bg-card">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50 border-b">
                  <th className="p-8 text-left text-[11px] font-black uppercase tracking-widest text-muted-foreground">Feature</th>
                  <th className="p-8 text-left text-[11px] font-black uppercase tracking-widest text-muted-foreground/60">Traditional Markets</th>
                  <th className="p-8 text-left text-[11px] font-black uppercase tracking-widest text-primary">GSM Flow Authority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                <ComparisonRow feature="Platform Fees" old="10% - 25% Per Sale" current="0% (Keep Everything)" />
                <ComparisonRow feature="Brand Control" old="Generic Sub-profile" current="Full Custom Domains" />
                <ComparisonRow feature="Customer Ownership" old="Owned by Market" current="100% Yours" />
                <ComparisonRow feature="API Scalability" old="Restricted / Slow" current="Edge-Optimized Gates" />
              </tbody>
            </table>
          </div>
          {/* Mobile Comparison Stacks */}
          <div className="md:hidden space-y-6">
            <MobileComp feature="Transaction Fees" value="0% Authority vs 20% Markets" />
            <MobileComp feature="Branding" value="Full Sovereignty vs Generic Profile" />
            <MobileComp feature="Data Access" value="Total Ownership vs Locked Silos" />
          </div>
        </div>
      </section>
      {/* Pricing Section */}
      <section id="pricing" className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black tracking-tighter uppercase">Select Your Tier</h2>
            <p className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-xs mt-4">Predictable pricing for sovereign scaling</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <div key={plan.id} className={cn(
                "p-12 rounded-[3rem] border transition-all duration-500 flex flex-col justify-between group relative",
                plan.id === 'growth' ? "border-primary shadow-glow scale-105 bg-card z-10" : "border-border/50 bg-card/80 backdrop-blur"
              )}>
                {plan.id === 'growth' && (
                  <Badge className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground font-black uppercase text-[10px] tracking-widest px-4 py-1.5 rounded-full">Recommended</Badge>
                )}
                <div>
                  <h3 className="text-xl font-bold mb-2 uppercase">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-6xl font-black text-primary">${plan.price}</span>
                    <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">/mo</span>
                  </div>
                  <ul className="space-y-4 mb-10">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-tight">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button className={cn("w-full h-16 font-black rounded-2xl text-[11px] uppercase tracking-[0.15em]", plan.id === 'growth' ? 'btn-gradient' : 'bg-muted hover:bg-muted/80')} asChild>
                  <Link to="/login">Activate Plan</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto bg-primary rounded-[4rem] p-16 md:p-32 text-center text-primary-foreground relative overflow-hidden shadow-glow-lg group">
          <div className="relative z-10 space-y-8">
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85]">Ready to Take <br/>Authority?</h2>
            <p className="text-xl font-medium opacity-90 max-w-xl mx-auto">Join the next generation of GSM service providers. Start your own platform node in seconds.</p>
            <Button size="lg" variant="secondary" className="rounded-full px-16 h-20 text-xl font-black text-primary shadow-2xl hover:scale-110 transition-transform active:scale-95" asChild>
              <Link to="/login">Deploy Now</Link>
            </Button>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-white/30 transition-colors" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
        </div>
      </section>
      <footer className="py-24 border-t border-border/30 bg-muted/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-8 h-8 text-primary" />
              <span className="text-lg font-black uppercase tracking-[0.2em]">GSM FLOW</span>
            </div>
            <p className="text-sm text-muted-foreground font-medium max-w-sm uppercase tracking-widest leading-relaxed opacity-60">
              The premier commercial authority for sovereign GSM service platforms. Built on Cloudflare Edge.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">Resources</h4>
            <ul className="space-y-3 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80">
              <li><Link to="/docs" className="hover:text-primary transition-colors">API Documentation</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Service Status</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Security Registry</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">Support</h4>
            <ul className="space-y-3 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80">
              <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Legal Terms</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Node</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 pt-8 border-t border-border/20 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 italic">
            © {new Date().getFullYear()} GSM FLOW AUTHORITY. Global Edge Licensing v1.5.
          </p>
        </div>
      </footer>
    </div>
  );
}
function FlowStep({ number, icon, title, desc, last }: { number: string, icon: React.ReactNode, title: string, desc: string, last?: boolean }) {
  return (
    <div className="flex flex-col items-center text-center space-y-6 group">
      <div className="w-20 h-20 rounded-[2rem] bg-card border border-border/50 flex items-center justify-center text-primary shadow-soft group-hover:scale-110 group-hover:border-primary/50 transition-all duration-300 relative">
        {icon}
        <span className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground text-[10px] font-black flex items-center justify-center shadow-glow">
          {number}
        </span>
      </div>
      <div className="space-y-2">
        <h3 className="font-black text-sm uppercase tracking-widest">{title}</h3>
        <p className="text-[11px] text-muted-foreground font-medium leading-relaxed max-w-[240px] uppercase opacity-70">{desc}</p>
      </div>
    </div>
  );
}
function CapabilityCard({ icon, title, desc, primary }: { icon: React.ReactNode, title: string, desc: string, primary?: boolean }) {
  return (
    <div className={cn(
      "p-8 rounded-[2.5rem] border flex flex-col items-start gap-4 transition-all hover:-translate-y-2 duration-300 shadow-soft",
      primary ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border/50 hover:border-primary/50"
    )}>
      <div className={cn("p-3 rounded-2xl", primary ? "bg-white/20" : "bg-primary/10 text-primary")}>
        {React.cloneElement(icon as React.ReactElement, { className: "w-6 h-6" })}
      </div>
      <div>
        <h3 className="text-xs font-black uppercase tracking-widest mb-1">{title}</h3>
        <p className={cn("text-[9px] font-bold uppercase tracking-tighter", primary ? "opacity-80" : "text-muted-foreground")}>{desc}</p>
      </div>
    </div>
  );
}
function ComparisonRow({ feature, old, current }: { feature: string, old: string, current: string }) {
  return (
    <tr className="hover:bg-primary/[0.02] transition-colors">
      <td className="p-8 text-[11px] font-black uppercase tracking-widest">{feature}</td>
      <td className="p-8 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60 line-through decoration-rose-500/50">{old}</td>
      <td className="p-8 text-[11px] font-black uppercase tracking-widest text-primary">{current}</td>
    </tr>
  );
}
function MobileComp({ feature, value }: { feature: string, value: string }) {
  return (
    <div className="p-6 rounded-2xl border border-border/50 bg-card space-y-2">
      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{feature}</h4>
      <p className="text-xs font-black uppercase tracking-tighter text-primary">{value}</p>
    </div>
  );
}
function ListItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3">
      <div className="p-1 rounded-md bg-primary/10 text-primary">
        <CheckCircle2 className="w-4 h-4" />
      </div>
      <span className="text-[11px] font-black uppercase tracking-widest">{text}</span>
    </li>
  );
}
function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-md px-2 py-1 text-xs font-medium", className)}>
      {children}
    </span>
  );
}