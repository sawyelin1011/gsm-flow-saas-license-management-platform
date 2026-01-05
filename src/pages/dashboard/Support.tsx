import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  LifeBuoy,
  Plus,
  MessageSquare,
  ExternalLink,
  Loader2,
  AlertCircle,
  HelpCircle,
  Clock,
  ShieldAlert,
  Terminal,
  ChevronRight,
  Search,
  BookOpen
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from '@/lib/api-client';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { format } from 'date-fns';
import type { SupportTicket, SupportTicketCategory } from '@shared/types';
export function Support() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [category, setCategory] = React.useState<SupportTicketCategory>('technical');
  const [messageLength, setMessageLength] = React.useState(0);
  const { data: tickets, isLoading } = useQuery<SupportTicket[]>({
    queryKey: ['tickets'],
    queryFn: () => api<SupportTicket[]>('/api/support'),
  });
  const createMutation = useMutation({
    mutationFn: (vals: { subject: string; message: string; category: SupportTicketCategory }) =>
      api<SupportTicket>('/api/support', { method: 'POST', body: JSON.stringify(vals) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      setIsCreateOpen(false);
      setMessageLength(0);
      toast.success('GSM Technical signal transmitted to authority developers');
    },
    onError: (err: any) => toast.error(err?.message || 'Signal transmission failed'),
  });
  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const subject = (formData.get('subject') as string).trim();
    const message = (formData.get('message') as string).trim();
    if (subject.length < 5) return toast.error('Subject identifier must be more descriptive');
    if (message.length < 20) return toast.error('Please provide additional technical node context');
    createMutation.mutate({ subject, message, category });
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight">Operator Support Center</h1>
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-tight opacity-70">Sovereign Node Assistance</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="btn-gradient w-full sm:w-auto font-black h-11 text-[10px] uppercase tracking-widest px-8 shadow-glow">
                <Plus className="mr-2 h-4 w-4" /> Open GSM Support Channel
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md glass">
              <form onSubmit={handleCreate} className="space-y-6">
                <DialogHeader>
                  <DialogTitle className="text-sm font-black uppercase tracking-[0.15em] flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-primary" /> GSM Technical Signal
                  </DialogTitle>
                  <DialogDescription className="text-[10px] font-bold uppercase tracking-tight opacity-70">Provision node logs and environment context for rapid authorization resolution.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-2">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest px-1">Classification</Label>
                    <Select value={category} onValueChange={(val) => setCategory(val as SupportTicketCategory)}>
                      <SelectTrigger className="h-11 text-xs font-black border-border/50 bg-background/50">
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent className="glass">
                        <SelectItem value="technical" className="text-xs font-bold py-2">GSM Technical Protocol</SelectItem>
                        <SelectItem value="billing" className="text-xs font-bold py-2">Tenant Registry & Billing</SelectItem>
                        <SelectItem value="account" className="text-xs font-bold py-2">GSM Operator Management</SelectItem>
                        <SelectItem value="general" className="text-xs font-bold py-2">General Inquiry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest px-1">Subject Identifier</Label>
                    <Input name="subject" placeholder="e.g. Cluster-TX Connectivity Exception" className="h-11 text-xs font-bold bg-background/50 border-border/50" required />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Diagnostic Context</Label>
                      <span className={cn(
                        "text-[9px] font-black uppercase tracking-tighter transition-colors",
                        messageLength < 20 ? "text-rose-500" : messageLength < 100 ? "text-amber-500" : "text-emerald-500"
                      )}>
                        Detail level: {messageLength < 20 ? 'LOW' : messageLength < 100 ? 'STANDARD' : 'HIGH QUALITY'}
                      </span>
                    </div>
                    <Textarea
                      name="message"
                      onChange={(e) => setMessageLength(e.target.value.length)}
                      placeholder="Attach relevant GSM node error logs and service stack traces..."
                      className="min-h-[140px] text-xs font-medium resize-none bg-background/50 border-border/50 leading-relaxed"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={createMutation.isPending} className="btn-gradient w-full h-12 text-[10px] font-black uppercase tracking-widest shadow-glow">
                    {createMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Transmit Authorized Signal"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between border-b border-border/50 pb-4">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" /> GSM Operator Signal Buffer
              </h2>
              <Badge variant="outline" className="text-[10px] font-black h-6 px-3 uppercase tracking-widest border-border/50">{tickets?.length || 0} Records</Badge>
            </div>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full rounded-2xl border border-border/50" />)}
              </div>
            ) : tickets?.length === 0 ? (
              <Card className="border-dashed border-border/50 py-24 text-center bg-muted/5 rounded-3xl group">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted text-muted-foreground/30 mb-6 group-hover:scale-110 transition-transform">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <p className="text-xs text-muted-foreground font-black italic uppercase tracking-[0.2em] opacity-40">No active GSM support signals detected in registry</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {tickets?.map((ticket) => (
                  <Card key={ticket.id} className="border-border/50 hover:border-primary/30 hover:bg-primary/[0.01] transition-all group rounded-2xl shadow-soft">
                    <div className="p-6 flex items-center justify-between gap-6">
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-[9px] font-black h-5 px-2 uppercase border-primary/20 bg-primary/5 text-primary tracking-tight">{ticket.category.toUpperCase()}</Badge>
                          <h3 className="font-black text-sm uppercase group-hover:text-primary transition-colors truncate tracking-tighter">{ticket.subject}</h3>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-mono font-black uppercase tracking-tighter">
                          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {format(ticket.createdAt, 'MMM dd, HH:mm')}</span>
                          <span className="opacity-40">TENANT_NODE: {ticket.id.slice(0, 10).toUpperCase()}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-3">
                         <Badge className={cn(
                          "text-[9px] uppercase h-6 font-black tracking-widest px-3",
                          ticket.status === 'open' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                        )}>
                          {ticket.status.toUpperCase()}
                        </Badge>
                        <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-6">
            <Card className="border-border/50 bg-card shadow-soft rounded-2xl overflow-hidden">
              <CardHeader className="py-5 border-b bg-muted/5 px-6">
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.15em] flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" /> Authority Protocol Docs
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                <Button variant="outline" className="w-full justify-between h-11 text-[10px] font-black uppercase tracking-widest border-border/50 hover:border-primary/50 hover:text-primary transition-all group" asChild>
                  <a href="/docs">GSM Service Protocol Specs <ExternalLink className="h-4 w-4 opacity-50 group-hover:opacity-100" /></a>
                </Button>
                <Button variant="outline" className="w-full justify-between h-11 text-[10px] font-black uppercase tracking-widest border-border/50 hover:border-primary/50 hover:text-primary transition-all group">
                  SDK Validation Registry <ExternalLink className="h-4 w-4 opacity-50 group-hover:opacity-100" />
                </Button>
              </CardContent>
            </Card>
            <div className="p-8 rounded-2xl bg-primary/5 border border-primary/20 space-y-4 shadow-glow-sm relative overflow-hidden group">
              <div className="absolute -right-6 -top-6 opacity-5 group-hover:scale-125 transition-transform duration-1000">
                <AlertCircle className="w-24 h-24 text-primary" />
              </div>
              <div className="flex items-center gap-2 text-primary relative">
                <div className="relative h-2.5 w-2.5">
                  <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-30" />
                  <div className="h-full w-full rounded-full bg-primary" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.15em]">Live Authority Pulse</span>
              </div>
              <p className="text-[11px] text-muted-foreground font-bold leading-relaxed uppercase opacity-80 relative">
                Authority consensus: <span className="text-emerald-500">NOMINAL</span>. Average validation latency: <span className="text-primary font-black">24ms</span>. Global distributed GSM clusters performing within target SLA.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}