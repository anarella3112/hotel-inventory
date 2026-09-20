export function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex items-center ${compact ? "gap-2" : "gap-3"}`}>
      <svg
        aria-hidden="true"
        viewBox="0 0 64 64"
        className={compact ? "h-10 w-10" : "h-14 w-14"}
        fill="none"
      >
        <path d="M9 53V22L32 7l23 15v31" stroke="#0B2D5B" strokeWidth="6" strokeLinejoin="round" />
        <path d="M19 53V35c0-5 5-8 13-8s13 3 13 8v18" stroke="#0B2D5B" strokeWidth="5" />
        <path d="M23 17h5M36 17h5M23 23h5M36 23h5" stroke="#0B2D5B" strokeWidth="4" strokeLinecap="round" />
        <rect x="42" y="22" width="17" height="24" rx="3" fill="white" stroke="#1E6BD6" strokeWidth="4" />
        <path d="m46 29 3 3 6-6M46 37l3 3 6-6" stroke="#0B2D5B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 49c13-6 25 8 56-5-9 15-36 18-56 5Z" fill="#D4AF37" />
      </svg>
      <div className={`${compact ? "hidden sm:block" : ""} leading-none`}>
        <div className={`${compact ? "text-lg" : "text-2xl"} font-extrabold tracking-tight`}>
          <span className="text-[#0B2D5B]">Innova</span><span className="text-[#D4AF37]">Hotel</span>
        </div>
        {!compact && <p className="mt-1 text-[10px] font-medium tracking-[0.16em] text-[#0B2D5B]/70">CONTROL DE INVENTARIO INTELIGENTE</p>}
      </div>
    </div>
  );
}
