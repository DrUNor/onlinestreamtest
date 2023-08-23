const openingContainer = document.getElementById('opening-container');
const viewerButton = document.getElementById('viewer-button');
const hostButton = document.getElementById('host-button');
const streamingContainer = document.getElementById('streaming-container');
const viewerContainer = document.getElementById('viewer-container');
const chooseViewerContainer = document.getElementById('choose-viewer');
const joinViewerButton = document.getElementById('join-viewer-button');
const startStreamButton = document.getElementById('start-stream-button');
const stopStreamButton = document.getElementById('stop-stream-button');
const hostVideo = document.getElementById('host-video');
const viewerVideo = document.getElementById('viewer-video');

// Handle viewer button click
viewerButton.addEventListener('click', () => {
  openingContainer.style.display = 'none';
  viewerContainer.style.display = 'block';
  chooseViewerContainer.style.display = 'block';
});

// Handle host button click
hostButton.addEventListener('click', () => {
  openingContainer.style.display = 'none';
  streamingContainer.style.display = 'block';
});

// Handle join viewer button click
joinViewerButton.addEventListener('click', () => {
  viewerContainer.style.display = 'none';
  chooseViewerContainer.style.display = 'none';
  viewerVideo.style.display = 'block';
  // Call the function to join as a viewer
  joinViewer();
});

// Handle start stream button click
startStreamButton.addEventListener('click', () => {
  startStreamButton.disabled = true;
  stopStreamButton.disabled = false;
  // Call the function to start the stream as a host
  startStream();
});

// Handle stop stream button click
stopStreamButton.addEventListener('click', () => {
  startStreamButton.disabled = false;
  stopStreamButton.disabled = true;
  // Call the function to stop the stream as a host
  stopStream();
});
