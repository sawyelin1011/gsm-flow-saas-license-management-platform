import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Server, Key, BarChart3, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { MOCK_PLANS } from '@shared/mock-data';
import { cn } from '@/lib/utils';
export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <ThemeToggle />
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-rainbow opacity-20 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20 tracking-wider uppercase"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Next-Gen Licensing Authority</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-display font-bold tracking-tight leading-tight"
            >
              Secure Your GSM Service <br />
              <span className="text-gradient">With Flow Authority</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              The enterprise-grade license management platform for self-hosted GSM solutions.
              Issue keys, manage tenants, and protect your intellectual property globally.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-4 pt-4"
            >
              <Button size="lg" className="btn-gradient rounded-full px-8 h-12 text-lg font-bold shadow-glow" asChild>
                <Link to="/login">Get Started <ArrowRight className="ml-2 w-5 h-5" /></Link>
              </Button>
              <Button variant="outline" size="lg" className="rounded-full px-8 h-12 text-lg border-primary/20 hover:bg-primary/5">
                View Documentation
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Features Grid */}
      <section className="py-24 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Key className="w-6 h-6" />}
              title="Secure Licensing"
              description="Cryptographically signed keys that bind to specific domains and installation environments."
            />
            <FeatureCard
              icon={<Server className="w-6 h-6" />}
              title="Tenant Management"
              description="Easily create, suspend, or revoke installations from a centralized dashboard."
            />
            <FeatureCard
              icon={<BarChart3 className="w-6 h-6" />}
              title="Real-time Analytics"
              description="Monitor license validation attempts and geographic distribution of your service."
            />
          </div>
        </div>
      </section>
      {/* Pricing Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-display font-bold">Simple, Scalable Pricing</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">Professional tools to grow your service distribution with confidence and security.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {MOCK_PLANS.map((plan) => (
              <div 
                key={plan.id} 
                className={cn(
                  "flex flex-col p-8 rounded-3xl border bg-card transition-all duration-500 hover:-translate-y-2",
                  plan.id === 'professional' ? "border-primary shadow-glow ring-1 ring-primary/20 scale-105" : "border-border hover:border-primary/50"
                )}
              >
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-primary">${plan.price}</span>
                  <span className="text-muted-foreground">/{plan.interval}</span>
                </div>
                <ul className="space-y-4 mb-8 flex-grow">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button className={cn("rounded-xl h-12 font-bold", plan.id === 'professional' ? 'btn-gradient' : 'border-primary/20')} variant={plan.id === 'professional' ? 'default' : 'outline'} asChild>
                  <Link to="/login">Select {plan.name}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
      <footer className="py-12 border-t border-border/50 bg-muted/5">
        <div className="max-w-7xl mx-auto px-4 text-center text-muted-foreground text-sm font-medium">
          © {new Date().getFullYear()} GSM Flow SaaS. Secure Service Licensing Platform.
        </div>
      </footer>
    </div>
  );
}
function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-8 rounded-2xl border bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 hover:shadow-glow transition-all duration-300 group">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform shadow-sm">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed text-sm">{description}</p>
    </div>
  );
}