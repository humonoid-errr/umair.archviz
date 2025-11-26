
import React, { useEffect, useRef, useState } from 'react';

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Use refs for coordinates to avoid re-renders on every mouse move
  const mousePos = useRef({ x: 0, y: 0 });
  const followerPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Only enable on desktop devices (devices with a fine pointer)
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (isTouchDevice) return;

    setIsVisible(true);

    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      mousePos.current = { x: clientX, y: clientY };
      
      // Move the dot instantly, centered
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0) translate(-50%, -50%)`;
      }
    };

    const onMouseEnter = () => setIsVisible(true);
    const onMouseLeave = () => setIsVisible(false);

    // Hover detection for interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('cursor-pointer') ||
        target.closest('.cursor-pointer')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    document.body.addEventListener('mouseenter', onMouseEnter);
    document.body.addEventListener('mouseleave', onMouseLeave);
    document.body.addEventListener('mouseover', handleMouseOver);

    // Animation loop for the trailing follower
    let animationFrameId: number;
    
    const loop = () => {
      if (followerRef.current) {
        // Linear interpolation (Lerp) for smooth following effect
        // The 0.15 factor determines the "lag" or "weight" of the cursor
        followerPos.current.x += (mousePos.current.x - followerPos.current.x) * 0.15;
        followerPos.current.y += (mousePos.current.y - followerPos.current.y) * 0.15;

        // Apply position and centering transform in JS to handle dynamic sizing correctly
        followerRef.current.style.transform = `translate3d(${followerPos.current.x}px, ${followerPos.current.y}px, 0) translate(-50%, -50%)`;
      }
      animationFrameId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.body.removeEventListener('mouseenter', onMouseEnter);
      document.body.removeEventListener('mouseleave', onMouseLeave);
      document.body.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* The main pointer dot */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference will-change-transform"
      />
      
      {/* The trailing ring / frosted blob */}
      <div
        ref={followerRef}
        className={`fixed top-0 left-0 rounded-full border pointer-events-none z-[9998] mix-blend-difference will-change-transform transition-all duration-300 ease-out ${
          isHovering 
            ? 'w-20 h-20 bg-white/20 border-white/10 backdrop-blur-[2px]' 
            : 'w-8 h-8 border-white bg-transparent backdrop-blur-none'
        }`}
      />
    </>
  );
};

export default CustomCursor;
