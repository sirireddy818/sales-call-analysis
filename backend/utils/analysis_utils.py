from utils.nlp_utils import get_sentiment, detect_objections, generate_summary

def analyze_text(text):
    sentiment = get_sentiment(text)
    objections = detect_objections(text)
    summary = generate_summary(text)

    return {
        "sentiment": sentiment,
        "objections": objections,
        "summary": summary
    }


def aggregate_results(results):
    summary = {
        "total_calls": len(results),
        "positive_calls": 0,
        "neutral_calls": 0,
        "negative_calls": 0,
        "top_objection": None
    }

    objection_count = {}

    for r in results:
        summary[f"{r['sentiment'].lower()}_calls"] += 1

        for obj in r["objections"]:
            objection_count[obj] = objection_count.get(obj, 0) + 1

    if objection_count:
        summary["top_objection"] = max(objection_count, key=objection_count.get)

    return summary
