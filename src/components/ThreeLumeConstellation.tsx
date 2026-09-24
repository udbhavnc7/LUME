import { useEffect, useRef } from 'react';

interface ThreeLumeConstellationProps {
  progress: number; // 0 to 100
  onLetterComplete?: (letter: 'L' | 'U' | 'M' | 'E') => void;
}

// 48 Statutory Land-Acquisition & Cadastral Keywords (12 per letter)
const STATUTORY_KEYWORDS = [
  // Letter L words (12)
  'LITIGATION', 'LAND TITLE', 'LEGAL STAY', 'LAND SURVEY', 'LOCUS STANDI', 'RFCTLARR',
  'LAND CEILING', 'LEASEHOLD', 'LAND RECORDS', 'DISPUTES', 'HIGH COURT', 'LIABILITY',

  // Letter U words (12)
  'ULPIN ID', 'URBAN PLANNING', 'UNDIVIDED SHARE', 'UTILITY CORRIDOR', 'UNENCUMBERED', 'UPMARKET VALUE',
  'USER AGENCY', 'UNDERVALUATION', 'KHASRA NO', 'URGENCY CLAUSE', 'UNIT COST', 'UNCLAIMED DEPOSIT',

  // Letter M words (12)
  'MARKET VALUE', 'MUTATION ENTRY', 'MONITORING CELL', 'MANDATORY CONSENT', 'METES & BOUNDS', 'SOLATIUM 100%',
  'MULTIPLIER FACTOR', 'COMPENSATION', 'MAUZAWISER PLOT', 'MEASUREMENT BOOK', 'MEDIATION', 'MICRO PLAN',

  // Letter E words (12)
  'EXPROPRIATION', 'EVICTION ORDER', 'ENACTMENT 2013', 'EXECUTION DECREE', 'ENCUMBRANCE FREE', 'EX-GRATIA',
  'EMINENT DOMAIN', 'ESTATE OFFICER', 'E-PANCHAYAT', 'EQUITY SHARE', 'EQUITABLE RELIEF', 'EVIDENTIARY AUDIT'
];

// Deterministic pseudo-random sequence for positioning (Strict Zero Math.random)
function pseudo(seed: number): number {
  const s = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return s - Math.floor(s);
}

// Exact pixel bounds from /logo-dark.png (219 x 60)
// L: [0, 48], U: [48, 103], M: [103, 171], E: [171, 219]
const LOGO_SLICES = [
  { sx: 0, sw: 48, dxRatio: 0, dwRatio: 48 / 219 },
  { sx: 48, sw: 55, dxRatio: 48 / 219, dwRatio: 55 / 219 },
  { sx: 103, sw: 68, dxRatio: 103 / 219, dwRatio: 68 / 219 },
  { sx: 171, sw: 48, dxRatio: 171 / 219, dwRatio: 48 / 219 },
];

// Exact stroke-anchor coordinates mapped from logo pixels
const LOGO_ANCHORS = [
  // L (Vertical spine down to horizontal base)
  [
    { x: 7, y: 6 }, { x: 7, y: 14 }, { x: 7, y: 22 }, { x: 7, y: 30 },
    { x: 7, y: 38 }, { x: 7, y: 46 }, { x: 7, y: 53 }, { x: 15, y: 53 },
    { x: 22, y: 53 }, { x: 29, y: 53 }, { x: 35, y: 53 }, { x: 37, y: 53 }
  ],
  // U (Left vertical, rounded base, right vertical)
  [
    { x: 54, y: 6 }, { x: 54, y: 18 }, { x: 54, y: 30 }, { x: 54, y: 42 },
    { x: 58, y: 50 }, { x: 67, y: 54 }, { x: 74, y: 54 }, { x: 83, y: 50 },
    { x: 87, y: 42 }, { x: 87, y: 30 }, { x: 87, y: 18 }, { x: 87, y: 6 }
  ],
  // M (Outer legs, chamfered tips, and inner chevron)
  [
    { x: 109, y: 53 }, { x: 109, y: 37 }, { x: 109, y: 21 }, { x: 109, y: 6 },
    { x: 122, y: 20 }, { x: 135, y: 35 }, { x: 135, y: 36 }, { x: 148, y: 20 },
    { x: 161, y: 6 }, { x: 161, y: 21 }, { x: 161, y: 37 }, { x: 161, y: 53 }
  ],
  // E (Three crisp parallel floating bars)
  [
    { x: 182, y: 6 }, { x: 192, y: 6 }, { x: 202, y: 6 }, { x: 213, y: 6 },
    { x: 182, y: 30 }, { x: 192, y: 30 }, { x: 202, y: 30 }, { x: 213, y: 30 },
    { x: 182, y: 53 }, { x: 192, y: 53 }, { x: 202, y: 53 }, { x: 213, y: 53 }
  ]
];

export function ThreeLumeConstellation({ progress, onLetterComplete }: ThreeLumeConstellationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoImgRef = useRef<HTMLImageElement | null>(null);
  const progressRef = useRef(progress);
  progressRef.current = progress;

  useEffect(() => {
    // Preload the official logo image
    const img = new Image();
    img.src = '/logo-dark.png';
    img.onload = () => {
      logoImgRef.current = img;
    };
    if (img.complete) {
      logoImgRef.current = img;
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = container.getBoundingClientRect();
      const w = rect.width || 800;
      const h = rect.height || 420;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    };

    const observer = new ResizeObserver(handleResize);
    observer.observe(container);
    handleResize();

    // 48 scattered outer origins (all around the viewport perimeter)
    const wordOrigins: { x: number; y: number }[] = [];
    for (let i = 0; i < 48; i++) {
      const angle = pseudo(i * 17.3 + 1.1) * Math.PI * 2;
      const dist = 650 + pseudo(i * 41.7 + 2.3) * 380;
      wordOrigins.push({
        x: 500 + Math.cos(angle) * dist,
        y: 240 + Math.sin(angle) * (dist * 0.75),
      });
    }

    const render = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      // Coordinate scaling relative to 1000 x 480 virtual stage
      const scale = Math.min(width / 1000, height / 480);
      const offsetX = (width - 1000 * scale) / 2;
      const offsetY = (height - 480 * scale) / 2;

      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);

      // Ambient background stardust & tactical grid dots
      ctx.fillStyle = 'rgba(56, 189, 248, 0.18)';
      for (let s = 0; s < 36; s++) {
        const sx = pseudo(s * 73.1 + 0.5) * width;
        const sy = pseudo(s * 29.4 + 0.8) * height;
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }

      ctx.translate(offsetX, offsetY);
      ctx.scale(scale, scale);

      const p = Math.max(0, Math.min(100, progressRef.current));

      // Logo layout dimensions inside the 1000 x 480 virtual frame
      // Aspect ratio of official logo is 219 x 60 (~3.65)
      const logoWidth = 560;
      const logoHeight = logoWidth * (60 / 219); // ~153.4px
      const logoX = (1000 - logoWidth) / 2;      // 220
      const logoY = (480 - logoHeight) / 2;       // ~163.3px

      const logoImg = logoImgRef.current;

      // Process each of the 4 letters: L, U, M, E
      for (let l = 0; l < 4; l++) {
        const startP = l * 25;
        // Progress for this letter: 0.0 to 1.0
        const letterProgress = Math.min(1, Math.max(0, (p - startP) / 25));
        // Quintic ease out for swift, fluid convergence
        const ease = 1 - Math.pow(1 - letterProgress, 4);

        const slice = LOGO_SLICES[l];
        const destX = logoX + slice.dxRatio * logoWidth;
        const destW = slice.dwRatio * logoWidth;

        // =====================================================================
        // 1. RENDER THE OFFICIAL LOGO LETTER (Pure crisp white with cyber bloom)
        // =====================================================================
        if (ease > 0.02 && logoImg) {
          ctx.save();
          ctx.globalAlpha = Math.min(1, ease * 1.25);

          // Subtle cyan/emerald back glow matching the LUME telemetry theme
          ctx.shadowColor = l % 2 === 0 ? 'rgba(52, 211, 153, 0.7)' : 'rgba(56, 189, 248, 0.7)';
          ctx.shadowBlur = 18 * ease;

          // Draw the exact slice of the official logo
          ctx.drawImage(
            logoImg,
            slice.sx,
            0,
            slice.sw,
            60,
            destX,
            logoY,
            destW,
            logoHeight
          );

          // Flash bloom on lock completion
          if (letterProgress >= 0.85 && letterProgress <= 1.0) {
            const flash = (letterProgress - 0.85) / 0.15;
            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = 32 * (1 - flash);
            ctx.drawImage(
              logoImg,
              slice.sx,
              0,
              slice.sw,
              60,
              destX,
              logoY,
              destW,
              logoHeight
            );
          }

          ctx.restore();
        }

        // =====================================================================
        // 2. WHITE LAND-ACQUISITION WORDS FLYING IN & MELTING INTO THE LOGO
        // Dissolve to 0 opacity as they reach the letter stroke!
        // =====================================================================
        if (letterProgress > 0 && letterProgress < 0.98) {
          for (let w = 0; w < 12; w++) {
            const wordIdx = l * 12 + w;
            const wordText = STATUTORY_KEYWORDS[wordIdx];
            const origin = wordOrigins[wordIdx];
            const anchor = LOGO_ANCHORS[l][w];

            // Target coordinate scaled to canvas logo position
            const targetX = logoX + (anchor.x / 219) * logoWidth;
            const targetY = logoY + (anchor.y / 60) * logoHeight;

            // Staggered arrival for natural cascade
            const wordDelay = (w / 12) * 0.35;
            const rawT = Math.min(1, Math.max(0, (letterProgress - wordDelay) / (1 - wordDelay)));
            const wordEase = 1 - Math.pow(1 - rawT, 3);

            // Interpolated position
            const curX = origin.x + (targetX - origin.x) * wordEase;
            const curY = origin.y + (targetY - origin.y) * wordEase;

            // Opacity: fades in during flight, melts to 0 upon reaching the letter
            let wordOpacity = 0;
            if (rawT < 0.7) {
              wordOpacity = Math.min(1, rawT * 2.8);
            } else {
              wordOpacity = Math.max(0, (1 - rawT) / 0.3); // Dissolves completely
            }

            if (wordOpacity > 0.02) {
              ctx.save();
              ctx.globalAlpha = wordOpacity;

              // Pure crisp WHITE text
              ctx.font = '800 12px "JetBrains Mono", ui-monospace, SFMono-Regular, monospace';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';

              // Pure white glow
              ctx.shadowColor = 'rgba(255, 255, 255, 0.95)';
              ctx.shadowBlur = 8;
              ctx.fillStyle = '#ffffff';

              ctx.fillText(wordText, curX, curY);

              // Subtle energy spark at arrival
              if (rawT > 0.68) {
                ctx.fillStyle = '#38bdf8';
                ctx.shadowColor = '#34d399';
                ctx.shadowBlur = 6;
                ctx.fillRect(curX + (pseudo(w * 5) - 0.5) * 16, curY + (pseudo(w * 11) - 0.5) * 12, 2, 2);
              }

              ctx.restore();
            }
          }
        }
      }

      // 3. Final shimmer scanline across full assembled logo at 100%
      if (p >= 96 && logoImg) {
        ctx.save();
        const sweepProgress = (p - 96) / 4;
        const sweepX = logoX + sweepProgress * logoWidth;
        const grad = ctx.createLinearGradient(sweepX - 50, logoY, sweepX + 50, logoY);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.35)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(logoX, logoY, logoWidth, logoHeight);
        ctx.restore();
      }

      ctx.restore();

      // Dispatch letter completion events
      if (p >= 25 && p < 50) onLetterComplete?.('L');
      else if (p >= 50 && p < 75) onLetterComplete?.('U');
      else if (p >= 75 && p < 95) onLetterComplete?.('M');
      else if (p >= 95) onLetterComplete?.('E');

      animId = window.requestAnimationFrame(render);
    };

    render();

    return () => {
      window.cancelAnimationFrame(animId);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[360px] sm:h-[420px] rounded-3xl overflow-hidden bg-slate-950/90 border border-slate-700/60 shadow-[0_0_60px_rgba(56,189,248,0.08)] flex items-center justify-center select-none"
      aria-label="LUME Logo Word Assembly Canvas"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
