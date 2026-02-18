import streamlit as st
import json

st.title("📞 Sales Call Intelligence Dashboard")

with open("../outputs/summary.txt") as f:
    data = f.read()

st.text(data)
