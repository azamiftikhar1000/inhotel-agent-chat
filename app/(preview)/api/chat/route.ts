import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText, Message } from "ai";
import { Pica } from "@picahq/ai";

export async function POST(request: Request) {
  const { messages }: { messages: Message[] } = await request.json();
// Add a console.log to debug URLs
console.log("Server URL:", process.env.PICA_SERVER_URL);

console.log("Creating Pica with server URL:", "https://platform-backend.inhotel.io");
const pica = new Pica("sk_test_1_3pejYG_SdSxV9xkt5_GA8WoMsSnfBHvY1qpGhlX-6DKd9kyZO3ee9hWfjGWpt5dY0AzxvM51q6_45_Q6bJTWCTuax7yq4X96nhvB0uTwhhLlsxyJm02JqasmdeDVeHt08GxGPoiBc7I9u00-1EKOejw62kNO0M1EaEFqwaGXw1Y8IfFH", {
  connectors: ["*"],
  serverUrl: "https://platform-backend.inhotel.io",
  knowledgeAgent: true,
  knowledgeAgentConfig: {
    includeEnvironmentVariables: false,
  },
});

// Use this if you need to inspect the pica object
console.log("Pica object:", JSON.stringify(pica, null, 2));

  const system = await pica.generateSystemPrompt();

  const stream = streamText({
    model: openai("gpt-4.1"),
    system,
    tools: {
      ...pica.oneTool,
    },
    messages: convertToCoreMessages(messages),
    maxSteps: 20,
  });

  return stream.toDataStreamResponse();
}
