from flask import Flask, render_template, request, jsonify
import random

app = Flask(__name__)

# TEMP EMOTIONS LIST
EMOTIONS = [
    "Angry", "Disgust", "Fear", "Happy", "Sad", "Surprise", "Neutral",
    "Contempt", "Anxiety", "Boredom", "Concentration", "Confusion", "Content",
    "Desire", "Disappointment", "Frustration", "Pride", "Relief", "Shame"
]

# =========================
# PAGE ROUTES
# =========================

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/facecam")
def facecam():
    return render_template("facecam.html")

@app.route("/login")
def login():
    return render_template("log.html")

@app.route("/signup")
def signup():
    return render_template("signup.html")

@app.route("/counselors")
def counselors():
    return render_template("ourcounclers.html")

@app.route("/chat")
def chat():
    return render_template("chat.html")
@app.route("/jane")
def jane():
    return render_template("jane.html")
@app.route("/emily")
def emily():
    return render_template("emily.html")    
@app.route("/john")
def john():
    return render_template("john.html") 

# =========================
# TEMP PREDICTION (RANDOM)
# =========================

@app.route("/predict", methods=["POST"])
def predict():
    # Just return a random emotion for submission
    emotion = random.choice(EMOTIONS)
    return jsonify({"emotion": emotion})

# =========================
# SUGGESTION API
# =========================

@app.route("/suggestion/<emotion>")
def suggestion(emotion):
    suggestions = {
        "Happy": "Keep smiling 😊 Take a moment to appreciate something good today.",
        "Sad": "It's okay to feel sad. Try taking 5 deep breaths and drink some water.",
        "Angry": "Pause for a moment. Try counting from 1 to 10 slowly.",
        "Fear": "You are safe right now. Focus on something you can see around you.",
        "Surprise": "New moments can be exciting. Take a calm breath.",
        "Neutral": "You seem calm. Maintain this balance with a short mindful break.",
        "Disgust": "Take a slow breath and ground yourself.",
        "Anxiety": "Try box breathing: inhale 4s, hold 4s, exhale 4s.",
        "Boredom": "Stretch or take a short mindful pause.",
        "Concentration": "Focus is great! Take a short break to refresh your mind.",
        "Confusion": "Pause and focus on one thing at a time.",
        "Content": "Enjoy the calm moment you have.",
        "Desire": "Consider your goal and take a small step forward.",
        "Disappointment": "It's okay. Reflect and plan your next move.",
        "Frustration": "Relax your shoulders and take a deep breath.",
        "Pride": "Celebrate your achievement! You earned it.",
        "Relief": "Good job! Take a moment to relax and breathe.",
        "Shame": "Remember, mistakes are part of learning. Be kind to yourself.",
        "Contempt": "Try to release negativity and focus on something positive."
    }

    return jsonify({
        "suggestion": suggestions.get(
            emotion,
            "Take a short mindful break and be kind to yourself."
        )
    })

# =========================
# RUN APP
# =========================

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
