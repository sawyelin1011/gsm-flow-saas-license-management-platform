import React from 'react';
import {
  Book,
  Terminal,
  Copy,
  Check,
  Lock,
  ChevronRight,
  Zap,
  Globe,
  Settings,
  RotateCcw,
  Link
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
export function ApiDocs() {
  interface LicenseValidationResponse {
    valid: boolean;
    reason?: string;
    details?: { id: string; name: string; status: string; authorizedAt: number };
    timestamp: number;
  }
  type ValidationState = LicenseValidationResponse | { success: false; error: string } | null;
  const [testKey, setTestKey] = React.useState('');
  const [testDomain, setTestDomain] = React.useState('');
  const [validationResult, setValidationResult] = React.useState<ValidationState>(null);
  const [isValidating, setIsValidating] = React.useState(false);
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);
  const handleTest = async () => {
    if (!testKey || !testDomain) {
      toast.error('Required data missing: Please enter Key and Domain');
      return;
    }
    setIsValidating(true);
    setValidationResult(null);
    try {
      const res: LicenseValidationResponse = await api('/api/validate-license', {
        method: 'POST',
        body: JSON.stringify({ key: testKey, domain: testDomain })
      });
      setValidationResult(res);
      if (res.valid) {
        toast.success('Simulation complete: Node Authorized');
      } else {
        toast.warning('Simulation complete: Authorization Denied');
      }
    } catch (e: any) {
      toast.error(e.message || 'Authority node unreachable');
      setValidationResult({ success: false, error: e.message });
    } finally {
      setIsValidating(false);
    }
  };
  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
    toast.success('Snippet synchronized to clipboard');
  };
  const snippets = {
    curl: `curl -X POST https://auth.gsmflow.com/api/validate-license \\
  -H "Content-Type: application/json" \\
  -d '{
    "key": "GSM-XXXX-YYYY-ZZZZ",
    "domain": "service.cluster.com"
  }'`,
    javascript: `const validate = async (key, domain) => {
  const res = await fetch('https://auth.gsmflow.com/api/validate-license', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, domain })
  });
  return await res.json();
};`
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="grid lg:grid-cols-[260px_1fr] gap-16">
        <aside className="hidden lg:block space-y-8 sticky top-24 h-fit">
          <div className="space-y-2">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-2 mb-4">Core Documentation</h4>
            <NavGroup title="Protocol" items={['Overview', 'Security Headers']} active="Overview" />
            <NavGroup title="Resources" items={['Validation API', 'Node Status']} active="Validation API" />
            <NavGroup title="Integration" items={['Go SDK', 'Node.js Plugin', 'Webhook Event']} active="" />
          </div>
          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20">
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">Technical Support</p>
            <p className="text-xs text-muted-foreground leading-relaxed">Direct line for enterprise developers is open 24/7 via the dashboard.</p>
          </div>
        </aside>
        <div className="space-y-20">
          <section id="introduction" className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black tracking-widest uppercase border border-primary/20">
              <Book className="w-3.5 h-3.5" /> API Protocol v1.4
            </div>
            <h1 className="text-5xl font-display font-black tracking-tight leading-tight">Authorize Your <span className="text-gradient">Distributed Nodes</span></h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl font-medium">
              Connect your distributed GSM system clusters to the Flow Licensing Authority. Protect intellectual property with real-time cryptographic validation and domain-binding enforcement.
            </p>
          </section>
          <section id="validation" className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/20">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight">Validation Gateway</h2>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-[10px] font-black uppercase tracking-widest h-9 border-primary/20 text-primary hover:bg-primary/10"
                onClick={() => copyCode('https://auth.gsmflow.com/api/validate-license', 'endpoint')}
              >
                {copiedCode === 'endpoint' ? <Check className="w-3.5 h-3.5 mr-2" /> : <Link className="w-3.5 h-3.5 mr-2" />}
                Copy Endpoint URL
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 font-mono text-sm bg-muted/50 dark:bg-muted/10 p-5 rounded-2xl border border-border/50 shadow-inner group transition-all hover:border-primary/30">
                <span className="px-3 py-1 rounded-lg bg-primary text-primary-foreground font-black text-[10px] uppercase tracking-widest shadow-glow">POST</span>
                <span className="text-muted-foreground font-bold">/api/validate-license</span>
              </div>
              <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                The primary endpoint to verify node integrity. It performs a strict check against the active license key and ensures the requesting node matches the <span className="text-primary font-bold">Bound Service Domain</span> assigned during provisioning.
              </p>
            </div>
            <div className="grid xl:grid-cols-2 gap-10">
              <div className="space-y-6">
                <h3 className="font-bold flex items-center gap-2 text-sm uppercase tracking-widest text-muted-foreground">
                  <Terminal className="w-4 h-4 text-primary" /> Implementation Sample
                </h3>
                <div className="relative group overflow-hidden rounded-3xl border border-border/50 bg-slate-950 shadow-2xl">
                  <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-all z-10">
                    <Button variant="outline" size="icon" className="h-10 w-10 bg-white/10 border-white/20 text-white hover:bg-primary hover:border-primary" onClick={() => copyCode(snippets.curl, 'curl')}>
                      {copiedCode === 'curl' ? <Check className="w-5 h-5 text-cyan-400" /> : <Copy className="w-5 h-5" />}
                    </Button>
                  </div>
                  <pre className="p-8 text-xs sm:text-sm overflow-x-auto font-mono text-slate-300 leading-relaxed scrollbar-thin scrollbar-thumb-slate-800">
                    {snippets.curl}
                  </pre>
                </div>
              </div>
              <Card className="border-primary shadow-glow bg-primary/[0.02] flex flex-col">
                <CardHeader className="border-b border-primary/10 relative">
                  <div className="absolute right-4 top-4">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => { setTestKey(''); setTestDomain(''); setValidationResult(null); }} title="Reset Playground">
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                  <CardTitle className="text-xl flex items-center gap-3 font-black uppercase tracking-tight">
                    <Zap className="w-6 h-6 text-cyan-500 floating" /> Protocol Playground
                  </CardTitle>
                  <CardDescription className="font-bold text-primary/70">Test real-time validation logic against the authority node</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-8 flex-grow">
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest px-1">Active License Key</Label>
                    <div className="relative">
                      <Settings className="absolute left-3 top-3 w-4 h-4 text-muted-foreground/50" />
                      <Input
                        placeholder="GSM-XXXX-XXXX-XXXX"
                        className="bg-background/80 h-11 pl-10 font-mono font-bold border-border/50 focus:border-primary transition-all"
                        value={testKey}
                        onChange={(e) => setTestKey(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest px-1">Authorized Domain Target</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3 w-4 h-4 text-muted-foreground/50" />
                      <Input
                        placeholder="node.cluster.domain.com"
                        className="bg-background/80 h-11 pl-10 font-mono font-bold border-border/50 focus:border-primary transition-all"
                        value={testDomain}
                        onChange={(e) => setTestDomain(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button className="w-full btn-gradient h-12 font-black shadow-glow text-base uppercase tracking-widest" onClick={handleTest} disabled={isValidating}>
                    {isValidating ? "Validating Signal..." : "Execute Test Validation"}
                  </Button>
                  {validationResult && (
                    <div className={cn(
                      "mt-6 p-5 rounded-2xl border transition-all animate-fade-in",
                      'valid' in validationResult
                        ? (validationResult.valid
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                            : 'bg-rose-500/10 border-rose-500/30 text-rose-600')
                        : 'bg-slate-500/10 border-slate-500/30 text-slate-600'
                    )}>
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-black uppercase tracking-widest text-[10px]">Response Payload:</p>
                        <Badge className="text-[8px] h-4 uppercase font-black">
                          {'valid' in validationResult ? (validationResult.valid ? 'Authorized' : 'Denied') : 'Error'}
                        </Badge>
                      </div>
                      <pre className="whitespace-pre-wrap leading-relaxed max-h-[150px] overflow-y-auto scrollbar-thin text-xs font-mono">
                        {JSON.stringify(validationResult, null, 2)}
                      </pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
function NavGroup({ title, items, active }: { title: string, items: string[], active: string }) {
  return (
    <div className="space-y-1">
      <h5 className="px-3 text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest mb-2">{title}</h5>
      {items.map(item => (
        <Button
          key={item}
          variant="ghost"
          className={cn(
            "w-full justify-between h-10 px-3 text-sm font-bold transition-all rounded-xl",
            active === item
              ? 'bg-primary/10 text-primary border-r-2 border-primary shadow-sm'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          )}
        >
          {item}
          {active === item && <ChevronRight className="w-4 h-4" />}
        </Button>
      ))}
    </div>
  );
}
function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground", className)}>
      {children}
    </span>
  );
}