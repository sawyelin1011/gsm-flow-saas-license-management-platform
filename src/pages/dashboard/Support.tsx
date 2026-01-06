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
  Clock
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from '@/lib/api-client';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { format } from 'date-fns';
import type { SupportTicket, SupportTicketCategory } from '@shared/types';
export function Support() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [category, setCategory] = React.useState<SupportTicketCategory>('technical');
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
      toast.success('Support request logged');
    },
    onError: (err: any) => toast.error(err?.message || 'Logging failed'),
  });
  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const subject = (formData.get('subject') as string).trim();
    const message = (formData.get('message') as string).trim();
    if (subject.length < 5) return toast.error('Subject too brief');
    if (message.length < 20) return toast.error('Detailed message required');
    createMutation.mutate({ subject, message, category });
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full max-w-xs">
           <HelpCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
           <Input placeholder="Search knowledge..." className="pl-9 h-10 text-xs border-border/50" />
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="btn-gradient w-full sm:w-auto font-black h-10 text-xs uppercase tracking-widest px-6">
              <Plus className="mr-2 h-4 w-4" /> New Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <form onSubmit={handleCreate} className="space-y-6">
              <DialogHeader>
                <DialogTitle className="text-sm font-black uppercase tracking-widest">Support Request</DialogTitle>
                <DialogDescription className="text-xs">Submit environment logs for faster resolution.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Class</Label>
                  <Select value={category} onValueChange={(val) => setCategory(val as SupportTicketCategory)}>
                    <SelectTrigger className="h-10 text-xs"><SelectValue placeholder="Select class" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical" className="text-xs">Technical Signal</SelectItem>
                      <SelectItem value="billing" className="text-xs">Billing Registry</SelectItem>
                      <SelectItem value="account" className="text-xs">Operator Account</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Identifier</Label>
                  <Input name="subject" placeholder="Brief subject" className="h-10 text-xs" required />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Context</Label>
                  <Textarea name="message" placeholder="Provide full node logs..." className="min-h-[120px] text-xs resize-none" required />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createMutation.isPending} className="btn-gradient w-full h-11 text-xs font-black uppercase tracking-widest">
                  {createMutation.isPending ? "Transmitting..." : "Log Ticket"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <MessageSquare className="w-3 h-3" /> Signal History
            </h2>
          </div>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map(i => <Skeleton key={i} className="h-20 w-full rounded-lg" />)}
            </div>
          ) : tickets?.length === 0 ? (
            <Card className="border-dashed py-12 text-center bg-muted/5">
              <p className="text-xs text-muted-foreground font-bold italic uppercase tracking-widest opacity-30">No active signals</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {tickets?.map((ticket) => (
                <Card key={ticket.id} className="border-border/50 hover:bg-primary/[0.01] transition-colors group">
                  <div className="p-4 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[8px] font-black h-4 uppercase border-border/50 text-muted-foreground">{ticket.category}</Badge>
                        <h3 className="font-bold text-xs group-hover:text-primary transition-colors">{ticket.subject}</h3>
                      </div>
                      <div className="flex items-center gap-3 text-[9px] text-muted-foreground font-mono">
                        <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> {format(ticket.createdAt, 'MMM dd, HH:mm')}</span>
                        <span className="uppercase tracking-widest">ID: {ticket.id.slice(0, 6)}</span>
                      </div>
                    </div>
                    <Badge className={cn(
                      "text-[9px] uppercase h-5 font-black",
                      ticket.status === 'open' ? 'bg-primary text-background' : 'bg-muted text-muted-foreground'
                    )}>
                      {ticket.status}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
        <div className="space-y-4">
          <Card className="border-border/50 bg-muted/5">
            <CardHeader className="py-3 border-b border-border/50">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest">Resource Node</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              <Button variant="outline" className="w-full justify-between h-9 text-[10px] font-bold uppercase tracking-widest border-border/50 hover:text-primary" asChild>
                <a href="/docs">Docs Repository <ExternalLink className="h-3 w-3" /></a>
              </Button>
              <Button variant="outline" className="w-full justify-between h-9 text-[10px] font-bold uppercase tracking-widest border-border/50 hover:text-primary">
                Protocol Specs <ExternalLink className="h-3 w-3" />
              </Button>
            </CardContent>
          </Card>
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/10 space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <AlertCircle className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Network Health</span>
            </div>
            <p className="text-[10px] text-muted-foreground font-bold leading-relaxed uppercase opacity-70">
              Average response latency: 22ms. Distributed clusters are performing within nominal parameters.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}