from flask import Flask, render_template, request, jsonify
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import base64

app = Flask(__name__)

# =========================
# LOAD EMOTION MODEL
# =========================
model = tf.keras.models.load_model("emotion_model.h5")

# Emotion labels (must match model output)
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

@app.route("/chat")
def chat():
    return render_template("chat.html")

@app.route("/counselors")
def counselors():
    return render_template("ourcounclers.html")

@app.route("/checkout")
def checkout():
    return render_template("checkout.html")

@app.route("/learnmore")
def learnmore():
    return render_template("learnmore.html")

# =========================
# EMOTION PREDICTION API
# =========================

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json.get("image")

    if not data:
        return jsonify({"error": "No image provided"}), 400

    try:
        # Decode base64 image
        image_data = base64.b64decode(data.split(",")[1])
        img = Image.open(io.BytesIO(image_data)).convert("L")
        img = img.resize((48, 48))

        img_array = np.array(img) / 255.0
        img_array = img_array.reshape(1, 48, 48, 1)

        prediction = model.predict(img_array)
        emotion_index = int(np.argmax(prediction))

        emotion = (
            EMOTIONS[emotion_index]
            if emotion_index < len(EMOTIONS)
            else "Unknown"
        )

        return jsonify({"emotion": emotion})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# =========================
# EMOTION SUGGESTION API
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
        "Confusion": "Pause and focus on one thing at a time.",
        "Frustration": "Relax your shoulders and take a deep breath."
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
