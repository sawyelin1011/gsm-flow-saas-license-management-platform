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
  Search
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
      toast.success('Support signal transmitted to authority developers');
    },
    onError: (err: any) => toast.error(err?.message || 'Signal transmission failed'),
  });
  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const subject = (formData.get('subject') as string).trim();
    const message = (formData.get('message') as string).trim();
    if (subject.length < 5) return toast.error('Subject identifier must be more descriptive');
    if (message.length < 20) return toast.error('Please provide additional technical logs for diagnostic accuracy');
    createMutation.mutate({ subject, message, category });
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full max-w-xs">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
           <Input placeholder="Search technical docs..." className="pl-9 h-10 text-xs font-bold border-border/50 bg-background/50" />
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="btn-gradient w-full sm:w-auto font-black h-11 text-xs uppercase tracking-widest px-8 shadow-glow">
              <Plus className="mr-2 h-4 w-4" /> Open Support Channel
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md glass">
            <form onSubmit={handleCreate} className="space-y-6">
              <DialogHeader>
                <DialogTitle className="text-sm font-black uppercase tracking-[0.15em] flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-primary" /> Technical Signal
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
                      <SelectItem value="technical" className="text-xs font-bold py-2">Technical Protocol</SelectItem>
                      <SelectItem value="billing" className="text-xs font-bold py-2">Registry & Billing</SelectItem>
                      <SelectItem value="account" className="text-xs font-bold py-2">Operator Management</SelectItem>
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
                      Intensity: {messageLength < 20 ? 'Low' : messageLength < 100 ? 'Standard' : 'High Quality'}
                    </span>
                  </div>
                  <Textarea
                    name="message"
                    onChange={(e) => setMessageLength(e.target.value.length)}
                    placeholder="Attach relevant node error logs and stack traces..."
                    className="min-h-[140px] text-xs font-medium resize-none bg-background/50 border-border/50 leading-relaxed"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createMutation.isPending} className="btn-gradient w-full h-12 text-xs font-black uppercase tracking-widest shadow-glow">
                  {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Transmit Authorized Signal"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-border/50 pb-3">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5 text-primary" /> Active Signal Buffer
            </h2>
            <Badge variant="outline" className="text-[9px] font-black h-5 uppercase tracking-widest">{tickets?.length || 0} Registered</Badge>
          </div>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full rounded-2xl border border-border/50" />)}
            </div>
          ) : tickets?.length === 0 ? (
            <Card className="border-dashed border-border/50 py-16 text-center bg-muted/5 rounded-3xl group">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted text-muted-foreground/30 mb-4 group-hover:scale-110 transition-transform">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <p className="text-xs text-muted-foreground font-black italic uppercase tracking-[0.2em] opacity-30">No active support signals detected in registry</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {tickets?.map((ticket) => (
                <Card key={ticket.id} className="border-border/50 hover:border-primary/30 hover:bg-primary/[0.01] transition-all group rounded-2xl shadow-soft">
                  <div className="p-5 flex items-center justify-between gap-6">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[8px] font-black h-4 px-1.5 uppercase border-primary/20 bg-primary/5 text-primary tracking-tight">{ticket.category}</Badge>
                        <h3 className="font-bold text-sm uppercase group-hover:text-primary transition-colors truncate tracking-tight">{ticket.subject}</h3>
                      </div>
                      <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-mono font-bold uppercase tracking-tight">
                        <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {format(ticket.createdAt, 'MMM dd, HH:mm')}</span>
                        <span className="opacity-50">NODE_REF: {ticket.id.slice(0, 8)}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                       <Badge className={cn(
                        "text-[9px] uppercase h-5 font-black tracking-[0.1em] px-2",
                        ticket.status === 'open' ? 'bg-primary text-background' : 'bg-muted text-muted-foreground'
                      )}>
                        {ticket.status}
                      </Badge>
                      <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
        <div className="space-y-6">
          <Card className="border-border/50 bg-card shadow-soft rounded-2xl overflow-hidden">
            <CardHeader className="py-4 border-b bg-muted/5">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.15em] flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-primary" /> Authority Node Docs
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <Button variant="outline" className="w-full justify-between h-10 text-[10px] font-black uppercase tracking-widest border-border/50 hover:border-primary/50 hover:text-primary transition-all group" asChild>
                <a href="/docs">Protocol Specs <ExternalLink className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100" /></a>
              </Button>
              <Button variant="outline" className="w-full justify-between h-10 text-[10px] font-black uppercase tracking-widest border-border/50 hover:border-primary/50 hover:text-primary transition-all group">
                SDK Validation Registry <ExternalLink className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100" />
              </Button>
            </CardContent>
          </Card>
          <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 space-y-3 shadow-glow-sm relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-125 transition-transform duration-1000">
              <AlertCircle className="w-24 h-24" />
            </div>
            <div className="flex items-center gap-2 text-primary relative">
              <div className="relative h-2 w-2">
                <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-30" />
                <div className="h-full w-full rounded-full bg-primary" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.15em]">Live Edge Status</span>
            </div>
            <p className="text-[10px] text-muted-foreground font-bold leading-relaxed uppercase opacity-80 relative">
              Authority consensus: <span className="text-emerald-500">NOMINAL</span>. Average validation latency: <span className="text-primary font-black">24ms</span>. Global distributed clusters performing within target SLA.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}