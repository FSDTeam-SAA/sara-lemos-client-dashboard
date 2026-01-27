"use client";

interface HeaderTitleProps {
  title: string;
  subtitle?: string;
}

export default function HeaderTitle({ title, subtitle }: HeaderTitleProps) {
  return (
    <div className="flex flex-col min-w-0">
      <h1 className="text-lg sm:text-xl lg:text-2xl text-[#65A30D] font-semibold truncate">
        {title}
      </h1>
      {subtitle && (
        <p className="text-xs sm:text-sm text-gray-400 truncate">{subtitle}</p>
      )}
    </div>
  );
}
