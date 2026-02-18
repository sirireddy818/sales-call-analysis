import { useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import AnalysisResults from "@/components/AnalysisResults";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const ResultsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const analysisData = location.state?.analysisData;
    // New flag to indicate batch
    const isBatch = location.state?.isBatch;

    useEffect(() => {
        if (!analysisData) {
            navigate("/");
        }
    }, [analysisData, navigate]);

    if (!analysisData) {
        return null;
    }

    const handleReset = () => {
        navigate("/");
    };

    return (
        <div className="relative min-h-screen overflow-hidden">
            <Navbar />

            <main className="container relative mx-auto px-4 pb-16 pt-32">
                <div className="mx-auto max-w-2xl">
                    <motion.div className="glass-card p-8">
                        {isBatch ? (
                            <div className="space-y-6">
                                <h2 className="font-display text-2xl font-semibold text-center text-foreground">
                                    Batch Analysis Complete
                                </h2>
                                <Card className="border-white/10 bg-white/5">
                                    <CardContent className="pt-6">
                                        <div className="text-center space-y-2">
                                            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                                            <p className="text-xl font-bold">{analysisData.summary.total_calls} Calls Analyzed</p>
                                            <div className="grid grid-cols-2 gap-4 mt-4 text-left">
                                                <div>
                                                    <p className="text-muted-foreground text-sm">Positive</p>
                                                    <p className="font-mono text-lg">{analysisData.summary.positive_calls}</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground text-sm">Negative</p>
                                                    <p className="font-mono text-lg">{analysisData.summary.negative_calls}</p>
                                                </div>
                                            </div>
                                            {analysisData.summary.top_objection && (
                                                <div className="mt-4 pt-4 border-t border-white/10">
                                                    <p className="text-muted-foreground text-sm">Top Objection</p>
                                                    <p className="font-medium">{analysisData.summary.top_objection}</p>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ) : (
                            <AnalysisResults data={analysisData} />
                        )}

                        <div className="mt-8">
                            <Button
                                variant="glass"
                                size="lg"
                                className="w-full"
                                onClick={handleReset}
                            >
                                {isBatch ? "Analyze More Files" : "Analyze Another Call"}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default ResultsPage;
