import { encrypt, decrypt, type Packet } from './index';

// Get DOM elements
const uidInput = document.getElementById('uid') as HTMLInputElement;
const requestIdInput = document.getElementById('requestId') as HTMLInputElement;
const encryptBtn = document.getElementById('encryptBtn') as HTMLButtonElement;
const encryptOutput = document.getElementById('encryptOutput') as HTMLDivElement;

const packetInput = document.getElementById('packetInput') as HTMLTextAreaElement;
const decryptBtn = document.getElementById('decryptBtn') as HTMLButtonElement;
const copyEncryptedBtn = document.getElementById('copyEncryptedBtn') as HTMLButtonElement;
const copyToClipboardBtn = document.getElementById('copyToClipboardBtn') as HTMLButtonElement;
const decryptOutput = document.getElementById('decryptOutput') as HTMLDivElement;

// Store the last encrypted packet
let lastEncryptedPacket: Packet | null = null;

// Encrypt button handler
encryptBtn.addEventListener('click', () => {
  try {
    const uid = uidInput.value.trim();
    const requestId = requestIdInput.value.trim();

    if (!uid) {
      throw new Error('X-UID cannot be empty');
    }

    if (!requestId) {
      throw new Error('Request ID cannot be empty');
    }

    // Build the payload in the required format
    const payload = JSON.stringify({ 'X-UID': uid });

    // Encrypt the payload
    const packet = encrypt(payload, requestId);
    lastEncryptedPacket = packet;

    // Display the encrypted packet
    encryptOutput.className = 'output success';
    encryptOutput.textContent = JSON.stringify(packet, null, 2);
  } catch (error) {
    encryptOutput.className = 'output error';
    encryptOutput.textContent = `Error: ${error instanceof Error ? error.message : String(error)}`;
    lastEncryptedPacket = null;
  }
});

// Copy to clipboard button handler
copyToClipboardBtn.addEventListener('click', async () => {
  if (lastEncryptedPacket) {
    try {
      await navigator.clipboard.writeText(JSON.stringify(lastEncryptedPacket, null, 2));
      
      // Visual feedback
      const originalText = copyToClipboardBtn.textContent;
      copyToClipboardBtn.textContent = '✓ Copied!';
      setTimeout(() => {
        copyToClipboardBtn.textContent = originalText;
      }, 1500);
    } catch (error) {
      alert('Failed to copy to clipboard');
    }
  }
});

// Copy encrypted packet button handler
copyEncryptedBtn.addEventListener('click', () => {
  if (lastEncryptedPacket) {
    packetInput.value = JSON.stringify(lastEncryptedPacket, null, 2);
    
    // Visual feedback
    const originalText = copyEncryptedBtn.textContent;
    copyEncryptedBtn.textContent = '✓ Copied!';
    setTimeout(() => {
      copyEncryptedBtn.textContent = originalText;
    }, 1500);
  }
});

// Decrypt button handler
decryptBtn.addEventListener('click', () => {
  try {
    const packetJson = packetInput.value.trim();

    if (!packetJson) {
      throw new Error('Packet input cannot be empty');
    }

    // Parse the packet
    const packet: Packet = JSON.parse(packetJson);

    // Decrypt the packet
    const result = decrypt(packet);

    // Display the decrypted result
    decryptOutput.className = 'output success';
    decryptOutput.textContent = JSON.stringify(result, null, 2);
  } catch (error) {
    decryptOutput.className = 'output error';
    decryptOutput.textContent = `Error: ${error instanceof Error ? error.message : String(error)}`;
  }
});

// Allow Enter key to trigger encrypt
uidInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    encryptBtn.click();
  }
});

requestIdInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    encryptBtn.click();
  }
});

// Allow Enter key to trigger decrypt (Ctrl+Enter in textarea)
packetInput.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'Enter') {
    decryptBtn.click();
  }
});
