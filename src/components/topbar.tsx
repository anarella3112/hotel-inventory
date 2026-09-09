interface TopBarProps {
  title: string;
}

export function TopBar({ title }: TopBarProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-zinc-200 bg-white px-6">
      <h2 className="text-base font-semibold text-zinc-900">{title}</h2>
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
          ● En línea
        </span>
      </div>
    </header>
  );
}