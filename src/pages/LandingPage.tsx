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
  Cpu,
  Network
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';
export function LandingPage() {
  useEffect(() => {
    document.title = "GSM Flow - The Premier GSM Service Licensing Authority";
  }, []);
  const plans = [
    { 
      id: 'launch', 
      name: 'Launch Plan', 
      price: 49, 
      features: [
        '1 GSM Tenant Provisioning', 
        'Remote Service Management', 
        'Standard Support', 
        'Real-time License Validation'
      ] 
    },
    { 
      id: 'growth', 
      name: 'Growth Plan', 
      price: 149, 
      features: [
        '10 GSM Tenants', 
        'Priority Authority Support', 
        'Automated Service Updates', 
        'Advanced API Analytics', 
        'Global Edge Validation'
      ] 
    },
    { 
      id: 'agency', 
      name: 'Agency Plan', 
      price: 499, 
      features: [
        '100 GSM Tenants', 
        'White-label Service Portal', 
        '24/7 Dedicated Support', 
        'Custom Integration Hooks', 
        'SLA Guarantee'
      ] 
    }
  ];
  const scrollToPricing = () => {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };
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
            <ShieldCheck className="w-3.5 h-3.5 fill-current" />
            <span>The Premier GSM Service Licensing Authority</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] max-w-5xl mx-auto"
          >
            Launch Your Own <br />
            <span className="text-gradient">GSM Services Platform</span>
          </motion.h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
            Take absolute authority over your GSM service clusters. Issue cryptographically signed licenses, provision tenants, and manage global installations with sovereign control.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Button size="lg" className="btn-gradient rounded-full px-10 h-14 text-lg font-black shadow-glow" asChild>
              <Link to="/login">Start License <ArrowRight className="ml-2 w-5 h-5" /></Link>
            </Button>
            <Button variant="outline" size="lg" className="rounded-full px-10 h-14 text-lg font-bold" onClick={scrollToPricing}>
              View Pricing
            </Button>
          </div>
        </section>
        {/* Who/What/How Section */}
        <section className="py-24 grid md:grid-cols-3 gap-12 border-y border-border/50">
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-primary">Who is it for?</h3>
            <p className="text-lg font-bold leading-tight">Hardware Service Providers & Remote Cluster Operators.</p>
            <p className="text-muted-foreground text-sm font-medium">Designed specifically for businesses managing large-scale GSM hardware deployments that require centralized authority and secure tenant isolation.</p>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-primary">What is GSM Flow?</h3>
            <p className="text-lg font-bold leading-tight">The Centralized Licensing Authority for GSM Networks.</p>
            <p className="text-muted-foreground text-sm font-medium">GSM Flow provides the commercial and administrative layer for self-hosted GSM services, handling licensing, billing, and tenant management without touching the core hardware logic.</p>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-primary">How it works?</h3>
            <p className="text-lg font-bold leading-tight">Provision. Sign. Validate. Repeat.</p>
            <p className="text-muted-foreground text-sm font-medium">Create a tenant, bind it to a domain, generate a cryptographically signed license key, and validate it in real-time from your service nodes using our global Edge API.</p>
          </div>
        </section>
        {/* Workflow Section */}
        <section className="py-24 bg-muted/30 rounded-[3rem] p-8 md:p-12 my-24 border border-border/50">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4 uppercase tracking-tighter">The Authority Protocol</h2>
            <p className="text-muted-foreground uppercase text-xs font-bold tracking-widest">Complete control from provisioning to validation.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <WorkflowItem icon={<Lock />} title="License Management" desc="Generate unique, cryptographically secure keys for every installation." />
            <WorkflowItem icon={<Server />} title="Tenant Registry" desc="Onboard new service clusters with automated domain binding." />
            <WorkflowItem icon={<LayoutDashboard />} title="GSM Operator Portal" desc="Manage subscriptions and monitor global fleet health from one console." />
            <WorkflowItem icon={<RefreshCw />} title="Real-time Updates" desc="Push critical service updates and manage node states remotely." />
          </div>
        </section>
        {/* Features Section */}
        <section className="py-24 grid grid-cols-1 md:grid-cols-3 gap-12">
          <FeatureCard
            icon={<Globe className="w-8 h-8" />}
            title="Global Edge Validation"
            description="Our authority nodes respond in <30ms globally, ensuring your GSM services stay online without interruption."
          />
          <FeatureCard
            icon={<ShieldCheck className="w-8 h-8" />}
            title="Tenant Authority"
            description="You own the registry. Revoke, suspend, or upgrade service licenses instantly with a single click from your GSM Operator portal."
          />
          <FeatureCard
            icon={<Code2 className="w-8 h-8" />}
            title="Sovereign SDK"
            description="Drop-in authorization libraries for Go, Python, and Node.js to secure your GSM server cluster logic with ease."
          />
        </section>
        {/* Pricing Section */}
        <section id="pricing" className="py-24">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black tracking-tighter mb-4 uppercase">Strategic Plans</h2>
            <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Scale your GSM service empire on your terms</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <div key={plan.id} className={cn(
                "p-8 rounded-3xl border transition-all duration-500 flex flex-col justify-between",
                plan.id === 'growth' ? "border-primary shadow-glow scale-105 bg-card z-10" : "border-border bg-card/50"
              )}>
                <div>
                  <h3 className="text-xl font-bold mb-1 uppercase tracking-tight">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-black text-primary">${plan.price}</span>
                    <span className="text-muted-foreground text-sm font-bold uppercase">/mo</span>
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
                <Button className={cn("w-full h-12 font-bold rounded-xl", plan.id === 'growth' ? 'btn-gradient' : '')} variant={plan.id === 'growth' ? 'default' : 'outline'} asChild>
                  <Link to="/login">Select {plan.name.split(' ')[0]}</Link>
                </Button>
              </div>
            ))}
          </div>
        </section>
        <footer className="py-12 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <span className="text-sm font-black uppercase tracking-widest">GSM FLOW</span>
          </div>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            <a href="/docs" className="hover:text-primary transition-colors">API Reference</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          </div>
          <div className="text-center text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
            © {new Date().getFullYear()} GSM Flow Licensing Authority.
          </div>
        </footer>
      </div>
    </div>
  );
}
function WorkflowItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="space-y-4">
      <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto text-2xl font-black border border-primary/20">
        {icon}
      </div>
      <h3 className="font-bold text-xs uppercase tracking-tight">{title}</h3>
      <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">{desc}</p>
    </div>
  );
}
function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="space-y-4 group p-6 rounded-2xl hover:bg-muted/30 transition-colors">
      <div className="text-primary group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <h3 className="text-2xl font-black tracking-tighter uppercase">{title}</h3>
      <p className="text-muted-foreground leading-relaxed font-medium">{description}</p>
    </div>
  );
}