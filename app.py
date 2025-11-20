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

@app.route("/howitworks")
def howitworks():
    return render_template("howitworks.html")

# @app.route("/learnmore")
# def learnmore():
#     return render_template("learnmore.html")

@app.route("/counselors")
def counselors():
    return render_template("ourcounclers.html")

@app.route("/chat.html")
def chatpage():
    return render_template("chat.html")

@app.route("/facecam.html")
def facecam():
    return render_template("facecam.html")

@app.route("/checkout")
def checkout():
    return render_template("checkout.html")

# @app.route("/log")
# def log():
#     return render_template("log.html")

# @app.route("/plan")
# def plan():
#     return render_template("plan.html")

@app.route("/emily.html")
def emily():
    return render_template("emily.html")

@app.route("/jane.html")
def jane():
    return render_template("jane.html")

@app.route("/john.html")
def john():
    return render_template("john.html")

@app.route("/learnmore.html")
def learnmore():
    return render_template("learnmore.html")


@app.route("/log.html")
def log():
    return render_template("log.html")

@app.route("/ourcounclers.html")
def ourcounclers():
    return render_template("ourcounclers.html")

@app.route("/plan.html")
def plan():
    return render_template("plan.html")

@app.route("/signup.html")
def signup():
    return render_template("signup.html")


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
