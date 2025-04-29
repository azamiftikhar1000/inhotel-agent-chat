'use client';

import { useChat } from 'ai/react';
import { ModelSelector } from './ModelSelector';
import { useState } from 'react';
import { ModelProvider } from '@/app/types/models';

export function Chat() {
  const [modelConfig, setModelConfig] = useState({
    provider: 'anthropic' as ModelProvider,
    model: 'claude-3-sonnet'
  });

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
    body: {
      modelConfig, // This will be sent to the API
    },
  });

  const onModelSelect = (config: { provider: ModelProvider; model: string }) => {
    setModelConfig(config);
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto p-4">
      <div className="mb-4">
        <ModelSelector onModelSelect={onModelSelect} />
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${
              message.role === 'assistant' ? 'text-blue-600' : 'text-gray-800'
            }`}
          >
            <strong>{message.role}:</strong> {message.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Say something..."
          className="flex-1 border border-gray-300 rounded-md px-3 py-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Send
        </button>
      </form>
    </div>
  );
} 