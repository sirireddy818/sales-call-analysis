import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Sparkles, Activity, AudioWaveform } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import FileUpload from "@/components/FileUpload";
import LoadingIndicator from "@/components/LoadingIndicator";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const UploadPage = () => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleFilesSelect = (files: File[]) => {
        setSelectedFiles(files);
    };

    const handleClearFiles = () => {
        setSelectedFiles([]);
    };

    const handleAnalyze = async () => {
        if (!selectedFiles.length) return;

        setIsLoading(true);

        try {
            const formData = new FormData();
            selectedFiles.forEach((file) => {
                formData.append("files", file);
            });

            // Use batch endpoint if multiple files, or just decide to always use batch for consistency
            // The backend has /analyze (single) and /analyze/batch (multiple)
            // Let's use logic:
            const endpoint = selectedFiles.length > 1
                ? "http://127.0.0.1:8000/api/analyze/batch"
                : "http://127.0.0.1:8000/api/analyze";

            // If single file, the backend expects "file" key, if multiple "files" key?
            // Wait, looking at my backend plan and file:
            // Single: output one result. Batch: output { calls: [], summary: {} }
            // To simplify, let's treat everything as batch if we want summary? 
            // Or just handle the response difference.

            // Re-checking backend code I wrote...
            // /analyze expects 'file' (singular)
            // /analyze/batch expects 'files' (list)

            if (selectedFiles.length === 1) {
                const singleFormData = new FormData();
                singleFormData.append("file", selectedFiles[0]);
                const response = await fetch("http://127.0.0.1:8000/api/analyze", {
                    method: "POST",
                    body: singleFormData
                });
                if (!response.ok) throw new Error("Analysis failed");
                const data = await response.json();
                navigate("/results", { state: { analysisData: data, isBatch: false } });
            } else {
                const batchFormData = new FormData();
                selectedFiles.forEach(file => batchFormData.append("files", file));
                const response = await fetch("http://127.0.0.1:8000/api/analyze/batch", {
                    method: "POST",
                    body: batchFormData
                });
                if (!response.ok) throw new Error("Batch Analysis failed");
                const data = await response.json();
                navigate("/results", { state: { analysisData: data, isBatch: true } });
            }

        } catch (error) {
            console.error(error);
            toast({
                title: "Analysis failed",
                description: "Please try again",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden">
            <Navbar />

            <main className="container relative mx-auto px-4 pb-16 pt-32">
                <div className="mx-auto max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="mb-10 text-center"
                    >
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5">
                            <Sparkles className="h-4 w-4 text-gold" />
                            <span className="text-sm font-medium text-gold">
                                AI-Powered Analysis
                            </span>
                        </div>

                        <h1 className="font-display text-4xl font-bold flex items-center justify-center gap-3">
                            Sales Call <span className="gold-text">Intelligence</span>
                            <AudioWaveform className="h-8 w-8 text-gold opacity-100" strokeWidth={1.5} />
                        </h1>

                        <p className="mt-4 text-muted-foreground flex items-center justify-center gap-2">
                            <Activity className="h-5 w-5 text-gold" />
                            Upload your sales calls and unlock actionable insights
                        </p>
                    </motion.div>

                    <motion.div className="glass-card p-8">
                        <motion.div className="space-y-6">
                            <FileUpload
                                onFilesSelect={handleFilesSelect}
                                selectedFiles={selectedFiles}
                                onClearFiles={handleClearFiles}
                                isLoading={isLoading}
                            />

                            {isLoading ? (
                                <LoadingIndicator />
                            ) : (
                                <Button
                                    variant="luxury"
                                    size="xl"
                                    className="w-full"
                                    disabled={!selectedFiles.length || isLoading}
                                    onClick={handleAnalyze}
                                >
                                    <Upload className="h-5 w-5" />
                                    Upload & Analyze
                                </Button>
                            )}
                        </motion.div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default UploadPage;
