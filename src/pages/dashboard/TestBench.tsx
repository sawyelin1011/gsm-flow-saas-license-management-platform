import React from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  Terminal,
  Activity,
  Send,
  History,
  Trash2,
  CheckCircle2,
  XCircle,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
interface TestResult {
  id: string;
  endpoint: string;
  status: number;
  timestamp: string;
  response: any;
  success: boolean;
}
export function TestBench() {
  const [history, setHistory] = React.useState<TestResult[]>([]);
  const [selectedResult, setSelectedResult] = React.useState<TestResult | null>(null);
  const { data: health, refetch: checkHealth, isFetching: isCheckingHealth } = useQuery({
    queryKey: ['health-check'],
    queryFn: () => api('/api/health'),
    enabled: false
  });
  const testMutation = useMutation({
    mutationFn: async ({ path, method = 'GET', body }: { path: string, method?: string, body?: any }) => {
      const start = Date.now();
      try {
        const res = await api<any>(path, {
          method,
          ...(body && { body: JSON.stringify(body) })
        });
        return { res, status: 200, success: true, latency: Date.now() - start };
      } catch (err: any) {
        return { res: { error: err.message }, status: 500, success: false, latency: Date.now() - start };
      }
    },
    onSuccess: (data, variables) => {
      const newResult: TestResult = {
        id: crypto.randomUUID(),
        endpoint: variables.path,
        status: data.status,
        timestamp: new Date().toLocaleTimeString(),
        response: data.res,
        success: data.success
      };
      setHistory(prev => [newResult, ...prev].slice(0, 20));
      setSelectedResult(newResult);
      toast.success(`Signal sent to ${variables.path}`);
    }
  });
  const runTest = (path: string, method: string = 'GET', body?: any) => {
    testMutation.mutate({ path, method, body });
  };
  const clearHistory = () => {
    setHistory([]);
    setSelectedResult(null);
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border/50 bg-muted/5">
          <CardHeader className="py-4 border-b">
            <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
              <Activity className="w-3 h-3" /> Node Health
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Worker Thread</span>
              <Badge variant="outline" className="text-[9px] uppercase border-emerald-500/20 text-emerald-500 bg-emerald-500/5 px-2">
                Nominal
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Authority Link</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-[9px] font-black uppercase border border-border/50"
                onClick={() => checkHealth()}
                disabled={isCheckingHealth}
              >
                {isCheckingHealth ? "Probing..." : "Ping API"}
              </Button>
            </div>
            {health && (
              <div className="p-3 rounded-lg bg-background border text-[10px] font-mono whitespace-pre overflow-hidden text-primary">
                {JSON.stringify(health, null, 2)}
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="md:col-span-2 border-border/50 bg-card">
          <CardHeader className="py-4 border-b">
            <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
              <Zap className="w-3 h-3 text-primary" /> Command Dispatch
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <TestButton onClick={() => runTest('/api/me')} label="GET Profile" />
              <TestButton onClick={() => runTest('/api/tenants')} label="GET Registry" />
              <TestButton onClick={() => runTest('/api/validate-license', 'POST', { key: 'FLOW-SIM-123', domain: 'test.local' })} label="SIM Validation" />
              <TestButton onClick={() => runTest('/api/billing/invoices')} label="GET Invoices" />
              <TestButton onClick={() => runTest('/api/support')} label="GET Tickets" />
              <TestButton onClick={() => runTest('/api/admin/stats')} label="GET Admin Stats" />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[500px]">
        <Card className="border-border/50 flex flex-col overflow-hidden shadow-soft">
          <CardHeader className="py-3 border-b bg-muted/5 flex flex-row items-center justify-between">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <History className="w-3 h-3" /> Dispatch Log
            </CardTitle>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={clearHistory}>
              <Trash2 className="w-3 h-3" />
            </Button>
          </CardHeader>
          <ScrollArea className="flex-1">
            <div className="divide-y divide-border/30">
              {history.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground italic text-xs uppercase font-black tracking-widest opacity-20">
                  Buffer Empty
                </div>
              ) : (
                history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedResult(item)}
                    className={cn(
                      "w-full text-left p-4 hover:bg-muted/30 transition-colors flex items-center justify-between group",
                      selectedResult?.id === item.id && "bg-primary/5 border-l-2 border-primary"
                    )}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {item.success ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <XCircle className="w-3 h-3 text-rose-500" />}
                        <span className="text-xs font-bold font-mono text-foreground">{item.endpoint}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">{item.timestamp}</p>
                    </div>
                    <Badge variant="outline" className="text-[9px] uppercase font-black h-5">
                      {item.status}
                    </Badge>
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </Card>
        <Card className="border-border/50 flex flex-col overflow-hidden bg-zinc-950 text-zinc-300 shadow-2xl">
          <CardHeader className="py-3 border-b border-zinc-800 flex flex-row items-center justify-between">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
              <Terminal className="w-3 h-3" /> Output Buffer
            </CardTitle>
            {selectedResult && (
              <span className="text-[9px] font-mono text-zinc-600">{selectedResult.id.slice(0, 8)}</span>
            )}
          </CardHeader>
          <ScrollArea className="flex-1 p-4 font-mono text-[11px] leading-relaxed scrollbar-thin scrollbar-thumb-zinc-800">
            {selectedResult ? (
              <pre className="whitespace-pre-wrap text-cyan-400/80">
                {JSON.stringify(selectedResult.response, null, 2)}
              </pre>
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-700 italic font-black uppercase tracking-[0.2em]">
                Listen...
              </div>
            )}
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}
function TestButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className="h-10 text-[10px] font-black uppercase tracking-widest justify-between px-3 border-border/50 hover:border-primary/50 transition-all hover:bg-primary/5 hover:text-primary active:scale-95"
    >
      <span className="truncate">{label}</span>
      <Send className="w-3 h-3 text-muted-foreground ml-2 opacity-50" />
    </Button>
  );
}