import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  LifeBuoy,
  Plus,
  MessageSquare,
  HelpCircle,
  ExternalLink,
  Loader2,
  AlertCircle
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
      toast.success('Ticket submitted');
    },
    onError: (err: any) => toast.error(err?.message || 'Submission failed'),
  });
  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const subject = (formData.get('subject') as string).trim();
    const message = (formData.get('message') as string).trim();
    const category = formData.get('category') as SupportTicketCategory;
    if (subject.length < 5 || message.length < 20) return toast.error('Check field lengths');
    createMutation.mutate({ subject, message, category });
  };
  return (
    <div className="space-y-6 md:space-y-8 max-w-full overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Support Center</h1>
          <p className="text-sm text-muted-foreground font-medium">Get assistance with your licensing node clusters.</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="btn-gradient w-full sm:w-auto font-bold h-11">
              <Plus className="mr-2 h-4 w-4" /> Create Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] w-[95vw] rounded-2xl glass">
            <form onSubmit={handleCreate} className="space-y-6">
              <DialogHeader>
                <DialogTitle>Submit Support Request</DialogTitle>
                <DialogDescription>Describe the technical or billing issue you're facing.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select name="category" defaultValue="technical">
                    <SelectTrigger className="h-10"><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical Support</SelectItem>
                      <SelectItem value="billing">Billing & Invoices</SelectItem>
                      <SelectItem value="account">Account Access</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" name="subject" placeholder="Summary of issue" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="message">Details</Label>
                  <Textarea id="message" name="message" placeholder="Provide environment logs if possible..." className="min-h-[120px]" required />
                </div>
              </div>
              <DialogFooter className="flex-col sm:flex-row gap-3">
                <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending} className="btn-gradient font-bold">
                  {createMutation.isPending ? "Sending..." : "Submit Ticket"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" /> Recent History
          </h2>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
            </div>
          ) : tickets?.length === 0 ? (
            <Card className="border-dashed py-12 text-center px-4 bg-muted/5">
              <LifeBuoy className="text-muted-foreground w-10 h-10 mx-auto mb-4 opacity-30" />
              <h3 className="font-bold">No active tickets</h3>
              <p className="text-xs text-muted-foreground mb-6">Need expert help? We're available 24/7.</p>
              <Button variant="outline" size="sm" onClick={() => setIsCreateOpen(true)}>Create Ticket</Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              {tickets?.map((ticket) => (
                <Card key={ticket.id} className="border-border/50 hover:border-primary/50 transition-all overflow-hidden">
                  <div className="p-4 flex items-start justify-between gap-4">
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-[9px] font-black h-5 uppercase px-1.5">{ticket.category}</Badge>
                        <h3 className="font-bold text-sm truncate">{ticket.subject}</h3>
                      </div>
                      <p className="text-[10px] text-muted-foreground/80 pt-1">
                        {format(ticket.createdAt, 'MMM dd, yyyy · HH:mm')}
                      </p>
                    </div>
                    <Badge variant={ticket.status === 'open' ? 'default' : 'secondary'} className={cn(
                      "text-[9px] uppercase",
                      ticket.status === 'open' ? 'bg-emerald-500' : ''
                    )}>
                      {ticket.status}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
        <div className="space-y-6">
          <Card className="border-primary/20 bg-primary/[0.02] shadow-sm">
            <CardHeader className="p-4 sm:p-6 border-b">
              <CardTitle className="text-base">System Knowledge</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              <Button variant="outline" className="w-full justify-between h-10 text-xs font-bold bg-background" asChild>
                <a href="/docs">Documentation <ExternalLink className="h-3 w-3" /></a>
              </Button>
              <Button variant="outline" className="w-full justify-between h-10 text-xs font-bold bg-background">
                Error Codes <ExternalLink className="h-3 w-3" />
              </Button>
              <Button variant="outline" className="w-full justify-between h-10 text-xs font-bold bg-background">
                Billing FAQ <ExternalLink className="h-3 w-3" />
              </Button>
            </CardContent>
          </Card>
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-amber-900 dark:text-amber-100">Global Signal Status</p>
              <p className="text-[10px] text-amber-700 dark:text-amber-300 leading-relaxed">
                Authority nodes are online. Average validation latency: 42ms.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}