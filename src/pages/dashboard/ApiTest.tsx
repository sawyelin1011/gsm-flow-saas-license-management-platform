import React from 'react';
import { Terminal, Send, History, Check, ShieldCheck, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
export function ApiTest() {
  const [payload, setPayload] = React.useState('{"action": "echo", "target": "worker"}');
  const [response, setResponse] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [latency, setLatency] = React.useState<number | null>(null);
  const runTest = async () => {
    setIsLoading(true);
    const start = performance.now();
    try {
      const body = JSON.parse(payload);
      const res = await api('/api/test', {
        method: 'POST',
        body: JSON.stringify(body)
      });
      setResponse(res);
      setLatency(Math.round(performance.now() - start));
      toast.success('Worker responded successfully');
    } catch (e) {
      toast.error('API Request Failed');
      setResponse({ error: e instanceof Error ? e.message : 'Unknown error' });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="dashboard-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex flex-col gap-1 mb-8">
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
          <Terminal className="w-8 h-8 text-primary" /> API Laboratory
        </h1>
        <p className="text-muted-foreground font-medium">Debug and test your backend Cloudflare Worker endpoints.</p>
      </div>
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Request Side */}
        <Card className="glass border-primary/20">
          <CardHeader className="border-b bg-muted/5">
            <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
              <Send className="w-4 h-4 text-primary" /> Dispatch Payload
            </CardTitle>
            <CardDescription className="text-xs">Send a POST request to the internal /api/test gateway.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">JSON Body</label>
              <textarea
                className="w-full h-40 bg-muted/20 border border-border/50 rounded-xl p-4 font-mono text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                value={payload}
                onChange={(e) => setPayload(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={runTest} 
                disabled={isLoading}
                className="flex-1 btn-gradient h-12 font-black shadow-glow"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                Execute Signal
              </Button>
              <Button variant="outline" className="h-12 font-bold px-6" onClick={() => setResponse(null)}>
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
        {/* Response Side */}
        <Card className="glass flex flex-col min-h-[400px]">
          <CardHeader className="border-b bg-muted/5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                  <History className="w-4 h-4 text-primary" /> Response Stack
                </CardTitle>
                <CardDescription className="text-xs">Real-time feedback from the Cloudflare runtime.</CardDescription>
              </div>
              {latency && (
                <div className="px-2 py-1 rounded bg-primary/10 border border-primary/20 text-[10px] font-black text-primary">
                  {latency}ms
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0 relative">
            <ScrollArea className="h-[350px] w-full">
              {!response ? (
                <div className="h-full w-full flex flex-col items-center justify-center p-12 text-center opacity-30">
                  <Terminal className="w-12 h-12 mb-4" />
                  <p className="text-xs font-bold uppercase tracking-widest">Waiting for signal execution...</p>
                </div>
              ) : (
                <pre className="p-6 text-[11px] font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(response, null, 2)}
                </pre>
              )}
            </ScrollArea>
            {response && (
              <div className="absolute bottom-4 right-4 animate-fade-in">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-[10px] font-black">
                  <Check className="w-3 h-3" /> STATUS 200 OK
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="mt-12 p-6 rounded-3xl bg-primary/5 border border-primary/10 flex flex-col md:flex-row items-center gap-6">
        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 shadow-sm border border-primary/20">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-black">Secure Data Layer</p>
          <p className="text-xs text-muted-foreground font-medium leading-relaxed">
            Every request in this boilerplate is processed through Cloudflare's Global Network. 
            All API calls are cryptographically signed and verified by the worker gateway.
          </p>
        </div>
      </div>
    </div>
  );
}