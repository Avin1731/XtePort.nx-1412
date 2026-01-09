"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface PostCarouselProps {
  images: string[];
  aspectRatio?: "video" | "square";
  className?: string;
}

export function PostCarousel({ images, aspectRatio = "video", className }: PostCarouselProps) {
  // Config Autoplay: Delay 4 detik
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  // Jika tidak ada gambar, return null atau placeholder
  if (!images || images.length === 0) return null;

  return (
    <Carousel
      plugins={[plugin.current]}
      className={`w-full max-w-full group ${className}`}
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
      opts={{
        loop: true, // Biar muter terus
      }}
    >
      <CarouselContent>
        {images.map((url, index) => (
          <CarouselItem key={index}>
            <div className={`relative w-full ${aspectRatio === "video" ? "aspect-video" : "aspect-square"} overflow-hidden rounded-xl bg-muted`}>
               {/* eslint-disable-next-line @next/next/no-img-element */}
               <img 
                 src={url} 
                 alt={`Slide ${index + 1}`} 
                 className="object-cover w-full h-full transition-transform hover:scale-105 duration-700" 
               />
               
               {/* Indikator Jumlah Gambar */}
               {images.length > 1 && (
                 <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                   {index + 1} / {images.length}
                 </div>
               )}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      
      {/* Tampilkan tombol navigasi hanya jika gambar > 1 */}
      {images.length > 1 && (
        <>
          <CarouselPrevious className="left-2 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CarouselNext className="right-2 opacity-0 group-hover:opacity-100 transition-opacity" />
        </>
      )}
    </Carousel>
  );
}