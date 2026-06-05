import React from 'react';
import { motion } from 'motion/react';
export default function Logo({ className = "", sizeClassName = "w-12 h-12" }: { className?: string; sizeClassName?: string }) {
  return (
    <motion.div 
      className={`flex items-center gap-3 cursor-pointer ${className}`}
      whileHover="hover"
      initial="initial"
    >
      <motion.div 
        className={`relative ${sizeClassName} flex items-center justify-center`}
        variants={{
          hover: { scale: 1.05, rotate: -5 }
        }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <img 
          src="/logo/logo.png" 
          alt="Prompt Flow Logo" 
          className="w-full h-full object-contain"
          referrerPolicy="no-referrer"
        />
      </motion.div>
      <span className="text-2xl font-brand font-extrabold tracking-tight whitespace-nowrap">
        Prompt <motion.span 
          className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-600"
          variants={{
            hover: { y: -1 }
          }}
        >
          Flow
          <motion.span 
            className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-600 rounded-full" 
            variants={{
              initial: { opacity: 0.6, scaleX: 0.8 },
              hover: { 
                opacity: 1, 
                scaleX: 1,
                boxShadow: "0 0 12px rgba(219, 39, 119, 0.6)",
              }
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.span>
      </span>
    </motion.div>
  );
}
