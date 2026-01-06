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
      api<SupportTicket>('/api/support', {
        method: 'POST',
        body: JSON.stringify(vals),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      setIsCreateOpen(false);
      toast.success('Ticket submitted successfully');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to submit ticket. Ensure all fields are filled.');
    },
  });
  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const subject = (formData.get('subject') as string).trim();
    const message = (formData.get('message') as string).trim();
    const category = formData.get('category') as SupportTicketCategory;
    if (subject.length < 5) return toast.error('Subject must be at least 5 characters');
    if (message.length < 20) return toast.error('Description must be at least 20 characters');
    createMutation.mutate({ subject, message, category });
  };
  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Support Center</h1>
          <p className="text-sm md:text-base text-muted-foreground">Need help? Create a ticket or browse our resources.</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="btn-gradient w-full sm:w-auto font-bold h-11">
              <Plus className="mr-2 h-4 w-4" /> New Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-hidden flex flex-col">
            <form onSubmit={handleCreate} className="flex flex-col h-full">
              <DialogHeader>
                <DialogTitle>Submit Support Request</DialogTitle>
                <DialogDescription>
                  Explain your issue in detail. Our team usually responds within 24 hours.
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="flex-1 px-1">
                <div className="grid gap-4 py-6">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select name="category" defaultValue="technical">
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">Technical Support</SelectItem>
                        <SelectItem value="billing">Billing & Subscription</SelectItem>
                        <SelectItem value="account">Account Access</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" name="subject" placeholder="Brief summary of the issue" className="h-11" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="message">Description</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Provide as much detail as possible (min 20 chars)..."
                      className="min-h-[120px] resize-none"
                      required
                    />
                  </div>
                </div>
              </ScrollArea>
              <DialogFooter className="gap-3 mt-4">
                <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)} className="w-full sm:w-auto">Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending} className="btn-gradient w-full sm:w-auto font-bold px-6">
                  {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit Ticket
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" /> Recent Tickets
          </h2>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
            </div>
          ) : tickets?.length === 0 ? (
            <Card className="border-dashed py-16 text-center px-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <LifeBuoy className="text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No active tickets</h3>
              <p className="text-sm text-muted-foreground mb-6">If you're having trouble, we're here to help.</p>
              <Button variant="outline" onClick={() => setIsCreateOpen(true)} className="w-full sm:w-auto">Create Your First Ticket</Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {tickets?.map((ticket) => (
                <Card key={ticket.id} className="border-border/50 hover:shadow-sm transition-all overflow-hidden group">
                  <div className="p-4 md:p-5 flex items-start justify-between gap-4">
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="capitalize text-[10px] h-5 px-1.5 shrink-0">
                          {ticket.category}
                        </Badge>
                        <h3 className="font-semibold text-sm truncate">{ticket.subject}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">{ticket.message}</p>
                      <p className="text-[10px] text-muted-foreground/60 pt-1">
                        {format(ticket.createdAt, 'MMM dd, yyyy · HH:mm')}
                      </p>
                    </div>
                    <Badge variant={ticket.status === 'open' ? 'default' : 'secondary'} className={cn(
                      "shrink-0",
                      ticket.status === 'open' ? 'bg-emerald-500 hover:bg-emerald-600' : ''
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
            <CardHeader>
              <CardTitle className="text-lg">Quick Resources</CardTitle>
              <CardDescription>Self-service help and documentation.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start bg-background h-11" asChild>
                <a href="/docs">
                  <HelpCircle className="mr-2 h-4 w-4 text-primary" /> API Documentation
                  <ExternalLink className="ml-auto h-3 w-3 opacity-50" />
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start bg-background h-11">
                <HelpCircle className="mr-2 h-4 w-4 text-primary" /> Common Error Codes
                <ExternalLink className="ml-auto h-3 w-3 opacity-50" />
              </Button>
              <Button variant="outline" className="w-full justify-start bg-background h-11">
                <HelpCircle className="mr-2 h-4 w-4 text-primary" /> Billing FAQ
                <ExternalLink className="ml-auto h-3 w-3 opacity-50" />
              </Button>
            </CardContent>
          </Card>
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">System Status</p>
              <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                All validation nodes are operational. No reported issues at this time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}