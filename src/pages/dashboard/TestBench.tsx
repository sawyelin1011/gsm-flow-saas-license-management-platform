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
  Clock,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
      toast.success(`Request to ${variables.path} finished`);
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border/50 bg-muted/5">
          <CardHeader className="py-4 border-b">
            <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
              <Activity className="w-3 h-3" /> System Vitals
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Worker Status</span>
              <Badge variant="outline" className="text-[9px] uppercase border-emerald-500/20 text-emerald-500 bg-emerald-500/5">
                Active
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">API Health</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 text-[9px] font-black uppercase"
                onClick={() => checkHealth()}
                disabled={isCheckingHealth}
              >
                {isCheckingHealth ? "Probing..." : "Ping /api/health"}
              </Button>
            </div>
            {health && (
              <div className="p-3 rounded-lg bg-background border text-[10px] font-mono whitespace-pre overflow-hidden">
                {JSON.stringify(health, null, 2)}
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="md:col-span-2 border-border/50">
          <CardHeader className="py-4 border-b">
            <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
              <Zap className="w-3 h-3" /> Command Center
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <TestButton onClick={() => runTest('/api/me')} label="GET /api/me" />
              <TestButton onClick={() => runTest('/api/items')} label="GET /api/items" />
              <TestButton onClick={() => runTest('/api/test', 'POST', { hello: 'v2' })} label="POST /api/test" />
              <TestButton onClick={() => runTest('/api/billing/invoices')} label="GET /api/billing" />
              <TestButton onClick={() => runTest('/api/support')} label="GET /api/support" />
              <TestButton onClick={() => runTest('/api/admin/stats')} label="GET /api/admin/stats" />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[500px]">
        <Card className="border-border/50 flex flex-col overflow-hidden">
          <CardHeader className="py-3 border-b bg-muted/5 flex flex-row items-center justify-between">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <History className="w-3 h-3" /> Session Logs
            </CardTitle>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={clearHistory}>
              <Trash2 className="w-3 h-3" />
            </Button>
          </CardHeader>
          <ScrollArea className="flex-1">
            <div className="divide-y">
              {history.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground italic text-xs">
                  No requests triggered in this session.
                </div>
              ) : (
                history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedResult(item)}
                    className={cn(
                      "w-full text-left p-4 hover:bg-muted/50 transition-colors flex items-center justify-between group",
                      selectedResult?.id === item.id && "bg-primary/5 border-l-2 border-primary"
                    )}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {item.success ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <XCircle className="w-3 h-3 text-rose-500" />}
                        <span className="text-xs font-bold font-mono">{item.endpoint}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">{item.timestamp}</p>
                    </div>
                    <Badge variant="outline" className="text-[9px] uppercase">
                      {item.status}
                    </Badge>
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </Card>
        <Card className="border-border/50 flex flex-col overflow-hidden bg-zinc-950 text-zinc-300">
          <CardHeader className="py-3 border-b border-zinc-800 flex flex-row items-center justify-between">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
              <Terminal className="w-3 h-3" /> Output Buffer
            </CardTitle>
            {selectedResult && (
              <span className="text-[9px] font-mono text-zinc-600">{selectedResult.id.slice(0, 8)}</span>
            )}
          </CardHeader>
          <ScrollArea className="flex-1 p-4 font-mono text-[11px] leading-relaxed">
            {selectedResult ? (
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(selectedResult.response, null, 2)}
              </pre>
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-700 italic">
                Waiting for dispatch signal...
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
      className="h-10 text-[10px] font-bold justify-between px-3 border-border/50 hover:border-primary/50 transition-all hover:bg-primary/5"
    >
      <span className="truncate">{label}</span>
      <Send className="w-3 h-3 text-muted-foreground ml-2" />
    </Button>
  );
}