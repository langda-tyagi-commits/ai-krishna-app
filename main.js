import Vapi from '@vapi-ai/web';

// ⚠️ IMPORTANT: Replace these with your actual values! ⚠️
const VAPI_PUBLIC_KEY = 'bbf2e7eb-76bc-4ef6-bab4-681644e71306'; // Replace this!
const ASSISTANT_ID = '569a79a6-6ed9-487f-9327-240b550ae641'; // Replace this!

// Initialize Vapi
const vapi = new Vapi(VAPI_PUBLIC_KEY);

// DOM elements
const micButton = document.getElementById('micButton');
const status = document.getElementById('status');
const loading = document.getElementById('loading');
const volumeIndicator = document.getElementById('volumeIndicator');
const volumeBar = document.getElementById('volumeBar');
const errorMessage = document.getElementById('errorMessage');

let isCallActive = false;

// Check credentials
if (VAPI_PUBLIC_KEY === 'your-public-key-here' || ASSISTANT_ID === 'your-assistant-id-here') {
    showError('Please replace VAPI_PUBLIC_KEY and ASSISTANT_ID in main.js with your actual values!');
}

// Handle mic button click
micButton.addEventListener('click', async () => {
    console.log('Mic button clicked');
    
    if (!isCallActive) {
        await startCall();
    } else {
        await stopCall();
    }
});

// Vapi event listeners
vapi.on('call-start', () => {
    console.log('Call started');
    loading.style.display = 'none';
    status.textContent = 'Connected - Speak now';
    volumeIndicator.style.display = 'block';
    hideError();
});

vapi.on('call-end', () => {
    console.log('Call ended');
    isCallActive = false;
    micButton.classList.remove('active');
    status.textContent = 'Call ended';
    volumeIndicator.style.display = 'none';
});

vapi.on('speech-start', () => {
    status.textContent = 'Krishna is speaking...';
});

vapi.on('speech-end', () => {
    status.textContent = 'Listening...';
});

vapi.on('volume-level', (volume) => {
    volumeBar.style.width = `${volume * 100}%`;
});

vapi.on('error', (error) => {
    console.error('Vapi error:', error);
    showError(`Error: ${error.message || error}`);
    loading.style.display = 'none';
});

async function startCall() {
    try {
        console.log('Starting call...');
        loading.style.display = 'block';
        status.textContent = '';
        hideError();
        
        // Start the call
        const call = await vapi.start(ASSISTANT_ID);
        console.log('Call started:', call);
        
        isCallActive = true;
        micButton.classList.add('active');
        
    } catch (error) {
        console.error('Error starting call:', error);
        loading.style.display = 'none';
        showError(`Error: ${error.message || 'Failed to start call'}`);
    }
}

async function stopCall() {
    try {
        console.log('Stopping call...');
        vapi.stop();
        isCallActive = false;
        micButton.classList.remove('active');
        status.textContent = 'Call ended';
        volumeIndicator.style.display = 'none';
    } catch (error) {
        console.error('Error stopping call:', error);
    }
}

function showError(message) {
    errorMessage.style.display = 'block';
    errorMessage.textContent = message;
    status.textContent = 'Error occurred';
}

function hideError() {
    errorMessage.style.display = 'none';
}