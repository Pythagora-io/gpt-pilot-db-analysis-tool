function simulateOpenAIResponse(messages) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!Array.isArray(messages)) {
        return reject(new Error('Invalid input: messages should be an array.'));
      }
      const mockApiResponse = {
        id: '0',
        object: 'text_completion',
        created: Math.floor(Date.now() / 1000),
        model: 'text-davinci-002',
        choices: [
          {
            text: 'Mock response from the OpenAI GPT-4 API',
            index: 0,
            logprobs: null,
            finish_reason: 'length'
          }
        ]
      };
      resolve(mockApiResponse);
    }, 1000);
  });
}

module.exports = { simulateOpenAIResponse };