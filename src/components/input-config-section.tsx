"use client";

import type { Dispatch, SetStateAction } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cable, Zap, ZapOff } from 'lucide-react';

interface InputConfigSectionProps {
  srtUrl: string;
  setSrtUrl: Dispatch<SetStateAction<string>>;
  onConnect: () => void;
  isConnected: boolean;
  isLoading: boolean;
}

export function InputConfigSection({ srtUrl, setSrtUrl, onConnect, isConnected, isLoading }: InputConfigSectionProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center">
          <Cable className="mr-3 h-6 w-6 text-primary" />
          Input Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="srtUrl" className="text-sm font-medium text-muted-foreground">
            Live SRT Stream URL
          </Label>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Input
              id="srtUrl"
              type="url"
              placeholder="srt://example.com:1234"
              value={srtUrl}
              onChange={(e) => setSrtUrl(e.target.value)}
              disabled={isConnected || isLoading}
              className="bg-background border-border focus:ring-primary placeholder:text-muted-foreground/70"
            />
            <Button 
              onClick={onConnect} 
              disabled={isLoading || !srtUrl} 
              variant={isConnected ? "outline" : "default"} 
              className={`${isConnected ? 'border-green-500 text-green-500 hover:bg-green-500/10' : 'bg-primary hover:bg-primary/90 text-primary-foreground'} w-full sm:w-auto transition-all duration-150 ease-in-out`}
            >
              {isLoading ? <Zap className="mr-2 h-4 w-4 animate-spin" /> : (isConnected ? <ZapOff className="mr-2 h-4 w-4" /> : <Zap className="mr-2 h-4 w-4" />)}
              {isLoading ? 'Connecting...' : isConnected ? 'Disconnect' : 'Connect'}
            </Button>
          </div>
        </div>
        {isLoading && <p className="text-sm text-accent animate-pulse">Attempting to connect to stream...</p>}
        {!isLoading && isConnected && <p className="text-sm text-green-400">Successfully connected to stream: {srtUrl}</p>}
        {!isLoading && !isConnected && srtUrl && <p className="text-sm text-muted-foreground">Ready to connect.</p>}
      </CardContent>
    </Card>
  );
}
