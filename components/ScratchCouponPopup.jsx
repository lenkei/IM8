"use client";

import { useEffect, useRef, useState } from "react";

// Csak akkor aktiváljuk az éles felugró ablakot, ha a webshop adminjában
// MÁR létrehozott, valóban beváltható 11%-os kuponkód van beállítva Vercelen.
const CONFIGURED_CODE = (process.env.NEXT_PUBLIC_VGE_SCRATCH_COUPON_CODE ?? "").trim().toUpperCase();
const ACTIVE_COUPON = /^[A-Z0-9][A-Z0-9_-]{3,31}$/.test(CONFIGURED_CODE) ? CONFIGURED_CODE : "";
const PRODUCT_URL =
  process.env.NEXT_PUBLIC_VGE_PRODUCT_URL ||
  "https://uj.vitalgrapeessence.hu/termekek/vital-grape-essence";
const DELAY_MS = 60_000;
const SESSION_SHOWN_KEY = "vge-scratch-coupon-shown-v1";

function ScratchSurface({ revealed, onReveal }) {
  const canvasRef = useRef(null);
  const lastRef = useRef(null);
  const scratchingRef = useRef(false);

  useEffect(() => {
    if (revealed) return undefined;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const drawCover = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) return;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.globalCompositeOperation = "source-over";
      context.fillStyle = "#d2b87a";
      context.fillRect(0, 0, rect.width, rect.height);
      // Visszafogott arany gravírozás, nem színátmenet.
      context.strokeStyle = "rgba(63, 31, 24, 0.16)";
      context.lineWidth = 1;
      for (let x = -rect.height; x < rect.width + rect.height; x += 16) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x + rect.height, rect.height);
        context.stroke();
      }
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillStyle = "#3d0a20";
      context.font = "700 19px Arial, sans-serif";
      context.fillText("KAPARD LE!", rect.width / 2, rect.height / 2 - 11);
      context.font = "11px Arial, sans-serif";
      context.fillText("UJJAL VAGY EGÉRREL", rect.width / 2, rect.height / 2 + 20);
      lastRef.current = null;
      scratchingRef.current = false;
    };
    drawCover();
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(drawCover) : null;
    observer?.observe(canvas);
    return () => observer?.disconnect();
  }, [revealed]);

  const pointFrom = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const erasePoint = (canvas, point, last) => {
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return;
    context.globalCompositeOperation = "destination-out";
    context.lineWidth = 46;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.beginPath();
    context.moveTo(last?.x ?? point.x, last?.y ?? point.y);
    context.lineTo(point.x, point.y);
    context.stroke();
    context.beginPath();
    context.arc(point.x, point.y, 23, 0, Math.PI * 2);
    context.fill();
  };

  const finish = (event) => {
    if (!scratchingRef.current) return;
    scratchingRef.current = false;
    lastRef.current = null;
    const canvas = event.currentTarget;
    try {
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    } catch {
      // A böngésző már automatikusan felszabadíthatta a mutatót.
    }
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return;
    const { width, height } = canvas;
    const pixels = context.getImageData(0, 0, width, height).data;
    let visible = 0;
    let samples = 0;
    // A teljes kép ellenőrzése helyett ritkított mintavétel: telefonon is gyors.
    const stride = Math.max(4, Math.floor(width / 80));
    for (let y = 0; y < height; y += stride) {
      for (let x = 0; x < width; x += stride) {
        const alpha = pixels[(y * width + x) * 4 + 3];
        if (alpha < 80) visible++;
        samples++;
      }
    }
    if (samples && visible / samples >= 0.35) onReveal();
  };

  return (
    <div className="scratch-surface" role="group" aria-label="Kaparós kuponjáték">
      <div className="scratch-prize" aria-hidden={!revealed}>
        <span>A MAI AJÁNDÉKOD</span>
        <strong>11%</strong>
        <span>KEDVEZMÉNY</span>
      </div>
      {!revealed && (
        <canvas
          ref={canvasRef}
          className="scratch-cover"
          aria-label="Kaparós felület: az egérrel vagy ujjal húzva lekaparható"
          onPointerDown={(event) => {
            if (event.pointerType === "mouse" && event.button !== 0) return;
            event.preventDefault();
            scratchingRef.current = true;
            event.currentTarget.setPointerCapture(event.pointerId);
            const point = pointFrom(event);
            erasePoint(event.currentTarget, point, null);
            lastRef.current = point;
          }}
          onPointerMove={(event) => {
            if (!scratchingRef.current) return;
            event.preventDefault();
            const point = pointFrom(event);
            erasePoint(event.currentTarget, point, lastRef.current);
            lastRef.current = point;
          }}
          onPointerUp={finish}
          onPointerCancel={finish}
        />
      )}
    </div>
  );
}

export default function ScratchCouponPopup() {
  const [open, setOpen] = useState(false);
  const [available, setAvailable] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const closeRef = useRef(null);
  const reopenRef = useRef(null);

  useEffect(() => {
    if (!ACTIVE_COUPON) return undefined;

    try {
      if (window.sessionStorage.getItem(SESSION_SHOWN_KEY) === "yes") {
        setAvailable(true);
        return undefined;
      }
    } catch {
      // Privát böngészési módban a sessionStorage elérhetetlen lehet.
    }

    let expired = false;
    const showWhenVisible = () => {
      if (!expired || document.visibilityState === "hidden") return;
      setAvailable(true);
      setOpen(true);
      try {
        window.sessionStorage.setItem(SESSION_SHOWN_KEY, "yes");
      } catch {
        // A megjelenítést ez nem akadályozza meg.
      }
    };
    const timer = window.setTimeout(() => {
      expired = true;
      showWhenVisible();
    }, DELAY_MS);
    document.addEventListener("visibilitychange", showWhenVisible);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", showWhenVisible);
    };
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  if (!ACTIVE_COUPON) return null;

  const copyCoupon = async () => {
    setCopyError(false);
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard API unavailable");
      await navigator.clipboard.writeText(ACTIVE_COUPON);
      setCopied(true);
    } catch {
      setCopyError(true);
    }
  };

  return (
    <>
      {available && !open && (
        <button ref={reopenRef} type="button" className="scratch-reopen" onClick={() => setOpen(true)}>
          <span aria-hidden="true">✦</span> 11% kuponom
        </button>
      )}

      {open && (
        <div
          className="scratch-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <section
            className="scratch-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="scratch-title"
            aria-describedby="scratch-description"
          >
            <button
              ref={closeRef}
              className="scratch-close"
              type="button"
              aria-label="Kuponablak bezárása"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
            <p className="scratch-eyebrow">VITAL GRAPE ESSENCE · AJÁNDÉK</p>
            <h2 id="scratch-title">Egy meglepetés<br /><em>vár rád.</em></h2>
            <p id="scratch-description" className="scratch-intro">
              Kapard le az arany mezőt az ujjaddal vagy az egérrel!
            </p>

            <ScratchSurface revealed={revealed} onReveal={() => setRevealed(true)} />

            {!revealed ? (
              <>
                <p className="scratch-hint">A felület körülbelül egyharmadát kell lekaparni.</p>
                <button type="button" className="scratch-accessible" onClick={() => setRevealed(true)}>
                  A kedvezmény megjelenítése kaparás nélkül
                </button>
              </>
            ) : (
              <div className="scratch-result" aria-live="polite">
                <p><strong>A mai nyereményed: 11% kedvezmény!</strong></p>
                <p>Beváltható valamennyi egyszeri vásárlású Vital Grape Essence csomagra.</p>
                <div className="scratch-code" aria-label={`Kuponkód: ${ACTIVE_COUPON}`}>
                  <span>KUPONKÓD</span>
                  <strong>{ACTIVE_COUPON}</strong>
                </div>
                <button type="button" className="scratch-copy" onClick={copyCoupon}>
                  {copied ? "KUPON MÁSOLVA ✓" : "KUPONKÓD MÁSOLÁSA"}
                </button>
                {copyError && (
                  <p className="scratch-copy-error">Nem sikerült automatikusan másolni. A kódot kézzel is kijelölheted.</p>
                )}
                <a className="scratch-shop" href={PRODUCT_URL}>CSOMAGOK MEGTEKINTÉSE ↗</a>
                <p className="scratch-note">A kuponkódot a webshop pénztáránál tudod megadni. Előfizetésre nem érvényes.</p>
              </div>
            )}

            <p className="scratch-transparency">
              A kaparás játékos megjelenítés: minden résztvevő ugyanazt a 11%-os kedvezményt kapja, nem sorsolás.
            </p>
          </section>
        </div>
      )}
    </>
  );
}
