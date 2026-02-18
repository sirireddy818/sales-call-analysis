import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import SentimentBadge from "@/components/SentimentBadge";

interface CallRecord {
    id: number;
    filename: string;
    sentiment: string;
    summary: string;
    timestamp: string;
}

const ReportsPage = () => {
    const [calls, setCalls] = useState<CallRecord[]>([]);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/reports")
            .then(res => res.json())
            .then(data => setCalls(data))
            .catch(err => console.error("Failed to load reports", err));
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString() + " " + new Date(dateString).toLocaleTimeString();
    };

    // Helper to normalize sentiment for badge
    const normalizeSentiment = (sentiment: string): "positive" | "neutral" | "negative" => {
        const lower = sentiment.toLowerCase();
        if (lower.includes("positive")) return "positive";
        if (lower.includes("negative")) return "negative";
        return "neutral";
    };

    return (
        <div className="relative min-h-screen overflow-hidden">
            <Navbar />

            <main className="container relative mx-auto px-4 pb-16 pt-32">
                <div className="space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="font-display text-4xl font-bold">
                            Call <span className="gold-text">Reports</span>
                        </h1>
                        <p className="mt-2 text-muted-foreground">
                            History of all analyzed sales calls.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="glass-card overflow-hidden"
                    >
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-white/5 border-white/10">
                                    <TableHead className="text-gold">Date</TableHead>
                                    <TableHead className="text-gold">Filename</TableHead>
                                    <TableHead className="text-gold">Sentiment</TableHead>
                                    <TableHead className="text-gold">Summary</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {calls.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center text-muted-foreground h-24">
                                            No reports found. Upload calls to populate this list.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    calls.map((call) => (
                                        <TableRow key={call.id} className="hover:bg-white/5 border-white/10">
                                            <TableCell className="font-mono text-xs">{formatDate(call.timestamp)}</TableCell>
                                            <TableCell className="font-medium">{call.filename}</TableCell>
                                            <TableCell>
                                                <SentimentBadge sentiment={normalizeSentiment(call.sentiment)} />
                                            </TableCell>
                                            <TableCell className="text-muted-foreground truncate max-w-xs" title={call.summary}>
                                                {call.summary}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default ReportsPage;
