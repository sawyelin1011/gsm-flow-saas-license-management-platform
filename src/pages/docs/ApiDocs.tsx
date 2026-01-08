import React from 'react';
import { Book, Terminal, Copy, Check, Lock, ChevronRight, Zap, Globe, Link as LinkIcon, ShieldAlert } from 'lucide-react';
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
      if (res.valid) toast.success('Authorization Verified');
      else toast.warning('Authorization Denied: ' + res.reason);
    } catch (e: any) {
      toast.error('Authority node error');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-5xl mx-auto py-12 space-y-16">
      <section className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black tracking-widest uppercase border border-primary/20">
          <Lock className="w-3 h-3" /> Cryptographic Protocol v1.5
        </div>
        <h1 className="text-4xl font-black tracking-tight uppercase">Validation Gateway</h1>
        <p className="text-muted-foreground font-medium leading-relaxed max-w-2xl">
          Integrate the GSM Flow Licensing Authority into your distributed service nodes. Every request is verified via HMAC-SHA256 signatures and domain-bound cryptographic keys.
        </p>
      </section>
      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="glass flex flex-col">
          <CardHeader>
            <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
              <Terminal className="w-4 h-4 text-primary" /> Integration Snippet
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 bg-slate-950 p-6 rounded-b-xl">
            <pre className="text-[11px] font-mono text-cyan-400 overflow-x-auto whitespace-pre-wrap leading-relaxed">
{`curl -X POST https://auth.gsmflow.com/api/validate-license \\
  -H "Content-Type: application/json" \\
  -d '{
    "key": "GSM-XXXX-YYYY",
    "domain": "node.cluster.com"
  }'`}
            </pre>
            <div className="mt-8 pt-8 border-t border-slate-800 space-y-4">
               <div className="flex items-start gap-3">
                  <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-1" />
                  <p className="text-[10px] text-slate-400 leading-relaxed uppercase font-bold">
                    Note: Licenses are signed using a server-side HMAC master key. Tampering with the key or signature in transit will result in an immediate 401 Authorization failure.
                  </p>
               </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-primary shadow-glow bg-primary/[0.02]">
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-500" /> Protocol Playground
            </CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase">Execute real-time node authorization tests</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[9px] uppercase font-black">Cluster Key</Label>
              <Input value={testKey} onChange={e => setTestKey(e.target.value)} placeholder="GSM-XXXX-XXXX" className="font-mono text-xs" />
            </div>
            <div className="space-y-2">
              <Label className="text-[9px] uppercase font-black">Target Domain</Label>
              <Input value={testDomain} onChange={e => setTestDomain(e.target.value)} placeholder="gsm.node.com" className="font-mono text-xs" />
            </div>
            <Button onClick={handleTest} disabled={loading} className="w-full btn-gradient font-black h-11">
              {loading ? "Validating Signal..." : "Verify Authorization"}
            </Button>
            {result && (
              <div className={cn("mt-4 p-4 rounded-xl border font-mono text-[10px]", result.valid ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600" : "bg-rose-500/10 border-rose-500/20 text-rose-600")}>
                <p className="font-black uppercase mb-1">Status: {result.valid ? "Authorized" : "Denied"}</p>
                <p className="opacity-70">{result.reason || "Integrity Verified"}</p>
                <pre className="mt-2 pt-2 border-t border-current/20 opacity-50">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}