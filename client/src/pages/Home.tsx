import { useState } from "react";
import { useTodaysClicks, useCreateClick } from "@/hooks/use-clicks";
import { ClickButton } from "@/components/ClickButton";
import { LastClickCard } from "@/components/LastClickCard";
import { HistoryList } from "@/components/HistoryList";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function Home() {
  const { data: clicks = [], isLoading } = useTodaysClicks();
  const { mutateAsync: createClick } = useCreateClick();
  const { toast } = useToast();
  
  // Track which button is currently submitting for specific loading states
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const handleButtonClick = async (label: string) => {
    try {
      setActiveButton(label);
      await createClick({ buttonLabel: label });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to record click",
        variant: "destructive",
      });
    } finally {
      setActiveButton(null);
    }
  };

  // Derived state
  const lastClick = clicks.length > 0 ? clicks[0] : undefined;

  // Button configurations with distinct styles
  const buttons = [
    { label: "Button 1", color: "bg-slate-700 hover:bg-slate-800 text-white shadow-sm" },
    { label: "Button 2", color: "bg-slate-700 hover:bg-slate-800 text-white shadow-sm" },
    { label: "Button 3", color: "bg-slate-700 hover:bg-slate-800 text-white shadow-sm" },
    { label: "Button 4", color: "bg-slate-700 hover:bg-slate-800 text-white shadow-sm" },
  ];

  return (
    <div className="min-h-screen bg-background bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-12">
        
        {/* Header */}
        <header className="text-center space-y-2 mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-display font-bold text-foreground tracking-tight"
          >
            Click Registry<span className="text-primary">.</span>
          </motion.h1>
        </header>

        {/* Action Grid */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {buttons.map((btn, idx) => (
              <motion.div
                key={btn.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <ClickButton
                  label={btn.label}
                  colorClass={btn.color}
                  onClick={() => handleButtonClick(btn.label)}
                  isLoading={activeButton === btn.label}
                  disabled={!!activeButton}
                />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Results Section */}
        <section className="flex justify-center">
          {lastClick && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-md"
            >
              <LastClickCard lastClick={lastClick} />
            </motion.div>
          )}
        </section>
        
        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground pt-12">
          <p>© {new Date().getFullYear()} Click Registry System. All timestamps are local server time.</p>
        </footer>
      </div>
    </div>
  );
}
