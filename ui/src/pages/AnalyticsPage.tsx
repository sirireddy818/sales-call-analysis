import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, Users, PhoneCall } from "lucide-react";

interface AnalyticsData {
    total_calls: number;
    sentiment_counts: Record<string, number>;
    avg_sentiment: string;
    top_objection: string;
    insights: string[];
    charts?: {
        volume: { date: string; count: number }[];
        sentiment_trend: { date: string; positive: number; negative: number }[];
    };
}

const AnalyticsPage = () => {
    const [data, setData] = useState<AnalyticsData | null>(null);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/analytics")
            .then(res => res.json())
            .then(data => setData(data))
            .catch(err => console.error("Failed to fetch analytics", err));
    }, []);

    // Placeholder data fallback if no data
    const stats = [
        {
            title: "Total Calls",
            value: data ? data.total_calls.toString() : "-",
            change: "All time",
            icon: PhoneCall,
            color: "text-blue-500",
        },
        {
            title: "Avg. Sentiment",
            value: data ? data.avg_sentiment : "-",
            change: "Overall",
            icon: TrendingUp,
            color: "text-green-500",
        },
        {
            title: "Top Objection",
            value: data ? data.top_objection : "-",
            change: "Most frequent",
            icon: Users, // Icon mismatch but keeping for layout
            color: "text-purple-500",
        },
        // Removed Duration as we don't track it yet
    ];

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
                            Analytics <span className="gold-text">Overview</span>
                        </h1>
                        <p className="mt-2 text-muted-foreground">
                            Track your sales team's performance and call intelligence metrics.
                        </p>
                    </motion.div>

                    {/* Stats Grid */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">
                                            {stat.title}
                                        </CardTitle>
                                        <stat.icon className={`h-4 w-4 ${stat.color}`} />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{stat.value}</div>
                                        <p className="text-xs text-muted-foreground">
                                            {stat.change}
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {!data ? (
                        <div className="text-center text-muted-foreground">Loading analytics...</div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="grid gap-4 md:grid-cols-2"
                        >
                            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle>Sentiment Distribution</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {Object.entries(data.sentiment_counts).map(([sentiment, count]) => (
                                            <div key={sentiment} className="flex justify-between border-b border-white/5 py-2">
                                                <span className="capitalize">{sentiment}</span>
                                                <span className="font-bold">{count}</span>
                                            </div>
                                        ))}
                                        {Object.keys(data.sentiment_counts).length === 0 && (
                                            <div className="text-muted-foreground">No data yet</div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {/* Insights Section */}
                    {data && data.insights && data.insights.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                        >
                            <Card className="border-gold/20 bg-gold/5 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="text-gold flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5" />
                                        AI Insights & Recommendations
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3">
                                        {data.insights.map((insight, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-muted-foreground">
                                                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                                                <span>{insight}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                    {/* Charts Section */}
                    {data && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            className="grid gap-6 md:grid-cols-2"
                        >
                            {/* Volume Trend */}
                            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium">Daily Call Volume</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[200px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={data.charts?.volume || []}>
                                                <XAxis
                                                    dataKey="date"
                                                    stroke="#888888"
                                                    fontSize={12}
                                                    tickLine={false}
                                                    axisLine={false}
                                                />
                                                <YAxis
                                                    stroke="#888888"
                                                    fontSize={12}
                                                    tickLine={false}
                                                    axisLine={false}
                                                    allowDecimals={false}
                                                />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: "#1a1a1a", border: "none" }}
                                                    labelStyle={{ color: "#888888" }}
                                                />
                                                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Sentiment Trend */}
                            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium">Sentiment Trend</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[200px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={data.charts?.sentiment_trend || []}>
                                                <XAxis
                                                    dataKey="date"
                                                    stroke="#888888"
                                                    fontSize={12}
                                                    tickLine={false}
                                                    axisLine={false}
                                                />
                                                <YAxis
                                                    stroke="#888888"
                                                    fontSize={12}
                                                    tickLine={false}
                                                    axisLine={false}
                                                />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: "#1a1a1a", border: "none" }}
                                                />
                                                <Legend />
                                                <Line
                                                    type="monotone"
                                                    dataKey="positive"
                                                    stroke="#22c55e"
                                                    strokeWidth={2}
                                                    dot={false}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="negative"
                                                    stroke="#ef4444"
                                                    strokeWidth={2}
                                                    dot={false}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AnalyticsPage;
