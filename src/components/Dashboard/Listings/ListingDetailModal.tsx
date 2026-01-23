"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Listing } from "@/lib/services/listingService";
import { Badge } from "@/components/ui/badge";
import {
  Anchor,
  Calendar,
  Fullscreen,
  Gauge,
  MapPin,
  Users,
  Wind,
  Bed,
  Bath,
  Ship,
  Hammer,
  CircleDollarSign,
  LucideIcon,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ListingDetailModalProps {
  listing: Listing | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ListingDetailModal({
  listing,
  isOpen,
  onClose,
}: ListingDetailModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Reset active image index when the modal opens
  // Using the "adjusting state during render" pattern to avoid cascading renders
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setActiveImageIndex(0);
    } else {
      setMounted(false);
    }
  }

  useEffect(() => {
    if (isOpen) {
      // Use a small delay for the entrance animation to ensure it's triggered after the initial render
      const timer = setTimeout(() => setMounted(true), 10);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!listing) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const images =
    listing.images && listing.images.length > 0
      ? listing.images
      : ["https://placehold.co/800x600?text=No+Listing+Images"];

  const nextImage = () =>
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] md:max-w-6xl p-0 overflow-hidden border-none bg-transparent shadow-2xl">
        {/* Main Wrapper with Glassmorphism */}
        <div
          className={cn(
            "relative w-full h-full max-h-[95vh] overflow-y-auto bg-white/95 backdrop-blur-xl rounded-2xl flex flex-col md:flex-row transition-all duration-500",
            mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
          )}
        >
          {/* Left Side: Visuals & Gallery */}
          <div className="w-full md:w-[55%] relative flex flex-col bg-gray-900 overflow-hidden">
            {/* Main Image Viewport */}
            <div className="relative flex-1 group bg-black flex items-center justify-center min-h-[400px]">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity" />

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[activeImageIndex]}
                alt={listing.yachtName}
                className="w-full h-full object-contain relative z-0 transition-transform duration-700 scale-[1.02] group-hover:scale-100"
              />

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md text-white border border-white/10 hover:bg-[#65A30D] transition-all hover:scale-110 opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md text-white border border-white/10 hover:bg-[#65A30D] transition-all hover:scale-110 opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-6 left-6 z-20 px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 text-white text-xs font-medium tracking-wide">
                IMAGE {activeImageIndex + 1} OF {images.length}
              </div>
            </div>

            {/* Thumbnail Ribbon */}
            {images.length > 1 && (
              <div className="h-24 bg-black/90 p-3 flex gap-3 overflow-x-auto scrollbar-hide border-t border-white/5">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={cn(
                      "relative h-full aspect-video rounded-md overflow-hidden transition-all duration-300 flex-shrink-0 border-2",
                      activeImageIndex === idx
                        ? "border-[#65A30D] scale-105"
                        : "border-transparent opacity-50 hover:opacity-100",
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Side: Content & Action */}
          <div className="w-full md:w-[45%] flex flex-col p-6 md:p-8 overflow-y-auto">
            {/* Header Area */}
            <div className="flex flex-col gap-2 mb-6">
              <div className="flex items-start justify-between">
                <Badge
                  variant="outline"
                  className="border-[#65A30D] text-[#65A30D] bg-[#65A30D]/5 rounded-full px-3 py-0.5 animate-in fade-in slide-in-from-left duration-700"
                >
                  {listing.yachtType}
                </Badge>
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-2.5 h-2.5 rounded-full animate-pulse",
                      listing.isActive ? "bg-[#65A30D]" : "bg-gray-400",
                    )}
                  />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    {listing.isActive ? "Online" : "Offline"}
                  </span>
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                {listing.yachtName}
              </h2>
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <MapPin size={16} className="text-[#65A30D]" />
                <span className="font-medium">{listing.location}</span>
              </div>
            </div>

            {/* Price Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#65A30D] to-[#4d7c0f] p-6 text-white mb-8 shadow-xl shadow-[#65A30D]/20 transition-transform hover:scale-[1.02] duration-300">
              <div className="absolute -right-4 -top-4 opacity-20 transform rotate-12">
                <CircleDollarSign size={120} />
              </div>
              <div className="relative z-10">
                <span className="text-xs uppercase font-black tracking-[0.2em] opacity-80 mb-1 block">
                  Asking Price
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black">
                    {formatPrice(listing.Price)}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <QuickStat
                Icon={Calendar}
                label="Year"
                value={listing.yearBuilt}
                color="orange"
              />
              <QuickStat
                Icon={Gauge}
                label="Gross Tons"
                value={listing.grossTons}
                color="blue"
              />
              <QuickStat
                Icon={Anchor}
                label="Builder"
                value={listing.builder}
                color="purple"
              />
              <QuickStat
                Icon={Zap}
                label="Model"
                value={listing.model}
                color="green"
              />
            </div>

            {/* Tabbed Info or Grouped Cards */}
            <div className="space-y-6">
              <SectionHeader Icon={Sparkles} label="Interior & Comfort" />
              <div className="grid grid-cols-3 gap-3">
                <LuxurySpec
                  Icon={Users}
                  label="Guests"
                  value={listing.guestCapacity}
                />
                <LuxurySpec
                  Icon={Bed}
                  label="Bedrooms"
                  value={listing.bedRooms}
                />
                <LuxurySpec
                  Icon={Bath}
                  label="Bathrooms"
                  value={listing.bathRooms}
                />
                <LuxurySpec Icon={Ship} label="Cabins" value={listing.cabins} />
                <LuxurySpec Icon={Users} label="Crew" value={listing.crew} />
                <LuxurySpec
                  Icon={Users}
                  label="Daily Guests"
                  value={listing.guests}
                />
              </div>

              <SectionHeader Icon={Fullscreen} label="Technical Dimensions" />
              <div className="space-y-3">
                <DimensionBar
                  label="Length Overall"
                  value={listing.lengthOverall.value}
                  unit={listing.lengthOverall.unit}
                />
                <DimensionBar
                  label="Beam (Width)"
                  value={listing.beam.value}
                  unit={listing.beam.unit}
                />
                <DimensionBar
                  label="Draft (Dept)"
                  value={listing.draft.value}
                  unit={listing.draft.unit}
                />
              </div>

              <SectionHeader Icon={Hammer} label="Construction & Material" />
              <div className="flex flex-wrap gap-2">
                {listing.constructions &&
                  Object.entries(listing.constructions).map(
                    ([key, value]) =>
                      value && (
                        <Badge
                          key={key}
                          className="bg-white hover:bg-white text-gray-800 border-gray-100 shadow-sm py-2 px-4 rounded-xl text-sm font-semibold transition-all hover:shadow-md hover:border-[#65A30D]"
                        >
                          {key}
                        </Badge>
                      ),
                  )}
              </div>

              <SectionHeader Icon={Wind} label="Description" />
              <div className="p-4 bg-gray-50 rounded-2xl text-gray-600 text-sm leading-relaxed border border-gray-100 italic">
                {listing.description ||
                  "Indulge in the finest maritime craftsmanship. This vessel offers an unparalleled experience of luxury and performance."}
              </div>
            </div>

            {/* Footer / Engine Details */}
            <div className="mt-auto pt-8 border-t border-gray-100">
              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm text-[#65A30D]">
                  <Wind size={24} />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                    Engineering Powerhouse
                  </span>
                  <p className="text-sm font-bold text-gray-800">
                    {listing.engineMake} {listing.engineModel}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* <button
            onClick={onClose}
            className="absolute top-6 right-6 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 text-gray-500 hover:text-gray-900 transition-all backdrop-blur-md cursor-pointer"
          >
            <X size={20} />
          </button> */}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Sub-components for cleaner code
function QuickStat({
  Icon,
  label,
  value,
  color,
}: {
  Icon: LucideIcon;
  label: string;
  value: string | number;
  color: string;
}) {
  const colors: Record<string, string> = {
    orange: "text-orange-500 bg-orange-50",
    blue: "text-blue-500 bg-blue-50",
    purple: "text-purple-500 bg-purple-50",
    green: "text-[#65A30D] bg-[#65A30D]/5",
  };

  return (
    <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform",
          colors[color],
        )}
      >
        <Icon size={20} />
      </div>
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">
        {label}
      </p>
      <p className="text-sm font-extrabold text-gray-900 truncate">{value}</p>
    </div>
  );
}

function LuxurySpec({
  Icon,
  label,
  value,
}: {
  Icon: LucideIcon;
  label: string;
  value: number;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-gray-100 hover:border-[#65A30D]/30 transition-all hover:bg-[#65A30D]/[0.02] group">
      <Icon
        size={16}
        className="text-gray-400 group-hover:text-[#65A30D] transition-colors mb-2"
      />
      <span className="text-lg font-black text-gray-900">{value}</span>
      <span className="text-[8px] font-black uppercase text-gray-400 tracking-widest text-center">
        {label}
      </span>
    </div>
  );
}

function SectionHeader({ Icon, label }: { Icon: LucideIcon; label: string }) {
  return (
    <div className="flex items-center gap-2 py-2">
      <div className="w-6 h-6 rounded-md bg-[#65A30D]/10 flex items-center justify-center text-[#65A30D]">
        <Icon size={14} />
      </div>
      <h3 className="text-xs font-black uppercase tracking-[0.15em] text-gray-800">
        {label}
      </h3>
    </div>
  );
}

function DimensionBar({
  label,
  value,
  unit,
}: {
  label: string;
  value: number;
  unit: string;
}) {
  return (
    <div className="group flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 border border-transparent hover:border-gray-200 hover:bg-white hover:shadow-sm transition-all duration-300">
      <span className="text-sm font-semibold text-gray-500 group-hover:text-gray-900 transition-colors uppercase tracking-tight">
        {label}
      </span>
      <div className="flex items-baseline gap-1">
        <span className="text-lg font-black text-gray-900">{value}</span>
        <span className="text-[10px] font-black text-[#65A30D]">{unit}</span>
      </div>
    </div>
  );
}
