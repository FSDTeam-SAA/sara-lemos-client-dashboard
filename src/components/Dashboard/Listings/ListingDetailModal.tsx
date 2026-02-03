"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Listing } from "@/lib/services/listingService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Download,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { toast } from "sonner";
import { useRef } from "react";
import NextImage from "next/image";

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
  const [isDownloading, setIsDownloading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const pdfRef = useRef<HTMLDivElement>(null);

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

  const handleDownloadPDF = async () => {
    if (!listing || !pdfRef.current) return;

    setIsDownloading(true);
    try {
      // Small delay to ensure hidden template is ready even if it's off-screen
      await new Promise((resolve) => setTimeout(resolve, 100));

      const dataUrl = await toPng(pdfRef.current, {
        quality: 1,
        pixelRatio: 3, // Ultra-high quality for professional PDF
        backgroundColor: "#ffffff",
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4 portrait width
      const pageHeight = 297; // A4 portrait height

      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const imgHeight = (img.height * imgWidth) / img.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(dataUrl, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add subsequent pages if content overflows
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(dataUrl, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(
        `listing-${listing.yachtName.replace(/\s+/g, "-").toLowerCase()}-${listing._id.substring(0, 8)}.pdf`,
      );
      toast.success("Professional PDF Brochure generated!");
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

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
          ref={contentRef}
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
            <div className="relative overflow-hidden rounded-2xl bg-[#F0F6E7] p-8 mb-8 border border-[#65A30D]/30">
              {/* Background Icon */}
              <div className="absolute -right-6 -top-6 opacity-10 rotate-12 text-[#65A30D]">
                <CircleDollarSign size={120} />
              </div>

              {/* Content */}
              <div className="relative z-10 flex items-center justify-between -mt-4">
                {/* Left */}
                <div>
                  <span className="text-xs uppercase font-black tracking-[0.2em] text-[#65A30D] block mb-1">
                    Asking Price
                  </span>
                  <span className="text-sm text-gray-500">Total amount</span>
                </div>

                {/* Right */}
                <div className="text-right">
                  <span className="text-xl font-black text-[#0B3B36] leading-none">
                    {formatPrice(listing.Price)}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Specs Grid */}
            <h2 className="text-2xl font-bold mb-4">Main Specifications</h2>

            <div className="grid grid-cols-2 gap-4 mb-8">
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
            </div>

            {/* Tabbed Info or Grouped Cards */}
            <div className="space-y-6">
              <SectionHeader Icon={Sparkles} label="Interior & Comfort" />
              <div className="grid grid-cols-3 gap-3">
                <LuxurySpec Icon={Ship} label="Cabins" value={listing.cabins} />
                <LuxurySpec
                  Icon={Bath}
                  label="Bathrooms"
                  value={listing.bathRooms}
                />
                <LuxurySpec
                  Icon={Users}
                  label="Guests"
                  value={listing.guestCapacity}
                />

                <LuxurySpec Icon={Users} label="Crew" value={listing.crew} />

                {/* <LuxurySpec
                  Icon={Bed}
                  label="Bedrooms"
                  value={listing.bedRooms}
                /> */}

                {/* <LuxurySpec
                  Icon={Users}
                  label="Daily Guests"
                  value={listing.guests}
                /> */}
              </div>
              <SectionHeader Icon={Wind} label="Description" />
              <div className="p-4 bg-gray-50 rounded-2xl text-gray-600 text-sm leading-relaxed border border-gray-100 italic">
                {listing.description ||
                  "Indulge in the finest maritime craftsmanship. This vessel offers an unparalleled experience of luxury and performance."}
              </div>

              {/* Footer / Engine Details */}
              <div className="mt-auto border-t border-gray-100">
                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
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
            </div>

            {/* Download Button */}
            <div className="mt-6" data-html2canvas-ignore>
              <Button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="w-full bg-[#65A30D] hover:bg-[#5a8f0c] text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isDownloading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Mail size={18} />
                    Send Email
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* <button
            onClick={onClose}
            className="absolute top-6 right-6 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 text-gray-500 hover:text-gray-900 transition-all backdrop-blur-md cursor-pointer"
          >
            <X size={20} />
          </button> */}
        </div>

        {/* ============================================================ */}
        {/* HIDDEN PDF TEMPLATE - Professional Brochure Layout           */}
        {/* ============================================================ */}
        <div className="absolute left-[-9999px] top-0 pointer-events-none">
          <div
            ref={pdfRef}
            className="w-[800px] bg-white p-10 font-sans text-gray-900"
            style={{ minHeight: "1130px" }} // A4 ratio approximately
          >
            {/* Brochure Header */}
            <div className="flex justify-between items-start border-b-2 border-[#65A30D] pb-6 mb-8">
              <div>
                <h1 className="text-4xl font-extrabold text-gray-900 mb-1 leading-tight">
                  {listing.yachtName}
                </h1>
                <div className="flex items-center gap-3 mt-2">
                  <Badge className="bg-[#65A30D] text-white hover:bg-[#65A30D] rounded-full px-4 py-1 text-sm font-bold">
                    {listing.yachtType}
                  </Badge>
                  <span className="text-gray-500 font-semibold tracking-wide uppercase text-xs border-l pl-3 border-gray-200">
                    {listing.yearBuilt} • {listing.builder}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                  Asking Price
                </span>
                <span className="text-3xl font-black text-[#65A30D]">
                  {formatPrice(listing.Price)}
                </span>
              </div>
            </div>

            {/* Hero Image Section */}
            <div className="mb-10 rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
              <img
                src={images[0]}
                alt="Main"
                className="w-full h-[450px] object-cover"
              />
            </div>

            {/* Main Details Grid */}
            <div className="grid grid-cols-3 gap-6 mb-10">
              <div className="col-span-2 space-y-8">
                {/* Specs Section */}
                <div>
                  <SectionHeader Icon={Zap} label="Key Specifications" />
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <PaperSpec label="Model" value={listing.model} />
                    <PaperSpec label="Builder" value={listing.builder} />
                    <PaperSpec label="Year" value={listing.yearBuilt} />
                    <PaperSpec label="Location" value={listing.location} />
                    <PaperSpec label="Gross Tons" value={listing.grossTons} />
                    <PaperSpec
                      label="Engine"
                      value={`${listing.engineMake} ${listing.engineModel}`}
                    />
                  </div>
                </div>

                {/* Dimensions Section */}
                <div className="">
                  <SectionHeader
                    Icon={Fullscreen}
                    label="Technical Dimensions"
                  />
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <PaperStat
                      label="Length"
                      value={`${listing.lengthOverall.value} ${listing.lengthOverall.unit}`}
                    />
                    <PaperStat
                      label="Beam"
                      value={`${listing.beam.value} ${listing.beam.unit}`}
                    />
                    <PaperStat
                      label="Draft"
                      value={`${listing.draft.value} ${listing.draft.unit}`}
                    />
                  </div>
                </div>

                {/* Accommodations Section */}
                <div className="mt-20">
                  <SectionHeader Icon={Users} label="Accommodations" />
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <PaperSpec label="Guests" value={listing.guestCapacity} />
                    <PaperSpec label="Daily" value={listing.guests} />
                    <PaperSpec label="Crew" value={listing.crew} />
                    <PaperSpec label="Cabins" value={listing.cabins} />
                    <PaperSpec label="Bedrooms" value={listing.bedRooms} />
                    <PaperSpec label="Bathrooms" value={listing.bathRooms} />
                  </div>
                </div>
              </div>

              {/* Sidebar Info */}
              <div className="space-y-8 pl-6 border-l border-gray-100">
                {/* Constructions */}
                <div>
                  <SectionHeader Icon={Hammer} label="Construction" />
                  <div className="flex flex-wrap gap-2 mt-4">
                    {Object.entries(listing.constructions).map(
                      ([key, val]) =>
                        val && (
                          <span
                            key={key}
                            className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider"
                          >
                            {key}
                          </span>
                        ),
                    )}
                  </div>
                </div>

                {/* Status Card */}
                <div className="bg-[#65A30D0D] p-5 rounded-2xl border border-[#65A30D20]">
                  <span className="block text-[10px] font-black text-[#65A30D] uppercase tracking-widest mb-3">
                    Vessel Status
                  </span>
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full",
                        listing.isActive ? "bg-[#65A30D]" : "bg-gray-400",
                      )}
                    />
                    <span className="text-sm font-bold text-gray-800">
                      {listing.isActive ? "Available for Sale" : "Off Market"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Full Width Description */}
            <div className="mb-10 p-8 bg-gray-50 rounded-3xl border border-gray-100 italic text-gray-600 leading-relaxed text-sm">
              <SectionHeader Icon={Wind} label="Vessel Description" />
              <div className="mt-4">
                {listing.description ||
                  "Indulge in the finest maritime craftsmanship. This vessel offers an unparalleled experience of luxury and performance."}
              </div>
            </div>

            {/* Image Gallery Grid */}
            <div>
              <SectionHeader Icon={Sparkles} label="Complete Vessel Gallery" />
              <div className="grid grid-cols-2 gap-4 mt-6">
                {images.slice(0, 4).map((img, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl overflow-hidden h-64 border border-gray-100 shadow-md"
                  >
                    <NextImage
                      src={img}
                      alt={`Gallery ${idx}`}
                      className="w-full h-full object-cover"
                      width={400}
                      height={256}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Information */}
            <div className="mt-12 pt-8 border-t border-gray-100 text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">
                Lime Pitch Luxury Yacht Management • Product Specification Sheet
              </p>
            </div>
          </div>
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
}: Readonly<{
  Icon: LucideIcon;
  label: string;
  value: string | number;
  color: string;
}>) {
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
}: Readonly<{
  Icon: LucideIcon;
  label: string;
  value: number;
}>) {
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

function SectionHeader({
  Icon,
  label,
}: Readonly<{ Icon: LucideIcon; label: string }>) {
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
}: Readonly<{
  label: string;
  value: number;
  unit: string;
}>) {
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

// Sub-components for PDF Template (Print-optimized)
function PaperSpec({
  label,
  value,
}: Readonly<{
  label: string;
  value: string | number;
}>) {
  return (
    <div className="flex flex-col gap-1 py-1">
      <span className="text-[10px] font-black uppercase text-[#65A30D] tracking-widest opacity-70">
        {label}
      </span>
      <span className="text-sm font-bold text-gray-800 leading-tight">
        {value || "N/A"}
      </span>
    </div>
  );
}

function PaperStat({
  label,
  value,
}: Readonly<{ label: string; value: string }>) {
  return (
    <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl text-center">
      <span className="block text-[9px] font-black uppercase text-gray-400 tracking-[0.2em] mb-2">
        {label}
      </span>
      <span className="text-lg font-black text-gray-900">{value}</span>
    </div>
  );
}
