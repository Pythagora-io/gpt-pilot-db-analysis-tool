const fetch = require('node-fetch');

async function callOpenAIAPIService(messages) {
  const openaiApiKey = process.env.OPENAI_API_KEY;

  if (!openaiApiKey) {
    throw new Error('OpenAI API key is not defined in the environment variables.');
  }

  // Using a variable endpoint based on the model to support chat models
  const chatEndpoint = 'https://api.openai.com/v1/chat/completions';
  const completionsEndpoint = 'https://api.openai.com/v1/completions';

  let endpoint;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${openaiApiKey}`
  };
  
  let payload;
  // GPT-4 Turbo uses the chat API
  if(process.env.OPENAI_MODEL === 'gpt-4-turbo-preview') {
    endpoint = chatEndpoint;
    // Constructing the payload for the chat API
    payload = {
      model: 'gpt-4-turbo-preview',
      messages: messages.map(m => ({ role: m.role, content: m.content }))
    };
  } else {
    // Default to completions endpoint for other models
    endpoint = completionsEndpoint;
    // Constructing the payload for the completions API
    payload = {
      model: process.env.OPENAI_MODEL || 'gpt-3.5-openai',
      prompt: messages.map(m => m.content).join('\n'),
      max_tokens: 150,
      temperature: 0.5
    };
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const responseText = await response.text();
      throw new Error(`OpenAI API error: ${response.statusText} (HTTP status: ${response.status}) Details: ${responseText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error while calling OpenAI API service: ${error.message}`);
    throw new Error(`OpenAI API service error: ${error.message}`);
  }
}

module.exports = { callOpenAIAPIService };