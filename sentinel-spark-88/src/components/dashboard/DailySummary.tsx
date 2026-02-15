import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Copy, Check, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DailySummaryProps {
  summary: string;
  isLoading?: boolean;
}

export function DailySummary({ summary, isLoading }: DailySummaryProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    if (!summary) return;
    
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      toast({
        title: 'Copied!',
        description: 'Summary copied to clipboard',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: 'Failed to copy',
        description: 'Please try again',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="shadow-lg border-border/50 h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            Daily AI Summary
          </CardTitle>
          {summary && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="h-8 px-3 gap-2 hover:bg-primary/10 hover:text-primary hover:border-primary/30"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-sentinel-success" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded-full animate-pulse w-full" />
            <div className="h-4 bg-muted rounded-full animate-pulse w-5/6" />
            <div className="h-4 bg-muted rounded-full animate-pulse w-4/6" />
            <div className="h-4 bg-muted rounded-full animate-pulse w-full mt-6" />
            <div className="h-4 bg-muted rounded-full animate-pulse w-3/4" />
            <div className="h-4 bg-muted rounded-full animate-pulse w-5/6" />
          </div>
        ) : summary ? (
          <ScrollArea className="h-[280px] pr-4 -mr-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/10">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">AI Generated</span>
              </div>
              <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                {summary}
              </p>
            </div>
          </ScrollArea>
        ) : (
          <div className="py-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <p className="font-medium text-foreground">No summary generated yet</p>
            <p className="text-sm text-muted-foreground mt-1">Run AI analysis to generate insights</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
