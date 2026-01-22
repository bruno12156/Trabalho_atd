import { format } from "date-fns";
import type { ClickResponse } from "@shared/routes";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

interface HistoryListProps {
  clicks: ClickResponse[];
}

export function HistoryList({ clicks }: HistoryListProps) {
  if (clicks.length === 0) return null;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-lg font-semibold font-display">Today's History</h3>
        <span className="text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
          {clicks.length} records
        </span>
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <div className="grid grid-cols-4 gap-4 p-4 bg-muted/30 border-b text-xs font-bold text-muted-foreground uppercase tracking-wider">
          <div className="text-center">Sequence</div>
          <div className="col-span-2">Action</div>
          <div className="text-right">Time</div>
        </div>
        
        <ScrollArea className="h-[300px] w-full">
          <div className="divide-y divide-border/50">
            {clicks.map((click, index) => (
              <motion.div 
                key={click.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="grid grid-cols-4 gap-4 p-4 hover:bg-muted/20 transition-colors items-center"
              >
                <div className="text-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold font-display text-sm">
                    #{click.dailySequence}
                  </span>
                </div>
                <div className="col-span-2 font-medium">
                  {click.buttonLabel}
                </div>
                <div className="text-right font-mono text-sm text-muted-foreground">
                  {format(new Date(click.createdAt), "HH:mm:ss")}
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
