import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import type { ClickResponse } from "@shared/routes";
import { Card } from "@/components/ui/card";
import { Clock, Calendar, Hash, MousePointerClick } from "lucide-react";
import { useEffect, useState } from "react";

interface LastClickCardProps {
  lastClick?: ClickResponse;
}

export function LastClickCard({ lastClick }: LastClickCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (lastClick) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [lastClick]);

  if (!lastClick) {
    return (
      <Card className="w-full p-8 text-center bg-muted/10 border-dashed border-2">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <MousePointerClick className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold font-display text-foreground">Sem cliques hoje</h3>
          <p>Comece a clicar nos botões acima!</p>
        </div>
      </Card>
    );
  }

  const date = new Date(lastClick.createdAt);

  return (
    <div className="min-h-[160px]">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            key={lastClick.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="p-6 border bg-slate-800/50 text-white backdrop-blur-sm border-slate-700">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                  <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">Botão Clicado</span>
                  <span className="text-lg font-bold">{lastClick.buttonLabel}</span>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Ticket</span>
                    <span className="text-xl font-bold">#{lastClick.dailySequence}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Hora</span>
                    <span className="text-xl font-bold">{format(date, "HH:mm")}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Data</span>
                    <span className="text-xl font-bold">{format(date, "dd/MM")}</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
