import { z } from 'zod';

// Define the schema for the knowledge payload
const GetPicaKnowledgePayloadSchema = z.object({
  platform: z.string(),
  query: z.string(),
  top_k: z.number().optional().default(3),
});

type GetPicaKnowledgePayload = z.infer<typeof GetPicaKnowledgePayloadSchema>;

// Create a function that returns a tool object compatible with Pica's tool interface
export function createPicaKnowledgeTool(serverUrl: string) {
  return {
    get_pica_knowledge: {
      description: 'Fetches knowledge for a given platform',
      parameters: GetPicaKnowledgePayloadSchema,
      execute: async (payload: GetPicaKnowledgePayload) => {
        try {
          const response = await fetch(`${serverUrl}/pica/knowledge`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch knowledge: ${response.statusText}`);
          }

          const data = await response.json();
          return {
            success: true,
            data,
            platform: payload.platform,
            action: 'get_pica_knowledge',
          };
        } catch (error) {
          return {
            success: false,
            message: `Failed to fetch knowledge: ${error instanceof Error ? error.message : String(error)}`,
            platform: payload.platform,
            action: 'get_pica_knowledge',
          };
        }
      },
    },
  };
}
