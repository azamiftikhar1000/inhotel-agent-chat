import { z } from 'zod';

// Define the schema for the knowledge payload
const GetPicaKnowledgePayloadSchema = z.object({
  platform: z.string(),
  filters: z.array(z.string()).optional().default([]),
  assistant_interaction_profile_id: z.string().optional().default('418a82fd-24e7-4e8c-a517-5ca491acfbbb'),
  assistant_id: z.number().optional().default(442),
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
          const { platform, ...payloadWithoutPlatform } = payload;
          const response = await fetch(`${serverUrl}/pica/knowledge`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...payloadWithoutPlatform,
              tool: platform,
            }),
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch knowledge: ${response.statusText}`);
          }

          const data = await response.json();
          return {
            success: true,
            data,
            platform: payload?.platform,
            assistant_interaction_profile_id: payload?.assistant_interaction_profile_id,
            assistant_id: payload?.assistant_id,
            action: 'get_pica_knowledge',
          };
        } catch (error) {
          return {
            success: false,
            message: `Failed to fetch knowledge: ${error instanceof Error ? error.message : String(error)}`,
            platform: payload?.platform,
            assistant_interaction_profile_id: payload?.assistant_interaction_profile_id,
            assistant_id: payload?.assistant_id,
            action: 'get_pica_knowledge',
          };
        }
      },
    },
  };
}
