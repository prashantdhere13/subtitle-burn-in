import {genkit} from 'genkit';
// import {ollama} from '@genkit-ai/ollama'; // Temporarily commented out due to installation issues

export const ai = genkit({
  plugins: [
    // ollama({ // Temporarily commented out due to installation issues
    //   // Ensure Ollama is running and accessible.
    //   // Default serverAddress is http://localhost:11434
    //   // You can specify a custom address if needed:
    //   // serverAddress: 'http://custom.ollama.host:port'
    // }),
  ],
  // Update this to the specific Llama model you have pulled in Ollama, e.g., 'ollama/llama3', 'ollama/llama2'
  // Make sure the model is available in your Ollama setup.
  // model: 'ollama/llama3', // Temporarily commented out as the ollama plugin providing it is disabled
});
