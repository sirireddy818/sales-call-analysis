import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

interface ObjectionCardProps {
  objections: string[];
}

const ObjectionCard = ({ objections }: ObjectionCardProps) => {
  if (!objections || objections.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card p-6"
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10">
          <AlertCircle className="h-5 w-5 text-rose-400" />
        </div>
        <h3 className="font-display text-lg font-semibold text-foreground">
          Key Objections
        </h3>
      </div>

      <div className="space-y-3">
        {objections.map((objection, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
            className="flex items-start gap-3 rounded-xl border border-glass-border bg-glass/30 p-4"
          >
            <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-xs font-bold text-rose-400">
              {index + 1}
            </div>
            <p className="text-sm leading-relaxed text-foreground/90">{objection}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ObjectionCard;
