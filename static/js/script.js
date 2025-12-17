const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const detectBtn = document.getElementById("detectBtn");
const result = document.getElementById("result");
console.log("script.js loaded");

// Start webcam
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
  } catch (err) {
    alert("Could not access webcam: " + err.message);
  }
}
startCamera();

// Capture frame and send to backend
detectBtn.addEventListener("click", async () => {

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const imageData = canvas.toDataURL("image/jpeg");

  try {
    const resp = await fetch("/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: imageData })
    });

    const data = await resp.json();

    if (data.error) {
      result.textContent = "Error: " + data.error;
    } else {
      // ✅ Show detected emotion
      result.textContent = "Emotion: " + data.emotion;

      // ✅ THIS LINE WAS MISSING — ADD IT
      showSuggestionPopup(data.emotion);
    }

  } catch (err) {
    result.textContent = "Request failed: " + err.message;
  }
});
