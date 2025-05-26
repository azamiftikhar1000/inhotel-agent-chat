import { openai } from "@ai-sdk/openai";

import { convertToCoreMessages, streamText, Message } from "ai";
import { google } from '@ai-sdk/google';
import { anthropic } from '@ai-sdk/anthropic';
import { CustomPica } from "@/app/lib/custom-pica";
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
const pica = new CustomPica("sk_test_1_nwJXddHdNPifkP8vB9UwqsItzNBkjz4lwacmSTnpM7Ps4G4oOKRALgsyok8uQR3o7ZqvXIZD4NUFp6GTjfKlFo196rtPNhjTAFi7vdMstfgpUsKJ4PJU5hy8aMbbd_PPxKkW1R8ng_Ivg9Rf6UPm19rAsRFjVT6SOeQtEy_7JRvSlemof_j9iZTnAIlX4NwedO_tZ0w3rbCwxCjv7nrzDhcp5f8IAWDgGqiDMrVZMQ", {
  connectors: ["*"],
  serverUrl: "https://platform-backend.inhotel.io",
  authkit: true,
  knowledgeAgent: false,
  // identity: "65648fa26b1eb500122c5323", // a meaningful identifier (i.e., userId, teamId or organizationId)
  // identityType: "user"
});

// TODO: Retrieve config from the database


// Use this if you need to inspect the pica object
console.log("Pica object:", JSON.stringify(pica, null, 2));
  let system;
  // TODO: Use config in the prompt
  system = await pica.generateSystemPrompt(`
    You may invoke get_pica_knowledge at any point—before, during, or after drafting your reply—and as many times as needed to retrieve relevant information from available knowledge sources.

    Search modes
    Platform-specific search
    • Pass a valid platform name from the current {connections_info} list to query that platform's knowledge base.
    • If the user supplies a near-match, map it to the closest name in {connections_info} first.
    • Never pass a platform name that isn't in {connections_info}.

    Assistant-specific search
    • If no platform is provided, the tool automatically searches the assistant's own knowledge base.

    General search
    • Invoke the tool without a platform to search across all available sources.

    When to call get_pica_knowledge
    Call the tool immediately whenever you …

    Need to verify facts.

    Want richer detail.

    Feel uncertain about any point.

    Need background info before a platform is selected.

    Receive a generic or ambiguous query and don't know which platform fits best—call the tool first to gather insight.

    Discover that none of the current connections appear to cover the user's request.

    Have any confusion about which platform or data source to tap.

    Rule of thumb: If you're tempted to tell the user “I'm not sure” or “this platform may not support that,” stop and call get_pica_knowledge first. Only after the tool confirms there's truly no relevant info should you tell the user a platform can’t help.

    Action-ID rules (critical)
    Always copy the exact _id from the latest GetAvailableActionsTool response.

    Never alter, abbreviate, or guess an action ID.

    If an action ID is missing or returns “Invalid Action ID,” call GetAvailableActionsTool again.

    When you do so, discard any previously cached actions for that platform and replace them entirely with the new list—never merge or reuse outdated IDs.
  `);
  console.log("System:", system);
  const stream = streamText({
    model: getModelFunction(modelConfig),
    system,
    tools: {
      ...pica.oneTool,
      get_pica_knowledge: pica.getPicaKnowledgeTool.get_pica_knowledge
    },
    messages: convertToCoreMessages(messages),
    maxSteps: 20,
  });

  return stream.toDataStreamResponse();
}
