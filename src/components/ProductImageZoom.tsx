import { type MouseEvent, useRef, useState } from "react";

type ProductImageZoomProps = {
  src: string;
  alt: string;
};

const ProductImageZoom = ({ src, alt }: ProductImageZoomProps) => {
  const imageRef = useRef<HTMLDivElement>(null);

  const [showZoom, setShowZoom] = useState(false);

  const [position, setPosition] = useState({
    xPercent: 50,
    yPercent: 50,

    lensX: 0,
    lensY: 0,
  });

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const container = imageRef.current;

    if (!container) return;

    const rect = container.getBoundingClientRect();

    const x = event.clientX - rect.left;

    const y = event.clientY - rect.top;

    const xPercent = Math.max(0, Math.min(100, (x / rect.width) * 100));

    const yPercent = Math.max(0, Math.min(100, (y / rect.height) * 100));

    setPosition({
      xPercent,
      yPercent,
      lensX: x,
      lensY: y,
    });
  };

  return (
    <div className="product-zoom-layout">
      <div
        ref={imageRef}
        className="product-zoom-image"
        onMouseEnter={() => setShowZoom(true)}
        onMouseLeave={() => setShowZoom(false)}
        onMouseMove={handleMouseMove}
      >
        <img src={src} alt={alt} />

        {showZoom && (
          <div
            className="product-zoom-lens"
            style={{
              left: position.lensX,

              top: position.lensY,
            }}
          />
        )}
      </div>

      {showZoom && (
        <div
          className="product-zoom-result"
          style={{
            backgroundImage: `url("${src}")`,

            backgroundPosition: `${position.xPercent}% ${position.yPercent}%`,

            backgroundSize: "220%",
          }}
        />
      )}
    </div>
  );
};

export default ProductImageZoom;
