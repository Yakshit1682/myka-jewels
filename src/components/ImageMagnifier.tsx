import { type MouseEvent, useRef, useState } from "react";

type ImageMagnifierProps = {
  src: string;
  alt: string;
  zoom?: number;
};

const ImageMagnifier = ({ src, alt, zoom = 2.5 }: ImageMagnifierProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [showMagnifier, setShowMagnifier] = useState(false);

  const [position, setPosition] = useState({
    x: 0,
    y: 0,
    backgroundX: 0,
    backgroundY: 0,
  });

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;

    if (!container) return;

    const rect = container.getBoundingClientRect();

    const x = event.clientX - rect.left;

    const y = event.clientY - rect.top;

    const xPercent = (x / rect.width) * 100;

    const yPercent = (y / rect.height) * 100;

    setPosition({
      x,
      y,
      backgroundX: xPercent,
      backgroundY: yPercent,
    });
  };

  return (
    <div
      ref={containerRef}
      className="image-magnifier-container"
      onMouseEnter={() => setShowMagnifier(true)}
      onMouseLeave={() => setShowMagnifier(false)}
      onMouseMove={handleMouseMove}
    >
      <img src={src} alt={alt} className="gallery-image" />

      {showMagnifier && (
        <div
          className="image-magnifier-lens"
          style={{
            left: position.x,
            top: position.y,

            backgroundImage: `url("${src}")`,

            backgroundPosition: `${position.backgroundX}% ${position.backgroundY}%`,

            backgroundSize: `${zoom * 100}%`,
          }}
        />
      )}
    </div>
  );
};

export default ImageMagnifier;
