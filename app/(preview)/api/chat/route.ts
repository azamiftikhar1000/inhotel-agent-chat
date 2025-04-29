import { openai } from "@ai-sdk/openai";

import { convertToCoreMessages, streamText, Message } from "ai";
import { google } from '@ai-sdk/google';
import { anthropic } from '@ai-sdk/anthropic';
import { Pica } from "@picahq/ai";

type ModelProvider = 'openai' | 'anthropic' | 'google';
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
const pica = new Pica("sk_test_1_3pejYG_SdSxV9xkt5_GA8WoMsSnfBHvY1qpGhlX-6DKd9kyZO3ee9hWfjGWpt5dY0AzxvM51q6_45_Q6bJTWCTuax7yq4X96nhvB0uTwhhLlsxyJm02JqasmdeDVeHt08GxGPoiBc7I9u00-1EKOejw62kNO0M1EaEFqwaGXw1Y8IfFH", {
  connectors: ["*"],
  serverUrl: "https://platform-backend.inhotel.io",
  authkit: true,
  knowledgeAgent: true,
  // identity: "65648fa26b1eb500122c5323", // a meaningful identifier (i.e., userId, teamId or organizationId)
  // identityType: "user"
});

// Use this if you need to inspect the pica object
console.log("Pica object:", JSON.stringify(pica, null, 2));

  const system = await pica.generateSystemPrompt();

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
