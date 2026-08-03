import React, { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Disable custom cursor on mobile touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsMobile(true);
      return;
    }

    const onMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'SELECT' ||
        target.closest('.group') ||
        target.closest('button') ||
        target.closest('a')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  if (isMobile) return null;

  return (
    <>
      {/* Outer Magnetic Luxury Gold Glow Ring */}
      <div
        className={`fixed top-0 left-0 pointer-events-none z-[9999] transition-transform duration-150 ease-out -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D4AF37]/60 shadow-[0_0_25px_rgba(212,175,55,0.4)] backdrop-blur-[1px] ${
          isHovered
            ? 'w-14 h-14 bg-[#D4AF37]/15 scale-125 border-2 border-[#E7C76A]'
            : isClicking
            ? 'w-8 h-8 scale-90'
            : 'w-10 h-10'
        }`}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`,
        }}
      />

      {/* Center Precision Gold Dot */}
      <div
        className={`fixed top-0 left-0 pointer-events-none z-[10000] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D4AF37] shadow-[0_0_10px_#D4AF37] transition-transform duration-75 ${
          isHovered ? 'w-3 h-3 scale-125' : 'w-2 h-2'
        }`}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`,
        }}
      />
    </>
  );
}
