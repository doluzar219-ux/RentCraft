/* Hand-crafted 2D flat-vector illustration for the RentCraft hero —
   cozy modern house, floating digital lease with verified seal,
   smart ID card, plants and sparkles. Pure SVG, fully responsive. */

function Star({ x, y, s = 1, fill = "#EFA670", className = "" }: { x: number; y: number; s?: number; fill?: string; className?: string }) {
  return (
    <path
      className={className}
      transform={`translate(${x} ${y}) scale(${s})`}
      d="M0 -10 C 1.5 -3.5, 3.5 -1.5, 10 0 C 3.5 1.5, 1.5 3.5, 0 10 C -1.5 3.5, -3.5 1.5, -10 0 C -3.5 -1.5, -1.5 -3.5, 0 -10 Z"
      fill={fill}
    />
  );
}

export default function HeroArt() {
  return (
    <svg
      viewBox="0 0 640 560"
      className="h-auto w-full drop-shadow-[0_30px_50px_rgba(221,107,32,0.10)]"
      role="img"
      aria-label="Illustration of a cozy house with a floating digital lease agreement, verified badge and smart ID card"
    >
      {/* ── backdrop blobs ── */}
      <path
        d="M318 54 C 470 30 588 132 596 262 C 604 392 512 514 356 532 C 200 550 66 478 46 344 C 26 210 166 78 318 54 Z"
        fill="#FBE5D2"
        opacity="0.65"
      />
      <path
        d="M150 120 C 220 70 330 84 356 160 C 382 236 330 300 240 306 C 150 312 84 250 96 184 C 101.4 154.6 122 134 150 120 Z"
        fill="#DCEAE1"
        opacity="0.45"
      />

      {/* ── sun ── */}
      <g style={{ transformOrigin: "534px 96px" }} className="animate-spin-slower">
        <circle cx="534" cy="96" r="52" fill="none" stroke="#EFA670" strokeWidth="5" strokeLinecap="round" strokeDasharray="1 16" opacity="0.9" />
      </g>
      <circle cx="534" cy="96" r="30" fill="#EFA670" />
      <circle cx="534" cy="96" r="30" fill="url(#sunGlow)" />

      {/* ── clouds ── */}
      <g className="animate-drift" opacity="0.95">
        <ellipse cx="150" cy="120" rx="46" ry="22" fill="#fff" />
        <ellipse cx="186" cy="112" rx="30" ry="18" fill="#fff" />
        <ellipse cx="118" cy="112" rx="24" ry="15" fill="#fff" />
      </g>
      <g className="animate-drift [animation-delay:-6s]" opacity="0.8">
        <ellipse cx="408" cy="66" rx="34" ry="15" fill="#fff" />
        <ellipse cx="434" cy="60" rx="22" ry="12" fill="#fff" />
      </g>

      {/* ── ground ── */}
      <ellipse cx="252" cy="486" rx="196" ry="20" fill="#1A202C" opacity="0.05" />
      <path d="M52 506 H 588" stroke="#F6C9A4" strokeWidth="5" strokeLinecap="round" strokeDasharray="0.5 14" opacity="0.9" />

      {/* ── HOUSE ── */}
      <g>
        {/* chimney + smoke */}
        <rect x="146" y="188" width="30" height="58" rx="7" fill="#A24515" />
        <rect x="140" y="182" width="42" height="14" rx="7" fill="#7D3512" />
        <g fill="#fff" opacity="0.9">
          <circle cx="162" cy="168" r="8" className="animate-float [animation-delay:-1s]" />
          <circle cx="172" cy="150" r="6" className="animate-float [animation-delay:-2.4s]" />
          <circle cx="166" cy="132" r="4.5" className="animate-float [animation-delay:-3.6s]" />
        </g>

        {/* main body */}
        <rect x="88" y="304" width="236" height="172" rx="16" fill="#FFFDF8" stroke="#F6C9A4" strokeWidth="3" />
        <rect x="88" y="304" width="236" height="16" rx="8" fill="#FBE5D2" />

        {/* annex */}
        <rect x="324" y="364" width="112" height="112" rx="14" fill="#FFFDF8" stroke="#F6C9A4" strokeWidth="3" />
        <path d="M310 372 L 380 316 L 450 372 Q 454 378 447 379 L 314 379 Q 306 378 310 372 Z" fill="#A24515" strokeLinejoin="round" />

        {/* main roof */}
        <path
          d="M66 316 L 201 198 Q 206 193 211 198 L 346 316 Q 352 322 344 324 L 68 324 Q 60 322 66 316 Z"
          fill="#DD6B20"
          strokeLinejoin="round"
        />
        <path d="M84 312 L 206 208 L 328 312" fill="none" stroke="#F6C9A4" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />

        {/* round attic window */}
        <circle cx="206" cy="272" r="23" fill="#fff" stroke="#F6C9A4" strokeWidth="3" />
        <circle cx="206" cy="272" r="14" fill="#DCEAE1" />
        <path d="M192 272 H 220 M 206 258 V 286" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" />

        {/* window left */}
        <rect x="120" y="344" width="58" height="58" rx="12" fill="#fff" stroke="#F6C9A4" strokeWidth="3" />
        <rect x="129" y="353" width="40" height="40" rx="7" fill="#DCEAE1" />
        <path d="M149 353 V 393 M 129 373 H 169" stroke="#fff" strokeWidth="3.5" />
        {/* flower box */}
        <rect x="116" y="402" width="66" height="14" rx="7" fill="#A24515" />
        <circle cx="130" cy="400" r="6" fill="#EFA670" />
        <circle cx="149" cy="397" r="7" fill="#DD6B20" />
        <circle cx="168" cy="400" r="6" fill="#599679" />

        {/* door */}
        <path d="M238 476 V 412 Q 238 392 267 392 Q 296 392 296 412 V 476 Z" fill="#2C5E4B" />
        <path d="M238 476 V 412 Q 238 392 267 392 Q 296 392 296 412 V 476" fill="none" stroke="#1F4337" strokeWidth="3" />
        <circle cx="286" cy="436" r="4.5" fill="#EFA670" />
        <rect x="228" y="476" width="78" height="12" rx="6" fill="#F6C9A4" />

        {/* annex window */}
        <rect x="348" y="394" width="52" height="46" rx="10" fill="#fff" stroke="#F6C9A4" strokeWidth="3" />
        <rect x="356" y="402" width="36" height="30" rx="6" fill="#DCEAE1" />
        <rect x="344" y="452" width="60" height="24" rx="10" fill="#DCEAE1" />
        <circle cx="360" cy="464" r="5" fill="#DD6B20" />
        <circle cx="374" cy="462" r="6" fill="#EFA670" />
        <circle cx="388" cy="464" r="5" fill="#599679" />
      </g>

      {/* ── FLOATING LEASE DOCUMENT ── */}
      <g className="animate-float" style={{ transformOrigin: "482px 250px" }}>
        <g transform="rotate(5 482 250)">
          <rect x="404" y="146" width="168" height="212" rx="18" fill="#fff" stroke="#F6C9A4" strokeWidth="3" />
          <circle cx="556" cy="162" r="16" fill="#FDFBF7" stroke="#F6C9A4" strokeWidth="3" />
          <path d="M548 162 h16 M556 154 v16" stroke="#DD6B20" strokeWidth="3" strokeLinecap="round" />
          {/* header */}
          <rect x="424" y="170" width="82" height="14" rx="7" fill="#DD6B20" />
          <rect x="424" y="192" width="48" height="9" rx="4.5" fill="#EFE7D6" />
          {/* body lines */}
          <rect x="424" y="214" width="128" height="8" rx="4" fill="#F6F0E4" />
          <rect x="424" y="230" width="128" height="8" rx="4" fill="#F6F0E4" />
          <rect x="424" y="246" width="96" height="8" rx="4" fill="#F6F0E4" />
          <rect x="424" y="262" width="128" height="8" rx="4" fill="#DCEAE1" />
          <rect x="424" y="278" width="72" height="8" rx="4" fill="#F6F0E4" />
          {/* signature zone */}
          <path d="M424 320 H 552" stroke="#EFE7D6" strokeWidth="3" strokeLinecap="round" strokeDasharray="0.5 9" />
          <path
            d="M424 306 C 434 290, 442 316, 452 304 C 460 294, 466 312, 476 303 C 484 296, 490 306, 498 302"
            fill="none"
            stroke="#1A202C"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* stamp */}
          <circle cx="530" cy="308" r="21" fill="none" stroke="#E78345" strokeWidth="3" strokeDasharray="4 5" strokeLinecap="round" />
          <path d="M522 308 l6 6 l11 -12" fill="none" stroke="#DD6B20" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>

      {/* verified seal — overlapping the lease */}
      <g className="animate-pulse-soft" style={{ transformOrigin: "566px 352px" }}>
        <circle cx="566" cy="352" r="30" fill="#2C5E4B" stroke="#FDFBF7" strokeWidth="5" />
        <circle cx="566" cy="352" r="37" fill="none" stroke="#8BB7A1" strokeWidth="2.5" strokeDasharray="2 7" strokeLinecap="round" />
        <path d="M554 352 l8 9 l16 -18" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* ── SMART ID CARD ── */}
      <g className="animate-float-slow" style={{ transformOrigin: "120px 380px" }}>
        <g transform="rotate(-8 120 380)">
          <rect x="42" y="330" width="164" height="102" rx="16" fill="#fff" stroke="#DCEAE1" strokeWidth="3" />
          <path d="M42 346 a16 16 0 0 1 16 -16 h132 a16 16 0 0 1 16 16 v6 H42 Z" fill="#2C5E4B" />
          <circle cx="62" cy="341" r="4" fill="#FDFBF7" opacity="0.9" />
          <circle cx="76" cy="341" r="4" fill="#FDFBF7" opacity="0.55" />
          {/* photo */}
          <rect x="58" y="362" width="42" height="48" rx="9" fill="#DCEAE1" />
          <circle cx="79" cy="380" r="9" fill="#599679" />
          <path d="M65 410 v-6 a14 14 0 0 1 28 0 v6 Z" fill="#599679" />
          {/* lines */}
          <rect x="110" y="366" width="72" height="9" rx="4.5" fill="#EFE7D6" />
          <rect x="110" y="382" width="52" height="9" rx="4.5" fill="#F6F0E4" />
          <rect x="110" y="398" width="64" height="9" rx="4.5" fill="#DCEAE1" />
          {/* shield */}
          <path d="M182 412 l10 -6 10 6 v9 c0 7 -6 11 -10 12 c-4 -1 -10 -5 -10 -12 Z" fill="#2C5E4B" />
          <path d="M187 420 l4 4 7 -8" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>

      {/* ── plant ── */}
      <g className="animate-sway" style={{ transformOrigin: "486px 500px" }}>
        <path d="M486 452 C 486 420 470 400 452 392" fill="none" stroke="#2C5E4B" strokeWidth="5" strokeLinecap="round" />
        <path d="M486 452 C 486 416 500 396 520 388" fill="none" stroke="#2C5E4B" strokeWidth="5" strokeLinecap="round" />
        <path d="M486 452 C 486 428 486 406 486 392" fill="none" stroke="#2C5E4B" strokeWidth="5" strokeLinecap="round" />
        <ellipse cx="448" cy="388" rx="14" ry="9" fill="#599679" transform="rotate(38 448 388)" />
        <ellipse cx="524" cy="384" rx="14" ry="9" fill="#599679" transform="rotate(-38 524 384)" />
        <ellipse cx="486" cy="384" rx="10" ry="15" fill="#2C5E4B" />
      </g>
      <path d="M458 452 h56 l-8 46 a10 10 0 0 1 -10 8 h-20 a10 10 0 0 1 -10 -8 Z" fill="#DD6B20" />
      <path d="M458 452 h56 l-2 12 h-52 Z" fill="#A24515" />
      <rect x="452" y="444" width="68" height="14" rx="7" fill="#E78345" />

      {/* ── sparkles & doodles ── */}
      <Star x={82} y={216} s={1} className="animate-pulse-soft" />
      <Star x={600} y={200} s={0.8} fill="#8BB7A1" className="animate-pulse-soft [animation-delay:-1.2s]" />
      <Star x={356} y={120} s={0.9} fill="#EFA670" className="animate-pulse-soft [animation-delay:-2.2s]" />
      <Star x={252} y={140} s={0.7} fill="#DD6B20" className="animate-pulse-soft [animation-delay:-0.6s]" />
      <Star x={604} y={430} s={0.9} fill="#EE9C5E" className="animate-pulse-soft [animation-delay:-1.8s]" />
      <path d="M70 452 c 8 -10 16 10 24 0 c 8 -10 16 10 24 0" fill="none" stroke="#8BB7A1" strokeWidth="3.5" strokeLinecap="round" className="animate-dash" strokeDasharray="6 6" />

      {/* handwritten note */}
      <g transform="rotate(-6 560 118)">
        <text
          x="560"
          y="120"
          textAnchor="middle"
          fontSize="26"
          fontWeight="600"
          fill="#C4561A"
          style={{ fontFamily: "Caveat, cursive" }}
        >
          signed &amp; sealed!
        </text>
        <path d="M542 132 C 540 152 548 176 560 190" fill="none" stroke="#C4561A" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="1 7" />
        <path d="M554 184 l7 8 l8 -10" fill="none" stroke="#C4561A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      <defs>
        <radialGradient id="sunGlow" cx={0.35} cy={0.35} r={1}>
          <stop offset={0} stopColor="#FDFBF7" stopOpacity={0.55} />
          <stop offset={1} stopColor="#FDFBF7" stopOpacity={0} />
        </radialGradient>
      </defs>
    </svg>
  );
}
