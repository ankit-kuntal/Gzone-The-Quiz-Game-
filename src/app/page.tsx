"use client";
import Link from "next/link";
import Image from "next/image";
import { UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

export default function LandingPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<any>(null);

useEffect(() => {
  if (!canvasRef.current) return;

  let app: any;
  let move: any;

  const init = async () => {
    try {
      const TubesCursor = (await import(
        "threejs-components/build/cursors/tubes1.min.js"
      )).default;

      if (!TubesCursor) {
        console.error("❌ TubesCursor not found");
        return;
      }

      app = TubesCursor(canvasRef.current, {
        tubes: {
          colors: ["#f967fb", "#53bc28", "#6958d5"],
        },
      });

      move = (e: MouseEvent) => app?.onMouseMove?.(e);
      window.addEventListener("mousemove", move);

      console.log("✅ Working perfectly");
    } catch (e) {
      console.error("❌ Import error:", e);
    }
  };

  init();

  return () => {
    window.removeEventListener("mousemove", move);
    app?.destroy?.();
  };
}, []);
  return (
    <>
      {/* Navbar - high z-index */}
      <nav className="fixed top-0 left-0 right-0 z-[100] px-9 py-4 flex items-center justify-between text-white backdrop-blur-xl bg-black/10 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2b2b2b] to-[#161616] flex items-center justify-center shadow-[0_0_10px_#0005]">
            <Image src="/logo.png" alt="GZone Logo" width={40} height={40} priority />
          </div>
        </div>

        <div className="flex items-center gap-8">
          <Link href="/frontend/privacy-policy" className="text-sm hover:text-gray-300 transition">
            Privacy Policy
          </Link>
          <Link href="/frontend/login" aria-label="Login">
            <UserCircle className="w-7 h-7 hover:text-gray-300 transition" />
          </Link>
        </div>
      </nav>

      {/* Canvas - background, low z-index, no pointer events */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: -10, background: "transparent" }}
      />

      {/* Hero - content layer */}
      <section
        className="relative h-screen text-white flex items-center justify-center px-4 md:px-20 lg:px-28 overflow-hidden"
        style={{ zIndex: 10 }}
      >
        <div className="container mx-auto max-w-7xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8 flex flex-col items-center"
          >
            <div className="flex items-center justify-center gap-3">
              <div className="h-[2px] w-8 md:w-16 bg-[#ffb347]" />
              <h2 className="text-sm md:text-base font-bold tracking-[0.3em] uppercase text-gray-300">
                GZONE
              </h2>
              <div className="h-[2px] w-8 md:w-16 bg-[#ffb347]" />
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[1] tracking-tighter uppercase drop-shadow-2xl">
              KNOWLEDGE <br /> AS A GAME
            </h1>

            <p className="text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed font-medium">
              Gzone turns quizzes into exciting competitions — powerful software that works so you don't have to.
            </p>

            <div className="pt-4">
              <Link href="/frontend/signup">
                <Button
                  size="lg"
                  className="px-10 py-6 text-lg rounded-full font-bold text-black bg-[#ffb347] shadow-[0_0_20px_#ffb347aa] hover:shadow-[0_0_40px_#ffb347] hover:bg-[#ff9f25] transition-all duration-300 hover:scale-105"
                >
                  Get Access Now
                </Button>
              </Link>
            </div>
          </motion.div>

          <div className="absolute bottom-6 left-0 right-0 text-center py-3 opacity-70 hover:opacity-100 transition">
            <Link href="/frontend/privacy-policy" className="text-sm hover:text-gray-300">
              Privacy Policy
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}