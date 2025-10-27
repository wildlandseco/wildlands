"use client";
import { useState, useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export default function StickyCTA() {
  const [show, setShow] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 260);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduce ? 0 : 24 }}
          transition={{ duration: 0.35 }}
          className="fixed right-4 bottom-4 md:right-6 md:bottom-6 z-50"
        >
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold
                       bg-emerald-700 text-white shadow-xl shadow-emerald-900/20
                       hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-300
                       backdrop-blur supports-[backdrop-filter]:bg-emerald-700/95"
          >
            Request a Consult
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}