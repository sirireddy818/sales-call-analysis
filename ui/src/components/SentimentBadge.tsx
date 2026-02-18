import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface SentimentBadgeProps {
  sentiment: "positive" | "neutral" | "negative";
}

const SentimentBadge = ({ sentiment }: SentimentBadgeProps) => {
  const config = {
    positive: {
      icon: TrendingUp,
      label: "Positive",
      bgClass: "bg-emerald-500/10 border-emerald-500/30",
      textClass: "text-emerald-400",
      glowColor: "0 0 30px hsl(160 84% 39% / 0.3)",
    },
    neutral: {
      icon: Minus,
      label: "Neutral",
      bgClass: "bg-gold/10 border-gold/30",
      textClass: "text-gold",
      glowColor: "0 0 30px hsl(40 65% 55% / 0.3)",
    },
    negative: {
      icon: TrendingDown,
      label: "Negative",
      bgClass: "bg-rose-500/10 border-rose-500/30",
      textClass: "text-rose-400",
      glowColor: "0 0 30px hsl(350 89% 60% / 0.3)",
    },
  };

  const { icon: Icon, label, bgClass, textClass, glowColor } = config[sentiment];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 ${bgClass}`}
      style={{ boxShadow: glowColor }}
    >
      <Icon className={`h-5 w-5 ${textClass}`} />
      <span className={`font-semibold tracking-wide ${textClass}`}>{label}</span>
    </motion.div>
  );
};

export default SentimentBadge;
