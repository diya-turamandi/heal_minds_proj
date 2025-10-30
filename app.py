from flask import Flask, render_template, request, jsonify
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import base64

app = Flask(__name__)

# Load your emotion detection model (make sure emotion_model.h5 is in the same folder)
model = tf.keras.models.load_model("emotion_model.h5")

# Example labels — replace with your model's labels if different
EMOTIONS = ["Angry","Disgust","Fear","Happy","Sad","Surprise","Neutral",
            "Contempt","Anxiety","Boredom","Concentration","Confusion","Content",
            "Desire","Disappointment","Frustration","Pride","Relief","Shame"]

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    # Expecting JSON with a Base64 image string under key "image"
    data = request.json.get("image")
    if not data:
        return jsonify({"error":"no image provided"}), 400

    # Decode base64 image
    image_data = base64.b64decode(data.split(",")[1])
    img = Image.open(io.BytesIO(image_data)).convert("L").resize((48, 48))

    img_array = np.array(img) / 255.0
    img_array = img_array.reshape(1, 48, 48, 1)

    prediction = model.predict(img_array)
    emotion_index = int(np.argmax(prediction))
    emotion_label = EMOTIONS[emotion_index] if emotion_index < len(EMOTIONS) else f"#{emotion_index}"

    return jsonify({"emotion": emotion_label})

if __name__ == "__main__":
    # Use 0.0.0.0 if you plan to test from other devices on the same network
    app.run(host="127.0.0.1", port=5000, debug=True)
