const openingContainer = document.getElementById('opening-container');
const viewerButton = document.getElementById('viewer-button');
const hostButton = document.getElementById('host-button');
const streamingContainer = document.getElementById('streaming-container');
const viewerContainer = document.getElementById('viewer-container');
const chooseViewerContainer = document.getElementById('choose-viewer');
const startStreamButton = document.getElementById('start-stream-button');
const stopStreamButton = document.getElementById('stop-stream-button');
const muteButton = document.getElementById('mute-button');
const unmuteButton = document.getElementById('unmute-button');
const hostVideo = document.getElementById('host-video');
const waitingMessage = document.getElementById('waiting-message'); // Add this line

let mediaStream = null;
let isMuted = false;


// Handle viewer button click
viewerButton.addEventListener('click', () => {
  openingContainer.style.display = 'none';
  viewerContainer.style.display = 'block';
  waitingMessage.style.display = 'block'; // Show waiting message
  // Call the function to connect to the host's stream
  connectToHostStream();
});



// Handle host button click
hostButton.addEventListener('click', () => {
  openingContainer.style.display = 'none';
  streamingContainer.style.display = 'block';
});


// Handle start stream button click
startStreamButton.addEventListener('click', () => {
  startStreamButton.disabled = true;
  stopStreamButton.disabled = false;
  muteButton.style.display = 'inline-block';
  // Call the function to start the stream as a host
  startStream();
});

// Handle stop stream button click
stopStreamButton.addEventListener('click', () => {
  startStreamButton.disabled = false;
  stopStreamButton.disabled = true;
  muteButton.style.display = 'none';
  unmuteButton.style.display = 'none';
  // Call the function to stop the stream as a host
  stopStream();
});

// Handle mute button click
muteButton.addEventListener('click', () => {
  mediaStream.getAudioTracks()[0].enabled = false;
  muteButton.style.display = 'none';
  unmuteButton.style.display = 'inline-block';
});

// Handle unmute button click
unmuteButton.addEventListener('click', () => {
  mediaStream.getAudioTracks()[0].enabled = true;
  unmuteButton.style.display = 'none';
  muteButton.style.display = 'inline-block';
});

// Start stream function
async function startStream() {
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    hostVideo.srcObject = mediaStream;
    hostVideo.play();
    // Emit 'startStream' event to the server
    socket.emit('startStream');
  } catch (error) {
    console.error('Error starting stream:', error);
  }
}

// Stop stream function
function stopStream() {
  if (mediaStream) {
    mediaStream.getTracks().forEach((track) => track.stop());
    mediaStream = null;
    hostVideo.srcObject = null;
    // Emit 'stopStream' event to the server
    socket.emit('stopStream');
  }
}

// Create Socket.IO connection
const socket = io();

// Join as viewer function
function joinViewer() {
  try {
    mediaStream = new MediaStream();
    const viewerStream = viewerVideo.captureStream();
    mediaStream.addTrack(viewerStream.getAudioTracks()[0]);
    // Emit 'joinViewer' event to the server
    socket.emit('joinViewer');
    // Call the function to connect to the host's stream
    connectToHostStream();
  } catch (error) {
    console.error('Error joining as viewer:', error);
  }
}

// Connect to host's stream function
function connectToHostStream() {
  const viewerSocket = io();
  
  viewerSocket.on('startStream', () => {
    waitingMessage.style.display = 'none'; // Hide waiting message when stream starts
  });
  
  viewerSocket.on('stream', (data) => {
    const blob = new Blob([data], { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    viewerVideo.src = url;
  });
}