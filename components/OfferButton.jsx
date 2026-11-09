"use client";

const productUrl =
  process.env.NEXT_PUBLIC_VGE_PRODUCT_URL ||
  "https://uj.vitalgrapeessence.hu/termekek/vital-grape-essence";
const checkoutBridge = process.env.NEXT_PUBLIC_VGE_CHECKOUT_BRIDGE_URL?.trim() || "";

export default function OfferButton({ className = "button" }) {
  const hasBridge = Boolean(checkoutBridge);
  const destination = hasBridge ? checkoutBridge : productUrl;

  function goToOffer(event) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    try {
      const target = new URL(destination);
      if (target.protocol !== "https:") throw new Error("HTTPS required");
      if (hasBridge) {
        // A megvalósítandó webshop bridge szerződése:
        // GET ?offer=vge-double&quantity=1 -> 2 palackos ársor kosárba + /checkout átirányítás.
        target.searchParams.set("offer", "vge-double");
        target.searchParams.set("quantity", "1");
      }
      const inbound = new URLSearchParams(window.location.search);
      for (const [key, value] of inbound.entries()) {
        if (/^utm_[a-z_]+$/i.test(key) || ["fbclid", "gclid"].includes(key)) {
          target.searchParams.set(key, value);
        }
      }
      window.location.assign(target.toString());
    } catch {
      window.location.assign(productUrl);
    }
  }

  return (
    <a
      href={destination}
      onClick={goToOffer}
      className={className}
      aria-label={hasBridge ? "Dupla csomag kosárba, majd pénztár" : "Dupla csomag megtekintése a webshopban"}
    >
      <span>{hasBridge ? "KOSÁRBA ÉS PÉNZTÁRHOZ" : "MEGNÉZEM A DUPLA CSOMAGOT"}</span>
      <span aria-hidden="true">↗</span>
    </a>
  );
}
