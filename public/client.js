const video = document.getElementById('video');
const videoContainer = document.getElementById('video-container');
const muteButton = document.getElementById('mute-button');
const unmuteButton = document.getElementById('unmute-button');
const fullscreenButton = document.getElementById('fullscreen-button');
const startStreamButton = document.getElementById('start-stream-button');
const stopStreamButton = document.getElementById('stop-stream-button');
const recordButton = document.getElementById('record-button');
const stopRecordButton = document.getElementById('stop-record-button');
const viewerVideo = document.getElementById('viewer-video');
const viewerButton = document.getElementById('viewer-button');
const socket = io();

let mediaRecorder;
let recordedChunks = [];

muteButton.addEventListener('click', () => {
  video.muted = true;
});

unmuteButton.addEventListener('click', () => {
  video.muted = false;
});

fullscreenButton.addEventListener('click', () => {
  if (videoContainer.requestFullscreen) {
    videoContainer.requestFullscreen();
  }
});

startStreamButton.addEventListener('click', async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  video.srcObject = stream;
  mediaRecorder = new MediaRecorder(stream);
  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      recordedChunks.push(event.data);
    }
  };
  mediaRecorder.start();
  socket.emit('startStream');
});

stopStreamButton.addEventListener('click', () => {
  video.srcObject = null;
  mediaRecorder.stop();
  socket.emit('stopStream');
});

recordButton.addEventListener('click', () => {
  recordedChunks = [];
  mediaRecorder.start();
});

stopRecordButton.addEventListener('click', () => {
  mediaRecorder.stop();
});

socket.on('stream', (data) => {
  const blob = new Blob([data], { type: 'video/webm' });
  const url = URL.createObjectURL(blob);
  video.src = url;
});

socket.on('startStream', () => {
  console.log('Stream started on another client.');
});

socket.on('stopStream', () => {
  console.log('Stream stopped on another client.');
});

socket.on('stream', (data) => {
  const blob = new Blob([data], { type: 'video/webm' });
  const url = URL.createObjectURL(blob);
  viewerVideo.src = url;
});

socket.on('startStream', () => {
  console.log('Stream started on another client.');
});

socket.on('stopStream', () => {
  console.log('Stream stopped on another client.');
});

viewerButton.addEventListener('click', () => {
  viewerButton.disabled = true; // Disable the button to prevent multiple clicks
  // Send a request to the server to join as a viewer
  socket.emit('joinViewer');
  // Hide the "Join as Viewer" button
  document.getElementById('choose-viewer').style.display = 'none';
});

socket.on('streamToViewers', (data) => {
  const blob = new Blob([data], { type: 'video/webm' });
  const url = URL.createObjectURL(blob);
  viewerVideo.src = url;
});