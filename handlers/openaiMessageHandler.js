const { callOpenAIAPIService } = require('../openai-service');

async function handleOpenAIMessage(req, res) {
  try {
    if (!Array.isArray(req.body.messages)) {
      throw new Error("Invalid request: 'messages' must be an array");
    }

    const messages = req.body.messages.map(message => {
      if (typeof message !== 'object' || !message.role) {
        throw new Error("Invalid message format: Each 'message' object must have a 'role' property");
      }
      return message;
    });

    const openaiData = await callOpenAIAPIService(messages);

    res.json(openaiData);
  } catch (error) {
    if (error.message.includes("Invalid message format")) {
      return res.status(400).send(error.message);
    }
    
    console.error(`Error during OpenAI API call: ${error.message}`);
    res.status(503).send('Service unavailable. Could not reach the OpenAI GPT-4 API.');
  }
}

module.exports = { handleOpenAIMessage };