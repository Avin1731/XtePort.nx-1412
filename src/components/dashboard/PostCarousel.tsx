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
import Link from "next/link"; // Import Link

interface PostCarouselProps {
  images: string[];
  slug?: string; // 👈 Opsional: Kalau ada slug, gambar jadi Link
  aspectRatio?: "video" | "square";
  className?: string;
}

export function PostCarousel({ images, slug, aspectRatio = "video", className }: PostCarouselProps) {
  // Autoplay 4 detik
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  if (!images || images.length === 0) return null;

  return (
    <Carousel
      plugins={[plugin.current]}
      className={`w-full max-w-full group ${className}`}
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
      opts={{ loop: true }}
    >
      <CarouselContent>
        {images.map((url, index) => (
          <CarouselItem key={index}>
            <div className={`relative w-full ${aspectRatio === "video" ? "aspect-video" : "aspect-square"} overflow-hidden rounded-xl bg-muted`}>
               {/* Jika ada SLUG, bungkus gambar dengan Link */}
               {slug ? (
                 <Link href={`/blog/${slug}`} className="block w-full h-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                        src={url} 
                        alt={`Slide ${index + 1}`} 
                        className="object-cover w-full h-full transition-transform hover:scale-105 duration-700" 
                    />
                 </Link>
               ) : (
                 // Jika tidak ada slug (halaman detail), gambar biasa
                 // eslint-disable-next-line @next/next/no-img-element
                 <img 
                    src={url} 
                    alt={`Slide ${index + 1}`} 
                    className="object-cover w-full h-full" 
                 />
               )}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      
      {/* Tombol Panah Kanan Kiri (Selalu Muncul jika > 1 gambar) */}
      {images.length > 1 && (
        <>
          <CarouselPrevious className="left-2 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
          <CarouselNext className="right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
        </>
      )}
    </Carousel>
  );
}