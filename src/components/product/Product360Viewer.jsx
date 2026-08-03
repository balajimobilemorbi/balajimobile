import React, { useState, useRef } from 'react';
import { RotateCw, Play, Pause, Compass, Video } from 'lucide-react';

export default function Product360Viewer({ frames, videoUrl, title }) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [isAutoSpinning, setIsAutoSpinning] = useState(false);
  
  const autoSpinInterval = useRef(null);

  // If videoUrl is provided, check if it's YouTube or direct video
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes('youtube.com/embed/')) return url;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1&loop=1&playlist=${match[1]}&muted=1` : null;
  };

  const youtubeEmbed = getYouTubeEmbedUrl(videoUrl);

  const frameCount = frames && frames.length > 0 ? frames.length : 1;

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX || (e.touches && e.touches[0].clientX));
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const currentX = e.clientX || (e.touches && e.touches[0].clientX);
    const diff = currentX - startX;
    if (Math.abs(diff) > 15) {
      if (diff > 0) {
        setCurrentFrame((prev) => (prev + 1) % frameCount);
      } else {
        setCurrentFrame((prev) => (prev - 1 + frameCount) % frameCount);
      }
      setStartX(currentX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const toggleAutoSpin = () => {
    if (isAutoSpinning) {
      clearInterval(autoSpinInterval.current);
      setIsAutoSpinning(false);
    } else {
      setIsAutoSpinning(true);
      autoSpinInterval.current = setInterval(() => {
        setCurrentFrame((prev) => (prev + 1) % frameCount);
      }, 200);
    }
  };

  const degree = Math.round((currentFrame / frameCount) * 360);

  return (
    <div className="relative w-full rounded-[28px] bg-[#0D1117] border border-white/[0.08] p-6 flex flex-col items-center justify-center select-none overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
      
      {/* Luxury Ambient Backdrop Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.12)_0%,transparent_75%)] pointer-events-none" />

      {/* 360 Rotation / Video Tag */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#050505]/85 border border-[#D4AF37]/40 text-[#E7C76A] text-xs font-mono backdrop-blur-md shadow-lg">
        {videoUrl ? <Video className="w-3.5 h-3.5 text-[#0FAE72]" /> : <RotateCw className="w-3.5 h-3.5 text-[#D4AF37]" />}
        <span className="font-bold">{videoUrl ? '360° VIDEO INSPECTION' : `360° INTERACTIVE INSPECTION (${degree}°)`}</span>
      </div>

      {/* 360 Video Player Mode */}
      {videoUrl ? (
        <div className="w-full h-84 sm:h-96 flex items-center justify-center py-4 z-10 relative rounded-2xl overflow-hidden">
          {youtubeEmbed ? (
            <iframe
              title={`${title} 360 Video`}
              src={youtubeEmbed}
              className="w-full h-full rounded-2xl border border-white/[0.08]"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          ) : (
            <video
              src={videoUrl}
              autoPlay
              loop
              muted
              playsInline
              controls
              className="max-h-full max-w-full rounded-2xl border border-white/[0.08] shadow-2xl object-contain"
            />
          )}
        </div>
      ) : (
        /* 360 Image Rotation Frame Spinner Mode */
        <div 
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
          className="w-full h-80 flex items-center justify-center cursor-grab active:cursor-grabbing py-6 z-10"
        >
          <img 
            src={frames[currentFrame] || frames[0]} 
            alt={`${title} 360 view frame ${currentFrame}`} 
            className="max-h-full max-w-full object-contain filter drop-shadow-[0_25px_40px_rgba(0,0,0,0.9)] transition-all transform group-hover:scale-105"
          />
        </div>
      )}

      {/* Helper Footer Bar */}
      <div className="flex items-center gap-4 text-xs text-[#B8BDC8] font-mono pt-4 border-t border-white/[0.08] w-full justify-between z-10">
        <span className="flex items-center gap-1.5">
          <Compass className="w-4 h-4 text-[#0FAE72]" />
          <span>{videoUrl ? 'Interactive 360° video unboxing & finish inspection' : 'Drag left or right to inspect phone finish'}</span>
        </span>

        {!videoUrl && (
          <button 
            onClick={toggleAutoSpin}
            className="px-3.5 py-1.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-[#F8F8F8] hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition flex items-center gap-1.5 text-xs shadow-sm"
          >
            {isAutoSpinning ? <Pause className="w-3.5 h-3.5 text-[#D4AF37]" /> : <Play className="w-3.5 h-3.5 text-[#0FAE72]" />}
            <span>{isAutoSpinning ? 'Pause Rotation' : 'Auto Rotate'}</span>
          </button>
        )}
      </div>

    </div>
  );
}
