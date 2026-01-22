import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import type { ClickResponse } from "@shared/routes";
import { Card } from "@/components/ui/card";
import { Clock, Calendar, Hash, MousePointerClick } from "lucide-react";

interface LastClickCardProps {
  lastClick?: ClickResponse;
}

export function LastClickCard({ lastClick }: LastClickCardProps) {
  if (!lastClick) {
    return (
      <Card className="w-full p-8 text-center bg-muted/30 border-dashed border-2">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <MousePointerClick className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold font-display">No clicks today</h3>
          <p>Start clicking the buttons above!</p>
        </div>
      </Card>
    );
  }

  const date = new Date(lastClick.createdAt);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={lastClick.id}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <Card className="overflow-hidden border-none shadow-2xl bg-gradient-to-br from-card to-secondary/5 relative">
          <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="p-8 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              
              <div className="text-center md:text-left">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-1">Latest Action</p>
                <h2 className="text-4xl md:text-5xl font-bold font-display text-gradient mb-2">
                  {lastClick.buttonLabel}
                </h2>
              </div>

              <div className="grid grid-cols-3 gap-4 md:gap-8 w-full md:w-auto">
                <div className="flex flex-col items-center p-4 bg-background/50 rounded-xl border border-border/50 shadow-sm backdrop-blur-sm">
                  <Hash className="w-5 h-5 text-primary mb-2" />
                  <span className="text-xs text-muted-foreground uppercase font-bold">Sequence</span>
                  <span className="text-2xl font-bold font-display">#{lastClick.dailySequence}</span>
                </div>

                <div className="flex flex-col items-center p-4 bg-background/50 rounded-xl border border-border/50 shadow-sm backdrop-blur-sm">
                  <Clock className="w-5 h-5 text-accent mb-2" />
                  <span className="text-xs text-muted-foreground uppercase font-bold">Time</span>
                  <span className="text-2xl font-bold font-display">{format(date, "HH:mm")}</span>
                </div>

                <div className="flex flex-col items-center p-4 bg-background/50 rounded-xl border border-border/50 shadow-sm backdrop-blur-sm">
                  <Calendar className="w-5 h-5 text-secondary mb-2" />
                  <span className="text-xs text-muted-foreground uppercase font-bold">Date</span>
                  <span className="text-2xl font-bold font-display">{format(date, "dd MMM")}</span>
                </div>
              </div>

            </div>
          </div>
          
          {/* Decorative bar at bottom */}
          <div className="h-1.5 w-full bg-gradient-to-r from-primary via-accent to-secondary" />
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
