require('dotenv').config();
const fetch = require('node-fetch');

async function postToOpenAIAPI(messages) {
  const endpoint = process.env.OPENAI_MODEL === 'gpt-4-turbo-preview'
    ? 'https://api.openai.com/v1/chat/completions'
    : 'https://api.openai.com/v1/completions';

  const headers = {
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    'Content-Type': 'application/json'
  };

  let payload = {};
  if (process.env.OPENAI_MODEL === 'gpt-4-turbo-preview') {
    payload = {
      model: 'gpt-4-turbo-preview',
      messages: messages.map(m => {
        return {role: m.role || 'user', content: m.content};
      })
    };
  } else {
    payload = {
      prompt: messages.map(message => message.content).join("\n"),
      max_tokens: 150
    };
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorBody}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`OpenAI API call error: ${error.message}`);
    throw new Error(`Error while calling OpenAI API: ${error.message}`);
  }
}

module.exports = { postToOpenAIAPI };