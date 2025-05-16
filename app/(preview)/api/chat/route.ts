import { openai } from "@ai-sdk/openai";

import { convertToCoreMessages, streamText, Message } from "ai";
import { google } from '@ai-sdk/google';
import { anthropic } from '@ai-sdk/anthropic';
import { Pica } from "@picahq/ai";
import { cerebras, createCerebras } from '@ai-sdk/cerebras';

type ModelProvider = 'openai' | 'anthropic' | 'google' | 'cerebras';
type ModelConfig = {
  provider: ModelProvider;
  model: string;
};

function getModelFunction(config: ModelConfig) {
  switch (config.provider) {
    case 'openai':
      return openai(config.model);
    case 'anthropic':
      return anthropic(config.model);
    case 'google':
      return google(config.model);
    case 'cerebras':
      return cerebras(config.model);
    default:
      throw new Error('Invalid model provider');
  }
}

export async function POST(request: Request) {
  const { messages, modelConfig }: { 
    messages: Message[], 
    modelConfig: ModelConfig 
  } = await request.json();
// Add a console.log to debug URLs
console.log("Server URL:", process.env.PICA_SERVER_URL);

console.log("Creating Pica with server URL:", "https://platform-backend.inhotel.io");
const pica = new Pica("sk_test_1_nwJXddHdNPifkP8vB9UwqsItzNBkjz4lwacmSTnpM7Ps4G4oOKRALgsyok8uQR3o7ZqvXIZD4NUFp6GTjfKlFo196rtPNhjTAFi7vdMstfgpUsKJ4PJU5hy8aMbbd_PPxKkW1R8ng_Ivg9Rf6UPm19rAsRFjVT6SOeQtEy_7JRvSlemof_j9iZTnAIlX4NwedO_tZ0w3rbCwxCjv7nrzDhcp5f8IAWDgGqiDMrVZMQ", {
  connectors: ["*"],
  serverUrl: "https://platform-backend.inhotel.io",
  authkit: true,
  knowledgeAgent: false,
  // identity: "65648fa26b1eb500122c5323", // a meaningful identifier (i.e., userId, teamId or organizationId)
  // identityType: "user"
});

// Use this if you need to inspect the pica object
console.log("Pica object:", JSON.stringify(pica, null, 2));
  let system;
  system = await pica.generateSystemPrompt('');

  const stream = streamText({
    model: getModelFunction(modelConfig),
    system,
    tools: {
      ...pica.oneTool,
    },
    messages: convertToCoreMessages(messages),
    maxSteps: 20,
  });

  return stream.toDataStreamResponse();
}
