"use client";

interface HeaderTitleProps {
  title: string;
  subtitle?: string;
}

export default function HeaderTitle({ title, subtitle }: HeaderTitleProps) {
  return (
    <div className="flex flex-col">
      <h1 className="text-2xl text-[#65A30D] font-semibold">{title}</h1>
      {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
    </div>
  );
}
