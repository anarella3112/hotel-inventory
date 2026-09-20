interface TopBarProps {
  title: string;
}

export function TopBar({ title }: TopBarProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-[#e5e7eb] bg-white px-3 sm:px-6">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#D4AF37]">InnovaHotel</p>
        <h2 className="max-w-[210px] truncate text-sm font-semibold text-[#0B2D5B] sm:max-w-none sm:text-base">{title}</h2>
      </div>
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-[#edf8f1] px-2.5 py-1 text-xs font-medium text-emerald-700">
          ● En línea
        </span>
      </div>
    </header>
  );
}
