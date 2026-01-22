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
      const result = await createClick({ buttonLabel: label });
      toast({
        title: `Ticket #${result.dailySequence}`,
        description: `Button: ${result.buttonLabel} | Date: ${new Date(result.createdAt).toLocaleDateString()} | Time: ${new Date(result.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        className: "bg-primary text-primary-foreground border-none font-medium",
      });
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
    { label: "Button 1", color: "bg-gradient-to-br from-violet-500 to-purple-600 shadow-purple-500/25 hover:shadow-purple-500/40" },
    { label: "Button 2", color: "bg-gradient-to-br from-blue-500 to-cyan-600 shadow-blue-500/25 hover:shadow-blue-500/40" },
    { label: "Button 3", color: "bg-gradient-to-br from-pink-500 to-rose-600 shadow-pink-500/25 hover:shadow-pink-500/40" },
    { label: "Button 4", color: "bg-gradient-to-br from-amber-500 to-orange-600 shadow-orange-500/25 hover:shadow-orange-500/40" },
  ];

  const lastClick = clicks.length > 0 ? clicks[0] : undefined;

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
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Track daily interactions with precision timing.
          </motion.p>
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
