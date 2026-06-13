from textblob import TextBlob
from sklearn.metrics import accuracy_score, f1_score, classification_report

# ✅ Sample labeled test data (you can add more)
test_data = [
    # (text, true_sentiment, true_objections)
    ("This product is too expensive for our budget", "Negative", ["Price"]),
    ("I love the features, great solution!", "Positive", []),
    ("Call me back next month, not now", "Neutral", ["Timing"]),
    ("We are currently using a competitor product", "Neutral", ["Competitor"]),
    ("I need to consult my manager before deciding", "Neutral", ["Authority"]),
    ("The feature we need is missing from your product", "Negative", ["Product/Feature"]),
    ("Excellent service, very happy with results", "Positive", []),
    ("The cost is too high and we have a tight budget", "Negative", ["Price"]),
    ("I'm interested but need approval from my boss", "Neutral", ["Authority"]),
    ("Fantastic product, highly recommend it!", "Positive", []),
]

from utils.nlp_utils import get_sentiment, detect_objections

# --- Sentiment Evaluation ---
true_sentiments = [d[1] for d in test_data]
pred_sentiments = [get_sentiment(d[0]) for d in test_data]

print("=" * 50)
print("📊 SENTIMENT ANALYSIS METRICS")
print("=" * 50)
accuracy = accuracy_score(true_sentiments, pred_sentiments)
f1 = f1_score(true_sentiments, pred_sentiments, average='weighted', zero_division=0)
print(f"Accuracy : {accuracy * 100:.2f}%")
print(f"F1 Score (weighted): {f1:.4f}")
print("\nDetailed Report:")
print(classification_report(true_sentiments, pred_sentiments, zero_division=0))

# --- Objection Detection Evaluation ---
print("=" * 50)
print("🔍 OBJECTION DETECTION METRICS")
print("=" * 50)

all_labels = ["Price", "Timing", "Competitor", "Authority", "Product/Feature"]

true_obj_matrix = []
pred_obj_matrix = []

for text, _, true_objs in test_data:
    pred_objs = detect_objections(text)
    true_vec = [1 if label in true_objs else 0 for label in all_labels]
    pred_vec = [1 if label in pred_objs else 0 for label in all_labels]
    true_obj_matrix.append(true_vec)
    pred_obj_matrix.append(pred_vec)

from sklearn.metrics import hamming_loss
import numpy as np

true_arr = np.array(true_obj_matrix)
pred_arr = np.array(pred_obj_matrix)

obj_accuracy = accuracy_score(true_arr.flatten(), pred_arr.flatten())
obj_f1 = f1_score(true_arr, pred_arr, average='weighted', zero_division=0)
hamming = hamming_loss(true_arr, pred_arr)

print(f"Objection Detection Accuracy : {obj_accuracy * 100:.2f}%")
print(f"F1 Score (weighted)          : {obj_f1:.4f}")
print(f"Hamming Loss (lower=better)  : {hamming:.4f}")
