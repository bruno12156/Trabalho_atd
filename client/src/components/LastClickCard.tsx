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
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
      >
        <Card className="p-6 border bg-card">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Button Clicked</span>
              <span className="text-lg font-bold">{lastClick.buttonLabel}</span>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Ticket</span>
                <span className="text-xl font-bold">#{lastClick.dailySequence}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Time</span>
                <span className="text-xl font-bold">{format(date, "HH:mm")}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Date</span>
                <span className="text-xl font-bold">{format(date, "dd/MM")}</span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
