import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Trash2, 
  FileEdit,
  Layers,
  Loader2
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
      toast.success('Record added successfully');
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
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight">Data Records</h1>
          <p className="text-sm text-muted-foreground">Manage centralized project assets and documentation.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="btn-gradient font-black h-11"><Plus className="mr-2 h-4 w-4" /> New Record</Button>
          </DialogTrigger>
          <DialogContent className="glass">
            <DialogHeader>
              <DialogTitle>Add New Resource</DialogTitle>
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
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" name="category" placeholder="e.g. Development, HR" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" className="h-24" />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={addMutation.isPending} className="btn-gradient w-full">
                  {addMutation.isPending ? "Syncing..." : "Create Record"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Card className="glass overflow-hidden">
        <CardHeader className="border-b bg-muted/5 p-4 sm:p-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" /> Registry Table
            </CardTitle>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search registry..." 
                className="pl-9 bg-background/50 h-10 text-sm font-medium" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="text-[10px] font-black uppercase tracking-widest pl-6">Title</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">Category</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">Status</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">Created</TableHead>
                <TableHead className="text-right pr-6"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                  </TableCell>
                </TableRow>
              ) : filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground font-medium italic">
                    No matching records found in registry.
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((it) => (
                  <TableRow key={it.id} className="group hover:bg-muted/10 transition-colors">
                    <TableCell className="pl-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-sm group-hover:text-primary transition-colors">{it.title}</span>
                        <span className="text-[10px] text-muted-foreground font-medium truncate max-w-[200px]">{it.description}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[9px] font-black uppercase tracking-tighter bg-primary/5 text-primary border-primary/10">
                        {it.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-glow" />
                        <span className="text-[10px] font-bold uppercase">{it.status}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-[10px] font-mono font-medium text-muted-foreground">
                      {format(it.createdAt, 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 h-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="glass">
                          <DropdownMenuItem className="text-xs font-bold"><FileEdit className="mr-2 h-3.5 w-3.5" /> Edit Record</DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-xs font-bold text-destructive"
                            onClick={() => deleteMutation.mutate(it.id)}
                          >
                            <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete Permanently
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