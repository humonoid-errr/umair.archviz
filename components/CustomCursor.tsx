
import React, { useEffect, useRef, useState } from 'react';

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isOverNativeInput, setIsOverNativeInput] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Use refs for coordinates to avoid re-renders on every mouse move
  const mousePos = useRef({ x: -100, y: -100 });
  const followerPos = useRef({ x: -100, y: -100 });

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

    const onMouseDown = () => setIsMouseDown(true);
    const onMouseUp = () => setIsMouseDown(false);

    const onMouseEnter = () => setIsVisible(true);
    const onMouseLeave = () => setIsVisible(false);

    // Hover detection for interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isInput = Boolean(
        target.closest('input, textarea, select, .pnlm-container, [contenteditable="true"]')
      );
      setIsOverNativeInput(isInput);

      const isInteractive = Boolean(
        target.closest(
          'a, button, [role="button"], [tabindex], .cursor-pointer, .group, [onclick]'
        ) ||
        window.getComputedStyle(target).cursor === 'pointer'
      );

      setIsHovering(isInteractive);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.body.addEventListener('mouseenter', onMouseEnter);
    document.body.addEventListener('mouseleave', onMouseLeave);
    document.body.addEventListener('mouseover', handleMouseOver);

    // Animation loop for the trailing follower with crisp 0.4 lerp factor
    let animationFrameId: number;
    
    const loop = () => {
      if (followerRef.current) {
        // Fast lerp factor (0.4) for crisp, lag-free responsiveness
        followerPos.current.x += (mousePos.current.x - followerPos.current.x) * 0.4;
        followerPos.current.y += (mousePos.current.y - followerPos.current.y) * 0.4;

        followerRef.current.style.transform = `translate3d(${followerPos.current.x}px, ${followerPos.current.y}px, 0) translate(-50%, -50%)`;
      }
      animationFrameId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.body.removeEventListener('mouseenter', onMouseEnter);
      document.body.removeEventListener('mouseleave', onMouseLeave);
      document.body.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Precision pointer dot */}
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 rounded-full bg-white pointer-events-none z-[9999] mix-blend-difference will-change-transform transition-opacity duration-150 ${
          isOverNativeInput ? 'opacity-0' : 'opacity-100'
        } ${isMouseDown ? 'w-2 h-2' : isHovering ? 'w-3 h-3' : 'w-2 h-2'}`}
      />
      
      {/* Snappy follower ring */}
      <div
        ref={followerRef}
        className={`fixed top-0 left-0 rounded-full border pointer-events-none z-[9998] mix-blend-difference will-change-transform transition-all duration-200 ease-out ${
          isOverNativeInput
            ? 'opacity-0 scale-50'
            : isMouseDown
            ? 'w-6 h-6 border-white bg-white/30 scale-90 opacity-100'
            : isHovering 
            ? 'w-10 h-10 border-white/90 bg-white/15 backdrop-blur-[1px] opacity-100' 
            : 'w-6 h-6 border-white/70 bg-transparent opacity-80'
        }`}
      />
    </>
  );
};

export default CustomCursor;
