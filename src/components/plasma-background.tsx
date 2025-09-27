"use client";

import React from "react";
import Plasma from "./Plasma";

// Full-screen background Plasma effect. Place high in the DOM (e.g. in RootLayout body)
// so it sits behind all other content. Adjust props as desired.
export function PlasmaBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-black">
      {/* Plasma canvas on top of black base */}
      <Plasma
        color="#1e3a8a" // bluish tone (tailwind blue-800)
        speed={0.8}
        direction="forward"
        scale={1.15}
        opacity={0.72}
        mouseInteractive={true}
      />
    </div>
  );
}

export default PlasmaBackground;
