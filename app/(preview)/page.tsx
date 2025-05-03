"use client";

import { useRef, useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { useAuthKit } from "@picahq/authkit";
import { Header } from "./components/Header";
import { ChatMessages } from "./components/ChatMessages";
import { ChatInput } from "./components/ChatInput";
import { ModelSelector } from '@/app/components/ModelSelector';
import { ModelProvider } from '@/app/types/models';

export default function Home() {
  const [modelConfig, setModelConfig] = useState({
    provider: 'google' as ModelProvider,
    model: 'gemini-2.5-flash-preview-04-17'
  });

  const {
    messages,
    handleSubmit,
    input,
    handleInputChange,
    append,
    isLoading,
    stop,
    status,
  } = useChat({
    headers: {
      "X-Pica-Secret": "sk_test_1_nwJXddHdNPifkP8vB9UwqsItzNBkjz4lwacmSTnpM7Ps4G4oOKRALgsyok8uQR3o7ZqvXIZD4NUFp6GTjfKlFo196rtPNhjTAFi7vdMstfgpUsKJ4PJU5hy8aMbbd_PPxKkW1R8ng_Ivg9Rf6UPm19rAsRFjVT6SOeQtEy_7JRvSlemof_j9iZTnAIlX4NwedO_tZ0w3rbCwxCjv7nrzDhcp5f8IAWDgGqiDMrVZMQ" //"sk_test_1_3pejYG_SdSxV9xkt5_GA8WoMsSnfBHvY1qpGhlX-6DKd9kyZO3ee9hWfjGWpt5dY0AzxvM51q6_45_Q6bJTWCTuax7yq4X96nhvB0uTwhhLlsxyJm02JqasmdeDVeHt08GxGPoiBc7I9u00-1EKOejw62kNO0M1EaEFqwaGXw1Y8IfFH"
    },
    maxSteps: 20,
    api: '/api/chat',
    body: {
      modelConfig,
    },
  });

  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Add new useEffect to focus after loading completes
  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  const onModelSelect = (config: { provider: ModelProvider; model: string }) => {
    setModelConfig(config);
    console.log('Selected model configuration:', config);
  };

  return (
    <div className="flex flex-col justify-between h-dvh">
      <div className="flex flex-col h-full">
        <Header />
        <div className="mb-4 px-4">
          <ModelSelector 
            onModelSelect={onModelSelect}
            defaultProvider={modelConfig.provider}
            defaultModel={modelConfig.model}
          />
        </div>
        <ChatMessages messages={messages} isLoading={isLoading} />
        <ChatInput
          inputRef={inputRef}
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          status={status}
          stop={stop}
          messages={messages}
          append={append}
        />
      </div>
    </div>
  );
}
