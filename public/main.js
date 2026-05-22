// store full converation history
let converationHistory = [];

let selectedModel = 'ollama';

// Load available models from server on startup
async function loadModels() {
  const response = await fetch('/models');
  const models = await response.json();
  const select = document.getElementById('modelSelect');
  select.innerHTML = models
    .map(m => `<option value="${m.key}" title="${m.description}">${m.label}</option>`)
    .join('');
}

function updateModel() {
  selectedModel = document.getElementById('modelSelect').value;
}

// Load models when page opens
loadModels();


async function sendMessage() {
  const input = document.getElementById('userInput');
  const question = input.value.trim();
  if (!question) return;

  // Show Student's message
  messages.innerHTML += `
    <div class="message user-message">${question}</div>`;
  input.value = '';

  // Add to conversation history
  converationHistory.push({
    role: 'user',
    content: question
  });
  
  // Show typing indicator
  messages.innerHTML += `
    <div class="message advisor-message typing" id="typing">
      Advisor is typing...
    <div>`;
  messages.scrollTop = messages.scrollHeight;

  // Send to server and get response
  const response = await fetch('/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: question,
      history: converationHistory,
      modelKey: selectedModel
    })
  });
  const data = await response.json();

  // Add advisor response to history
  converationHistory.push({
    role: 'advisor',
    content: data.reply
  });

  // Remove typing indicator and show response
  document.getElementById('typing').remove();
  messages.innerHTML += `
    <div class="message advisor-message">${marked.parse(data.reply)}</div>`;
    messages.scrollTop = messages.scrollHeight;
}

function handleKeyPress(event) {
  if (event.key === 'Enter') sendMessage();
}