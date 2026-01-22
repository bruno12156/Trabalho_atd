import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ClickButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  colorClass?: string;
}

export function ClickButton({ 
  label, 
  onClick, 
  disabled, 
  isLoading,
  colorClass = "bg-gradient-to-br from-primary to-primary/80 hover:shadow-primary/40 shadow-primary/20"
}: ClickButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95, y: 0 }}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(
        "relative w-full aspect-square md:aspect-[4/3] rounded-2xl p-6 flex flex-col items-center justify-center gap-3",
        "text-white shadow-xl transition-all duration-300",
        "border border-white/10 overflow-hidden group",
        colorClass,
        (disabled || isLoading) && "opacity-70 cursor-not-allowed transform-none hover:transform-none"
      )}
    >
      {/* Background texture/shine effect */}
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-45 translate-y-full group-hover:translate-y-[-200%] transition-transform duration-700 ease-in-out" />
      
      {isLoading ? (
        <Loader2 className="w-10 h-10 animate-spin" />
      ) : (
        <>
          <span className="text-3xl font-display font-bold">{label}</span>
          <span className="text-sm font-medium opacity-80 uppercase tracking-wider">Tap to Record</span>
        </>
      )}
    </motion.button>
  );
}
