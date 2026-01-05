import React from 'react';
import { Book, Terminal, Lock, Zap, ShieldAlert, Cpu, Network } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { LicenseValidationResponse } from '@shared/types';
export function ApiDocs() {
  const [testKey, setTestKey] = React.useState('');
  const [testDomain, setTestDomain] = React.useState('');
  const [result, setResult] = React.useState<LicenseValidationResponse | null>(null);
  const [loading, setLoading] = React.useState(false);
  const handleTest = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await api<LicenseValidationResponse>('/api/validate-license', {
        method: 'POST',
        body: JSON.stringify({ key: testKey, domain: testDomain })
      });
      setResult(res);
      if (res.valid) toast.success('GSM Authorization Verified');
      else toast.warning('GSM Authorization Denied: ' + res.reason);
    } catch (e: any) {
      toast.error('Authority node connection error');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
      <div className="max-w-5xl mx-auto space-y-16 animate-fade-in">
        <section className="space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black tracking-widest uppercase border border-primary/20 mx-auto lg:mx-0">
            <Lock className="w-3.5 h-3.5" /> Cryptographic GSM Protocol v1.5
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase leading-none">GSM Services Validation Gateway</h1>
          <p className="text-lg text-muted-foreground font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
            Integrate the GSM Flow Licensing Authority into your distributed service nodes. Every tenant request is verified via HMAC-SHA256 signatures and domain-bound cryptographic cluster keys.
          </p>
        </section>
        <div className="grid lg:grid-cols-2 gap-10">
          <Card className="glass flex flex-col overflow-hidden border-border/50">
            <CardHeader className="bg-muted/5 border-b py-4">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <Terminal className="w-4 h-4 text-primary" /> Integration Snippet
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 bg-slate-950 p-8">
              <pre className="text-[12px] font-mono text-cyan-400 overflow-x-auto whitespace-pre-wrap leading-relaxed">
{`curl -X POST https://auth.gsmflow.com/api/validate-license \\
  -H "Content-Type: application/json" \\
  -d '{
    "key": "GSM-XXXX-YYYY",
    "domain": "node.gsm-cluster.com"
  }'`}
              </pre>
              <div className="mt-10 pt-10 border-t border-slate-800 space-y-6">
                 <div className="flex items-start gap-4">
                    <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-slate-400 leading-relaxed uppercase font-black">
                      Protocol Note: GSM licenses are signed using a server-side HMAC master secret. Any modification of the key or domain binding in transit will trigger an immediate node revocation.
                    </p>
                 </div>
                 <div className="flex items-start gap-4">
                    <Cpu className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-slate-400 leading-relaxed uppercase font-black">
                      Edge Latency: Our distributed authority nodes ensure sub-30ms validation global-wide for all active GSM tenants.
                    </p>
                 </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-primary/50 shadow-glow bg-primary/[0.02] flex flex-col">
            <CardHeader className="py-4 border-b border-primary/10">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-500" /> GSM Protocol Playground
              </CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-tight opacity-70">Execute real-time GSM node authorization tests</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6 flex-1">
              <div className="space-y-3">
                <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">GSM Cluster Key</Label>
                <Input value={testKey} onChange={e => setTestKey(e.target.value)} placeholder="GSM-XXXX-XXXX" className="h-12 font-mono text-xs font-bold border-border/50 bg-background/50 focus:ring-primary" />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Service Target Domain</Label>
                <Input value={testDomain} onChange={e => setTestDomain(e.target.value)} placeholder="gsm.node-01.local" className="h-12 font-mono text-xs font-bold border-border/50 bg-background/50 focus:ring-primary" />
              </div>
              <Button onClick={handleTest} disabled={loading} className="w-full btn-gradient font-black h-12 text-[10px] uppercase tracking-widest shadow-glow mt-2">
                {loading ? "Transmitting Signal..." : "Verify GSM Authorization"}
              </Button>
              {result && (
                <div className={cn("mt-6 p-6 rounded-2xl border font-mono text-[11px] leading-relaxed shadow-sm", result.valid ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600" : "bg-rose-500/10 border-rose-500/30 text-rose-600")}>
                  <p className="font-black uppercase mb-2 flex items-center gap-2">
                    <span className={cn("w-2 h-2 rounded-full", result.valid ? "bg-emerald-500" : "bg-rose-500")} />
                    Authority Status: {result.valid ? "AUTHORIZED" : "DENIED"}
                  </p>
                  <p className="font-bold opacity-80 uppercase tracking-tighter mb-4">{result.reason || "Node Integrity Verified"}</p>
                  <div className="bg-black/5 p-4 rounded-xl border border-current/10">
                    <pre className="opacity-70 whitespace-pre-wrap">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <footer className="pt-16 pb-8 text-center space-y-4">
           <div className="h-px w-full bg-border/50 mb-8" />
           <div className="flex items-center justify-center gap-2">
              <Network className="w-5 h-5 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">GSM FLOW AUTHORITY NETWORK</span>
           </div>
           <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">Distributed Licensing Edge v1.5.2-Alpha</p>
        </footer>
      </div>
    </div>
  );
}