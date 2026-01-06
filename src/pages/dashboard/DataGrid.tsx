import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Search,
  MoreHorizontal,
  Trash2,
  FileEdit,
  Layers,
  Loader2,
  ArrowRight
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import type { Item } from '@shared/types';
export function DataGrid() {
  const queryClient = useQueryClient();
  const [search, setSearch] = React.useState('');
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const { data, isLoading } = useQuery<{ items: Item[] }>({
    queryKey: ['items'],
    queryFn: () => api<{ items: Item[] }>('/api/items'),
  });
  const addMutation = useMutation({
    mutationFn: (vals: Partial<Item>) => api<Item>('/api/items', { method: 'POST', body: JSON.stringify(vals) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      setIsAddOpen(false);
      toast.success('Record synchronized');
    }
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api(`/api/items/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toast.success('Record purged');
    }
  });
  const filteredItems = data?.items?.filter(it => 
    it.title.toLowerCase().includes(search.toLowerCase()) || 
    it.category.toLowerCase().includes(search.toLowerCase())
  ) ?? [];
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input 
            placeholder="Filter registry..." 
            className="pl-9 h-10 text-xs font-medium border-border/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="btn-gradient font-black h-10 text-xs px-6 uppercase tracking-widest"><Plus className="mr-2 h-4 w-4" /> New</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-black uppercase tracking-widest">Add Resource</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              addMutation.mutate({
                title: fd.get('title') as string,
                description: fd.get('description') as string,
                category: fd.get('category') as string
              });
            }} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-[10px] uppercase font-bold text-muted-foreground">Title</Label>
                <Input id="title" name="title" required className="h-10 text-xs" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-[10px] uppercase font-bold text-muted-foreground">Category</Label>
                <Input id="category" name="category" placeholder="e.g. System" className="h-10 text-xs" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-[10px] uppercase font-bold text-muted-foreground">Description</Label>
                <Textarea id="description" name="description" className="h-24 text-xs resize-none" />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={addMutation.isPending} className="btn-gradient w-full h-11 text-xs font-black uppercase tracking-widest">
                  {addMutation.isPending ? "Syncing..." : "Commit Record"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Card className="border-border/50 overflow-hidden">
        <CardHeader className="border-b bg-muted/5 py-3 px-4">
          <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <Layers className="w-3 h-3" /> Master Registry
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-b">
                <TableHead className="text-[9px] font-black uppercase tracking-[0.15em] pl-6 h-10">Identifier</TableHead>
                <TableHead className="text-[9px] font-black uppercase tracking-[0.15em] h-10">Class</TableHead>
                <TableHead className="text-[9px] font-black uppercase tracking-[0.15em] h-10">Status</TableHead>
                <TableHead className="text-[9px] font-black uppercase tracking-[0.15em] h-10">Created</TableHead>
                <TableHead className="text-right pr-6 h-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-48 text-center">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto text-primary" />
                  </TableCell>
                </TableRow>
              ) : filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-48 text-center text-muted-foreground font-medium italic text-xs">
                    No matching registry entries found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((it) => (
                  <TableRow key={it.id} className="group hover:bg-primary/[0.02] transition-colors border-b last:border-0">
                    <TableCell className="pl-6 py-3">
                      <div className="flex flex-col">
                        <span className="font-bold text-xs group-hover:text-primary transition-colors">{it.title}</span>
                        <span className="text-[10px] text-muted-foreground font-medium truncate max-w-[240px]">{it.description}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge variant="secondary" className="text-[9px] font-black uppercase tracking-tighter bg-muted/50 text-muted-foreground border-transparent">
                        {it.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/50" />
                        <span className="text-[9px] font-black uppercase text-muted-foreground tracking-tighter">{it.status}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-[10px] font-mono font-medium text-muted-foreground py-3">
                      {format(it.createdAt, 'MMM dd, yy')}
                    </TableCell>
                    <TableCell className="text-right pr-6 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-primary/10 text-muted-foreground hover:text-primary">
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem className="text-[11px] font-bold"><FileEdit className="mr-2 h-3 w-3" /> Update Record</DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-[11px] font-bold text-destructive"
                            onClick={() => deleteMutation.mutate(it.id)}
                          >
                            <Trash2 className="mr-2 h-3 w-3" /> Purge Permanently
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}