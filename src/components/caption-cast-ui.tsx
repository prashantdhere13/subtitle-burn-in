"use client";

import { useState, useEffect, useCallback } from 'react';
import { InputConfigSection } from '@/components/input-config-section';
import { StreamControlSection } from '@/components/stream-control-section';
import { SubtitleDisplaySection } from '@/components/subtitle-display-section';
import { VideoPlayerPlaceholder } from '@/components/video-player-placeholder';
import { translateSubtitles, type TranslateSubtitlesOutput } from '@/ai/flows/translate-subtitles';
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';
import { Tv } from 'lucide-react';

const MOCK_ENGLISH_SUBTITLES = [
  "Hello and welcome to the show.",
  "Today we have a very special guest.",
  "Let's give a warm welcome to Dr. Smith.",
  "Thank you for having me.",
  "The weather is quite nice today, isn't it?",
  "Indeed, a perfect day for a broadcast.",
  "We'll be discussing recent advancements in technology.",
  "Stay tuned for more exciting content.",
  "And now, a word from our sponsors.",
  "We'll be right back after the break."
];

export default function CaptionCastUI() {
  const [srtUrl, setSrtUrl] = useState<string>('srt://example.com:1234'); // Default for demo
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoadingConnection, setIsLoadingConnection] = useState<boolean>(false);
  
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  
  const [originalSubtitles, setOriginalSubtitles] = useState<string[]>([]);
  const [translatedSubtitles, setTranslatedSubtitles] = useState<string[]>([]);
  const [currentBurnInSubtitle, setCurrentBurnInSubtitle] = useState<string>('');
  
  const [isLoadingTranslation, setIsLoadingTranslation] = useState<boolean>(false);
  const [subtitleIndex, setSubtitleIndex] = useState<number>(0);

  const { toast } = useToast();

  const handleConnectToggle = useCallback(() => {
    if (isConnected) {
      // Disconnect
      setIsConnected(false);
      setIsPlaying(false);
      setOriginalSubtitles([]);
      setTranslatedSubtitles([]);
      setCurrentBurnInSubtitle('');
      setSubtitleIndex(0);
      toast({ title: "Disconnected", description: `Disconnected from ${srtUrl}` });
      return;
    }

    if (!srtUrl) {
      toast({ title: "Error", description: "SRT URL cannot be empty.", variant: "destructive" });
      return;
    }
    setIsLoadingConnection(true);
    setTimeout(() => {
      setIsConnected(true);
      setIsLoadingConnection(false);
      toast({ title: "Success", description: `Connected to ${srtUrl}` });
      setIsPlaying(true); 
    }, 1500);
  }, [srtUrl, toast, isConnected]);

  const handlePlay = () => {
    if (!isConnected) {
      toast({ title: "Error", description: "Not connected to a stream.", variant: "destructive"});
      return;
    }
    setIsPlaying(true);
    toast({ title: "Stream Control", description: "Stream resumed." });
  };

  const handlePause = () => {
    setIsPlaying(false);
    toast({ title: "Stream Control", description: "Stream paused." });
  };

  const handleStop = () => {
    setIsPlaying(false);
    // For a real "Stop", one might want to keep the connection but stop processing.
    // Here, we'll reset subtitles as if the stream ended.
    setCurrentBurnInSubtitle('');
    setSubtitleIndex(MOCK_ENGLISH_SUBTITLES.length); // Effectively stops new subtitles
    toast({ title: "Stream Control", description: "Stream stopped. To disconnect, use the 'Disconnect' button." });
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined = undefined;

    if (isConnected && isPlaying) {
      const processNextSubtitle = async () => {
        if (subtitleIndex >= MOCK_ENGLISH_SUBTITLES.length) {
          // Loop subtitles for demo, or stop
          // setSubtitleIndex(0); 
          // setOriginalSubtitles([]); 
          // setTranslatedSubtitles([]);
          // toast({ title: "Info", description: "Finished mock subtitles. Pausing."});
          // setIsPlaying(false); // Stop playing after one run
          // return;
          
          // For continuous demo, reset index and clear subtitles
          setSubtitleIndex(0);
          setOriginalSubtitles([]);
          setTranslatedSubtitles([]);
          // No early return, will process index 0 immediately
        }

        const currentSubIndex = subtitleIndex % MOCK_ENGLISH_SUBTITLES.length; // Ensure looping
        const newEngSub = MOCK_ENGLISH_SUBTITLES[currentSubIndex];
        
        setOriginalSubtitles(prev => [...prev.slice(-9), newEngSub]);
        
        setIsLoadingTranslation(true);
        try {
          const translationOutput: TranslateSubtitlesOutput = await translateSubtitles({ englishSubtitles: newEngSub });
          const newGerSub = translationOutput.germanSubtitles;
          setTranslatedSubtitles(prev => [...prev.slice(-9), newGerSub]);
          setCurrentBurnInSubtitle(newGerSub);
        } catch (error) {
          console.error("Translation error:", error);
          toast({ title: "Translation Error", description: "Failed to translate subtitles. Check console for details.", variant: "destructive" });
          setTranslatedSubtitles(prev => [...prev.slice(-9), "[Translation Failed]"]);
          setCurrentBurnInSubtitle("[Translation Failed]");
        } finally {
          setIsLoadingTranslation(false);
          setSubtitleIndex(prev => prev + 1);
        }
      };
      
      processNextSubtitle(); // Initial call for the current state
      intervalId = setInterval(processNextSubtitle, 6000); // New subtitle every 6 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isConnected, isPlaying, subtitleIndex, toast]);


  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 selection:bg-primary selection:text-primary-foreground">
      <header className="mb-8 text-center">
        <div className="flex items-center justify-center mb-2">
          <Tv className="h-10 w-10 text-primary mr-3" />
          <h1 className="text-4xl font-bold tracking-tight">CaptionCast</h1>
        </div>
        <p className="text-lg text-muted-foreground">Real-time Subtitle Translation & Broadcast Simulation</p>
      </header>

      <main className="space-y-8 max-w-6xl mx-auto">
        <InputConfigSection
          srtUrl={srtUrl}
          setSrtUrl={setSrtUrl}
          onConnect={handleConnectToggle}
          isConnected={isConnected}
          isLoading={isLoadingConnection}
        />
        
        <Separator className="my-6 bg-border/50" />

        {isConnected && (
          <div className="space-y-8">
            <VideoPlayerPlaceholder currentSubtitle={currentBurnInSubtitle} isConnected={isConnected} />
            
            <SubtitleDisplaySection
              originalSubtitles={originalSubtitles}
              translatedSubtitles={translatedSubtitles}
              isLoadingTranslation={isLoadingTranslation}
            />
            
            <Separator className="my-6 bg-border/50" />
          </div>
        )}
        
        <StreamControlSection
          isPlaying={isPlaying}
          onPlay={handlePlay}
          onPause={handlePause}
          onStop={handleStop}
          isStreamActive={isConnected}
        />
      </main>
      <footer className="mt-12 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} CaptionCast. All rights reserved.</p>
        <p>This is a demonstration application.</p>
      </footer>
    </div>
  );
}
