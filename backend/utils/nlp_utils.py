from textblob import TextBlob
from core.constants import (
    PRICE_KEYWORDS, TIME_KEYWORDS, COMPETITOR_KEYWORDS, 
    AUTHORITY_KEYWORDS, PRODUCT_KEYWORDS
)

def get_sentiment(text):
    polarity = TextBlob(text).sentiment.polarity

    if polarity > 0.2:
        return "Positive"
    elif polarity < -0.2:
        return "Negative"
    else:
        return "Neutral"


def detect_objections(text):
    objections = []

    lower_text = text.lower()

    if any(word in lower_text for word in PRICE_KEYWORDS):
        objections.append("Price")

    if any(word in lower_text for word in TIME_KEYWORDS):
        objections.append("Timing")

    if any(word in lower_text for word in COMPETITOR_KEYWORDS):
        objections.append("Competitor")

    if any(word in lower_text for word in AUTHORITY_KEYWORDS):
        objections.append("Authority")

    if any(word in lower_text for word in PRODUCT_KEYWORDS):
        objections.append("Product/Feature")

    return objections

def generate_summary(text):
    """
    Heuristic summarizer with cleaning and deduplication.
    """
    blob = TextBlob(text)
    sentences = blob.sentences
    
    unique_sentences = []
    seen = set()
    
    for sent in sentences:
        s_str = str(sent).strip()
        # Filter out very short or repetitive "hello" sentences
        if len(s_str) < 10 or s_str.lower() in seen:
            continue
        seen.add(s_str.lower())
        unique_sentences.append(s_str)
        
    summary_sentences = []
    
    # Try to find meaningful business sentences first
    keywords = ["agree", "interested", "problem", "solution", "send", "next step", "price", "cost", "budget"]
    
    for s_str in unique_sentences:
        if any(k in s_str.lower() for k in keywords):
            summary_sentences.append(s_str)
            
    # If no keywords found, fallback to first few unique sentences (skipping likely greetings if possible)
    if not summary_sentences:
        summary_sentences = unique_sentences[:2]
            
    # Limit to 5 sentences for better detail on complex calls
    final_summary = " ".join(summary_sentences[:5])
    
    if not final_summary:
        return (text[:50] + "...") if text else "No speech detected."
        
    return final_summary
