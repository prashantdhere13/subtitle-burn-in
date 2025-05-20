import Image from 'next/image';

interface VideoPlayerPlaceholderProps {
  currentSubtitle?: string;
  isConnected: boolean;
}

export function VideoPlayerPlaceholder({ currentSubtitle, isConnected }: VideoPlayerPlaceholderProps) {
  return (
    <div className="relative aspect-video w-full max-w-4xl mx-auto bg-black rounded-lg shadow-2xl overflow-hidden border-2 border-card">
      <Image
        src="https://placehold.co/1920x1080.png"
        alt="Video stream placeholder"
        layout="fill"
        objectFit="cover"
        data-ai-hint="broadcast television"
        priority
      />
      <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground px-3 py-1 text-sm font-bold rounded-md shadow-md">LIVE</div>
      
      {(currentSubtitle || (isConnected && !currentSubtitle)) && (
        <div 
          className="absolute bottom-0 left-0 right-0 h-[15%] p-2 md:p-4 flex items-center justify-center"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0) 100%)' }}
        >
          <p 
            className="text-lg md:text-2xl lg:text-3xl font-semibold text-center text-white"
            style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
          >
            {currentSubtitle ? currentSubtitle : (isConnected ? "Waiting for subtitles..." : "")}
          </p>
        </div>
      )}
    </div>
  );
}
