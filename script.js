// Get access to the webcam
const video = document.getElementById("video");
let net; // Declare posenet model globally

// Function to initialize pose detection
async function initializePoseDetection() {
  net = await posenet.load();
  console.log("PoseNet model loaded.");

  // Continuously detect poses
  async function detectPose() {
    const pose = await net.estimateSinglePose(video, {
      flipHorizontal: true,
    });

    // Check if a human body is detected
    if (pose.score > 0.5) {
      console.log("Human body detected!");
      // You can add your logic here to notify the user
      document.body.style.backgroundColor = "green"; // Example: change background color
    } else {
      document.body.style.backgroundColor = "white"; // Reset background color
    }

    requestAnimationFrame(detectPose);
  }

  detectPose();
}

// Function to start camera with specified device ID
async function startCamera(deviceId) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId: { exact: deviceId } },
    });
    video.srcObject = stream;
    console.log("Camera access granted.");
    initializePoseDetection();
  } catch (err) {
    console.error("Camera access denied: ", err);
  }
}

// Function to handle camera change
function handleCameraChange() {
  const selectedDevice = this.value;
  startCamera(selectedDevice);
}

// Start the camera with default device
async function startWithDefaultCamera() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(
      (device) => device.kind === "videoinput"
    );
    if (videoDevices.length === 0) {
      throw new Error("No video input devices found.");
    }

    // Create options for camera selection
    const selectCamera = document.createElement("select");
    selectCamera.addEventListener("change", handleCameraChange);
    videoDevices.forEach((device) => {
      const option = document.createElement("option");
      option.value = device.deviceId;
      option.text = device.label || `Camera ${selectCamera.length + 1}`;
      selectCamera.appendChild(option);
    });
    document.body.appendChild(selectCamera);

    // Start with the first camera by default
    startCamera(videoDevices[0].deviceId);
  } catch (err) {
    console.error("Error starting camera: ", err);
  }
}

startWithDefaultCamera();
