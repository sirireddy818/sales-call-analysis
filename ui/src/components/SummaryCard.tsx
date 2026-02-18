import { motion } from "framer-motion";
import { FileText, Sparkles } from "lucide-react";

interface SummaryCardProps {
  summary: string;
  confidence?: number;
}

const SummaryCard = ({ summary, confidence }: SummaryCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="relative overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/10 via-gold/5 to-transparent p-6"
    >
      {/* Decorative glow */}
      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gold/10 blur-3xl" />
      
      <div className="relative">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gold to-gold-dark shadow-lg">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground">
              Call Summary
            </h3>
          </div>
          
          {confidence !== undefined && (
            <div className="flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1.5">
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              <span className="text-xs font-semibold text-gold">
                {Math.round(confidence * 100)}% Confidence
              </span>
            </div>
          )}
        </div>

        <p className="leading-relaxed text-foreground/90">{summary}</p>
      </div>
    </motion.div>
  );
};

export default SummaryCard;
