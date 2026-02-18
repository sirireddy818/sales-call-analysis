import { motion } from "framer-motion";
import SentimentBadge from "./SentimentBadge";
import ObjectionCard from "./ObjectionCard";
import SummaryCard from "./SummaryCard";

interface AnalysisData {
  sentiment: string;
  objections: string[];
  summary: string;
  confidence?: number;
}

interface AnalysisResultsProps {
  data: AnalysisData;
}

const AnalysisResults = ({ data }: AnalysisResultsProps) => {
  const normalizeSentiment = (sentiment: string): "positive" | "neutral" | "negative" => {
    const lower = sentiment.toLowerCase();
    if (lower.includes("positive")) return "positive";
    if (lower.includes("negative")) return "negative";
    return "neutral";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header with sentiment */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-4 text-center"
      >
        <h2 className="font-display text-2xl font-semibold text-foreground">
          Analysis Complete
        </h2>
        <SentimentBadge sentiment={normalizeSentiment(data.sentiment)} />
      </motion.div>

      {/* Summary card */}
      <SummaryCard summary={data.summary} confidence={data.confidence} />

      {/* Objections */}
      <ObjectionCard objections={data.objections} />
    </motion.div>
  );
};

export default AnalysisResults;
