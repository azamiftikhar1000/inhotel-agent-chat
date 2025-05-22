import { Pica } from '@picahq/ai';
import { createPicaKnowledgeTool } from './tools/pica-knowledge-tool';
import { z } from 'zod';

export class CustomPica extends Pica {
  public getPicaKnowledgeTool: ReturnType<typeof createPicaKnowledgeTool>;
  
  constructor(secretKey: string, options?: any) {
    super(secretKey, options);
    this.getPicaKnowledgeTool = createPicaKnowledgeTool('https://backend.inhotel.io');
  }

  get intelligenceTool() {
    const baseTool = super.intelligenceTool;
    
    // Add get_pica_knowledge to the baseTool
    return {
      ...baseTool,
      get_pica_knowledge: this.getPicaKnowledgeTool.get_pica_knowledge
    };
  }
} 