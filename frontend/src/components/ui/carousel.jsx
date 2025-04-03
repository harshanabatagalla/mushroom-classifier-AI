import React, { useState, useEffect, useCallback, useContext, forwardRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CarouselContext = React.createContext(null);

const useCarousel = () => {
  const context = useContext(CarouselContext);
  if (!context) throw new Error("useCarousel must be used within a <Carousel />");
  return context;
};

const Carousel = forwardRef(({ orientation = "horizontal", opts, setApi, plugins, className, children, ...props }, ref) => {
  const [carouselRef, api] = useEmblaCarousel({ ...opts, axis: orientation === "horizontal" ? "x" : "y" }, plugins);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback((api) => {
    if (!api) return;
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  const scrollPrev = useCallback(() => api?.scrollPrev(), [api]);
  const scrollNext = useCallback(() => api?.scrollNext(), [api]);

  useEffect(() => {
    if (!api || !setApi) return;
    setApi(api);
  }, [api, setApi]);

  useEffect(() => {
    if (!api) return;
    onSelect(api);
    api.on("reInit", onSelect);
    api.on("select", onSelect);
    return () => api?.off("select", onSelect);
  }, [api, onSelect]);

  return (
    <CarouselContext.Provider value={{ carouselRef, scrollPrev, scrollNext, canScrollPrev, canScrollNext }}>
      <div ref={ref} className={`relative ${className}`} role="region" aria-roledescription="carousel" {...props}>
        {children}
      </div>
    </CarouselContext.Provider>
  );
});

const CarouselContent = forwardRef(({ className, ...props }, ref) => {
  const { carouselRef } = useCarousel();
  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div ref={ref} className={`flex -ml-4 ${className}`} {...props} />
    </div>
  );
});

const CarouselItem = forwardRef(({ className, ...props }, ref) => {
  return <div ref={ref} role="group" aria-roledescription="slide" className={`min-w-0 shrink-0 grow-0 basis-full pl-4 ${className}`} {...props} />;
});

const CarouselPrevious = forwardRef(({ className, ...props }, ref) => {
  const { scrollPrev, canScrollPrev } = useCarousel();
  return (
    <Button ref={ref} className={`absolute -left-12 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full ${className}`} disabled={!canScrollPrev} onClick={scrollPrev} {...props}>
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  );
});

const CarouselNext = forwardRef(({ className, ...props }, ref) => {
  const { scrollNext, canScrollNext } = useCarousel();
  return (
    <Button ref={ref} className={`absolute -right-12 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full ${className}`} disabled={!canScrollNext} onClick={scrollNext} {...props}>
      <ArrowRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  );
});

export { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext };
