"use client";

import { useLayoutEffect } from "react";

/**
 * Új látogatáskor a polifenol-kisokosnál nyitunk, de nem írunk URL-hash-t.
 * Így az oldal mindkét irányba görgethető marad, és egy szándékosan megadott
 * #dupla / #kerdesek / egyéb ugrólink elsőbbséget élvez.
 */
export default function InitialScrollToPolyphenols() {
  useLayoutEffect(() => {
    if (window.location.hash) return;

    const section = document.getElementById("tudomany");
    if (!section) return;

    // A globális scroll-behavior: smooth ellenére az első pozicionálás
    // azonnali legyen, ne az oldal tetejéről animáljon le.
    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";

    const positionAtSection = () => {
      const sectionTop = window.scrollY + section.getBoundingClientRect().top;
      window.scrollTo({ top: Math.max(0, sectionTop), behavior: "instant" });
    };

    positionAtSection();
    // Második pozicionálás a következő frame-ben, az első layout után.
    const frame = window.requestAnimationFrame(() => {
      positionAtSection();
      root.style.scrollBehavior = previousBehavior;
    });

    return () => {
      window.cancelAnimationFrame(frame);
      root.style.scrollBehavior = previousBehavior;
    };
  }, []);

  return null;
}
