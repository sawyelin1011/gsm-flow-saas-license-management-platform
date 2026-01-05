import React from 'react';
import { 
  Book, 
  Code, 
  Zap, 
  Terminal, 
  Copy, 
  Check, 
  Globe,
  Lock,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
export function ApiDocs() {
  const [testKey, setTestKey] = React.useState('');
  const [testDomain, setTestDomain] = React.useState('');
  const [validationResult, setValidationResult] = React.useState<any>(null);
  const [isValidating, setIsValidating] = React.useState(false);
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);
  const handleTest = async () => {
    if (!testKey || !testDomain) return toast.error('Enter key and domain');
    setIsValidating(true);
    try {
      const res = await api('/api/validate-license', {
        method: 'POST',
        body: JSON.stringify({ key: testKey, domain: testDomain })
      });
      setValidationResult(res);
    } catch (e) {
      toast.error('Validation request failed');
    } finally {
      setIsValidating(false);
    }
  };
  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
    toast.success('Snippet copied');
  };
  const snippets = {
    curl: `curl -X POST https://api.gsmflow.com/api/validate-license \\
  -H "Content-Type: application/json" \\
  -d '{
    "key": "GF-XXXX-YYYY",
    "domain": "gsm.yourdomain.com"
  }'`,
    javascript: `const validateLicense = async (key, domain) => {
  const response = await fetch('https://api.gsmflow.com/api/validate-license', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, domain })
  });
  return await response.json();
};`
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 animate-fade-in">
      <div className="grid lg:grid-cols-[240px_1fr] gap-12">
        {/* Sidebar Nav */}
        <aside className="hidden lg:block space-y-6 sticky top-24 h-fit">
          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Documentation</h4>
            <NavGroup title="Getting Started" items={['Introduction', 'Authentication']} active="Introduction" />
            <NavGroup title="Endpoints" items={['Validate License', 'Status Checks']} active="Validate License" />
            <NavGroup title="Guides" items={['Installation', 'Best Practices']} active="" />
          </div>
        </aside>
        {/* Content */}
        <div className="space-y-16">
          <section id="introduction" className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
              <Book className="w-3 h-3" /> API VERSION 1.0
            </div>
            <h1 className="text-4xl font-display font-bold">Integrate Flow Licensing</h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
              Connect your self-hosted GSM system to our licensing authority. Protect your service by verifying installation validity in real-time.
            </p>
          </section>
          <section id="validation" className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Lock className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold">Validation Endpoint</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-mono text-sm bg-muted p-4 rounded-lg border border-border/50">
                <span className="px-2 py-0.5 rounded bg-emerald-500 text-white font-bold text-xs uppercase">POST</span>
                <span className="text-muted-foreground">/api/validate-license</span>
              </div>
              <p className="text-muted-foreground">
                This endpoint checks if a specific license key is active and authorized for the requesting domain.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="font-bold flex items-center gap-2">
                  <Terminal className="w-4 h-4" /> Implementation
                </h3>
                <div className="relative group">
                  <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="outline" size="icon" onClick={() => copyCode(snippets.curl, 'curl')}>
                      {copiedCode === 'curl' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <pre className="p-6 rounded-2xl bg-slate-950 text-slate-50 text-sm overflow-x-auto font-mono">
                    {snippets.curl}
                  </pre>
                </div>
              </div>
              <Card className="border-primary/20 bg-primary/[0.02]">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" /> API Playground
                  </CardTitle>
                  <CardDescription>Test your license key validity instantly</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase font-bold text-muted-foreground">License Key</Label>
                    <Input 
                      placeholder="GF-XXXX-XXXX" 
                      value={testKey} 
                      onChange={(e) => setTestKey(e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase font-bold text-muted-foreground">Target Domain</Label>
                    <Input 
                      placeholder="gsm.example.com" 
                      value={testDomain} 
                      onChange={(e) => setTestDomain(e.target.value)} 
                    />
                  </div>
                  <Button className="w-full btn-gradient" onClick={handleTest} disabled={isValidating}>
                    {isValidating ? "Validating..." : "Test Validation"}
                  </Button>
                  {validationResult && (
                    <div className={`mt-4 p-4 rounded-lg border text-sm font-mono ${validationResult.valid ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600' : 'bg-destructive/10 border-destructive/30 text-destructive'}`}>
                      <pre className="whitespace-pre-wrap">{JSON.stringify(validationResult, null, 2)}</pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
function NavGroup({ title, items, active }: { title: string, items: string[], active: string }) {
  return (
    <div className="space-y-1">
      <h5 className="px-2 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">{title}</h5>
      {items.map(item => (
        <Button 
          key={item} 
          variant="ghost" 
          className={`w-full justify-between h-9 px-2 text-sm hover:bg-muted ${active === item ? 'bg-muted text-primary font-semibold' : 'text-muted-foreground'}`}
        >
          {item}
          {active === item && <ChevronRight className="w-3 h-3" />}
        </Button>
      ))}
    </div>
  );
}