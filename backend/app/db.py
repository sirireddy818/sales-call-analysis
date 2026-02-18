import sqlite3
import json
from datetime import datetime

DB_PATH = "sales_calls.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS calls (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT,
            sentiment TEXT,
            objections TEXT, -- JSON string
            summary TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

def add_call(filename, sentiment, objections, summary):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("INSERT INTO calls (filename, sentiment, objections, summary) VALUES (?, ?, ?, ?)",
              (filename, sentiment, json.dumps(objections), summary))
    conn.commit()
    conn.close()

def get_all_calls():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute("SELECT * FROM calls ORDER BY timestamp DESC")
    rows = c.fetchall()
    calls = []
    for row in rows:
        calls.append(dict(row))
    conn.close()
    return calls

def get_analytics():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    
    # Total calls
    c.execute("SELECT COUNT(*) as count FROM calls")
    total_calls = c.fetchone()['count']
    
    # Sentiment Breakdown
    c.execute("SELECT sentiment, COUNT(*) as count FROM calls GROUP BY sentiment")
    rows = c.fetchall()
    sentiment_counts = {row['sentiment'].lower(): row['count'] for row in rows}
    
    # Calculate average sentiment (simple heuristic)
    pos = sentiment_counts.get('positive', 0)
    neg = sentiment_counts.get('negative', 0)
    total = pos + neg + sentiment_counts.get('neutral', 0)
    
    if total == 0:
        avg_sentiment = "N/A"
    elif pos > neg:
        avg_sentiment = "Positive"
    elif neg > pos:
        avg_sentiment = "Negative"
    else:
        avg_sentiment = "Neutral"

    # Top Objections
    c.execute("SELECT objections FROM calls")
    all_objections = []
    for row in c.fetchall():
        objs = json.loads(row['objections'])
        all_objections.extend(objs)
    
    from collections import Counter
    from core.constants import OBJECTION_RECOMMENDATIONS  # Import here to avoid circular imports if any
    
    obj_counts = Counter(all_objections)
    # Get top 2 objections
    top_objections_list = obj_counts.most_common(2)
    top_objection = top_objections_list[0][0] if top_objections_list else "None"

    # Insights Generation
    insights = []
    
    # 1. Objection Analysis & Recommendation
    if top_objection and top_objection != "None":
        rec = OBJECTION_RECOMMENDATIONS.get(top_objection, "Review objection handling scripts.")
        insights.append(f"Primary Challenge: {top_objection}. {rec}")
        
        # Secondary objection insight
        if len(top_objections_list) > 1:
            sec_obj = top_objections_list[1][0]
            insights.append(f"Secondary Challenge: {sec_obj}. Watch for this surfacing alongside {top_objection}.")
    
    # 2. Sentiment Analysis with more nuance
    negative_rate = (neg / total) * 100 if total > 0 else 0
    positive_rate = (pos / total) * 100 if total > 0 else 0
    
    if negative_rate > 30:
        insights.append(f"Critical: High negative sentiment ({negative_rate:.1f}%). Immediate coaching required on conflict resolution.")
    elif positive_rate > 60:
        insights.append("Team is performing well! Sentiment is overwhelmingly positive. Share top calls as training examples.")
    elif total > 5 and abs(pos - neg) < 2:
         insights.append("Mixed sentiment results. Focus on closing techniques to convert neutral calls to positive outcomes.")
        
    # 3. Volume & Data Quality
    if total_calls < 5:
        insights.append("Data Limited. Upload at least 5 more calls to unlock deeper trend analysis.")
    elif total_calls > 20:
         insights.append("Robust dataset available. Consider segmenting analysis by sales rep (feature coming soon).")

    # 4. Strategic Action Plan (New Layer of Detail)
    if top_objection == "Price":
        insights.append("Strategic Action Plan: 1) Acknowledge the budget constraint. 2) Reframe the discussion around 'cost of inaction'. 3) Offer a tiered pricing model or pilot program to lower the barrier to entry.")
    elif top_objection == "Competitor":
        insights.append("Strategic Action Plan: 1) Do not get defensive. 2) Ask 'What do you like most about them?'. 3) Pivot to your unique strengths (e.g., better support, faster implementation) that the competitor lacks.")
    elif top_objection == "Timing":
        insights.append("Strategic Action Plan: 1) Validate their timeline. 2) Ask 'What changes next quarter?'. 3) Propose a 'mutual action plan' to work backwards from their desired go-live date, creating urgency now.")

    # 5. Chart Data Aggregation
    # Volume Trend (Last 7 Days - simplified to all dates for now)
    c.execute("SELECT date(timestamp) as date, COUNT(*) as count FROM calls GROUP BY date(timestamp) ORDER BY date ASC")
    volume_trend = [{"date": row['date'], "count": row['count']} for row in c.fetchall()]

    # Sentiment Trend (Daily sentiment ratio) - simplified
    c.execute("""
        SELECT 
            date(timestamp) as date, 
            SUM(CASE WHEN lower(sentiment) = 'positive' THEN 1 ELSE 0 END) as pos,
            SUM(CASE WHEN lower(sentiment) = 'negative' THEN 1 ELSE 0 END) as neg,
            COUNT(*) as total
        FROM calls 
        GROUP BY date(timestamp) 
        ORDER BY date ASC
    """)
    sentiment_trend = []
    for row in c.fetchall():
        sentiment_trend.append({
            "date": row['date'],
            "positive": row['pos'],
            "negative": row['neg']
        })

    conn.close()
    
    return {
        "total_calls": total_calls,
        "sentiment_counts": sentiment_counts,
        "avg_sentiment": avg_sentiment,
        "top_objection": top_objection,
        "insights": insights,
        "charts": {
            "volume": volume_trend,
            "sentiment_trend": sentiment_trend
        }
    }
