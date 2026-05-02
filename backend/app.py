from flask import Flask, request, jsonify
from flask_cors import CORS
import anthropic
import os
import re

app = Flask(__name__)
CORS(app)

client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

FILLER_WORDS = [
    "um", "uh", "like", "you know", "basically", "literally", "actually",
    "honestly", "right", "so", "well", "I mean", "kind of", "sort of",
    "just", "anyway", "at the end of the day", "to be honest", "frankly",
    "obviously", "clearly", "essentially", "totally", "really", "very",
    "quite", "rather", "simply", "merely", "indeed", "perhaps", "maybe",
    "stuff", "things", "whatever", "and so", "but yeah", "okay so"
]

def highlight_fillers(text):
    """Find filler words and their positions in the text."""
    fillers_found = []
    text_lower = text.lower()
    
    for filler in FILLER_WORDS:
        pattern = r'\b' + re.escape(filler) + r'\b'
        for match in re.finditer(pattern, text_lower):
            fillers_found.append({
                "word": text[match.start():match.end()],
                "start": match.start(),
                "end": match.end()
            })
    
    fillers_found.sort(key=lambda x: x["start"])
    return fillers_found


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@app.route("/api/analyze", methods=["POST"])
def analyze():
    """Analyze text for filler words without removing them."""
    data = request.get_json()
    text = data.get("text", "").strip()
    
    if not text:
        return jsonify({"error": "No text provided"}), 400
    
    fillers = highlight_fillers(text)
    word_count = len(text.split())
    filler_count = len(fillers)
    
    return jsonify({
        "fillers": fillers,
        "word_count": word_count,
        "filler_count": filler_count,
        "filler_percentage": round((filler_count / word_count * 100) if word_count > 0 else 0, 1)
    })


@app.route("/api/remove", methods=["POST"])
def remove_fillers():
    """Use Claude AI to intelligently remove filler words."""
    data = request.get_json()
    text = data.get("text", "").strip()
    mode = data.get("mode", "balanced")  # strict, balanced, light
    
    if not text:
        return jsonify({"error": "No text provided"}), 400
    
    if len(text) > 5000:
        return jsonify({"error": "Text too long. Maximum 5000 characters."}), 400

    mode_instructions = {
        "strict": "Remove ALL filler words, hedging language, redundant phrases, and weak qualifiers. Make it concise and powerful.",
        "balanced": "Remove obvious filler words and unnecessary repetition while preserving the author's voice and natural flow.",
        "light": "Only remove the most egregious filler words (um, uh, like used as filler) while keeping the rest intact."
    }

    prompt = f"""You are an expert editor specializing in removing filler words and improving text clarity.

Mode: {mode.upper()} - {mode_instructions[mode]}

Common filler words to watch for: {', '.join(FILLER_WORDS[:20])}

Original text:
{text}

Instructions:
1. Remove filler words according to the {mode} mode
2. Preserve the meaning, tone, and key information
3. Return ONLY the cleaned text, no explanations
4. Maintain proper grammar after removals
5. Keep punctuation natural

Cleaned text:"""

    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=2000,
        messages=[{"role": "user", "content": prompt}]
    )
    
    cleaned_text = message.content[0].text.strip()
    
    original_words = len(text.split())
    cleaned_words = len(cleaned_text.split())
    words_removed = original_words - cleaned_words
    
    original_fillers = highlight_fillers(text)
    
    return jsonify({
        "original": text,
        "cleaned": cleaned_text,
        "stats": {
            "original_words": original_words,
            "cleaned_words": cleaned_words,
            "words_removed": words_removed,
            "reduction_percentage": round((words_removed / original_words * 100) if original_words > 0 else 0, 1),
            "fillers_detected": len(original_fillers)
        }
    })


@app.route("/api/suggest", methods=["POST"])
def suggest_improvements():
    """Get AI suggestions for improving the text beyond filler removal."""
    data = request.get_json()
    text = data.get("text", "").strip()
    
    if not text:
        return jsonify({"error": "No text provided"}), 400

    prompt = f"""Analyze this text and provide 3 specific, actionable suggestions to improve clarity and impact beyond just removing filler words.

Text: {text}

Respond in JSON format:
{{
  "suggestions": [
    {{"type": "suggestion_type", "issue": "what's wrong", "fix": "how to fix it"}}
  ],
  "overall_score": 1-10,
  "summary": "one sentence overall assessment"
}}"""

    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=800,
        messages=[{"role": "user", "content": prompt}]
    )
    
    response_text = message.content[0].text.strip()
    # Clean potential markdown
    response_text = re.sub(r'```json\n?|\n?```', '', response_text).strip()
    
    import json
    suggestions = json.loads(response_text)
    
    return jsonify(suggestions)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
