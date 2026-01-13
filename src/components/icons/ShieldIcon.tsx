import { motion } from "framer-motion";

interface ShieldIconProps {
  className?: string;
}

const ShieldIcon = ({ className = "" }: ShieldIconProps) => {
  return (
    <motion.svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Shield body with gradient */}
      <defs>
        <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(174 72% 46%)" />
          <stop offset="100%" stopColor="hsl(187 72% 50%)" />
        </linearGradient>
        <linearGradient id="shieldInner" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(222 47% 12%)" />
          <stop offset="100%" stopColor="hsl(222 47% 8%)" />
        </linearGradient>
      </defs>
      
      {/* Outer shield */}
      <motion.path
        d="M32 4L8 14V30C8 46 18 56 32 60C46 56 56 46 56 30V14L32 4Z"
        fill="url(#shieldGradient)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
      
      {/* Inner shield */}
      <path
        d="M32 10L14 18V30C14 42 22 50 32 54C42 50 50 42 50 30V18L32 10Z"
        fill="url(#shieldInner)"
      />
      
      {/* Lock body */}
      <motion.rect
        x="24"
        y="28"
        width="16"
        height="14"
        rx="2"
        fill="url(#shieldGradient)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, duration: 0.3, ease: "easeOut" }}
      />
      
      {/* Lock shackle */}
      <motion.path
        d="M26 28V24C26 20.6863 28.6863 18 32 18C35.3137 18 38 20.6863 38 24V28"
        stroke="url(#shieldGradient)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.5, duration: 0.4, ease: "easeOut" }}
      />
      
      {/* Keyhole */}
      <circle cx="32" cy="33" r="2" fill="hsl(222 47% 10%)" />
      <rect x="31" y="34" width="2" height="4" fill="hsl(222 47% 10%)" />
    </motion.svg>
  );
};

export default ShieldIcon;