'use client';

import { useState } from 'react';
import { MODEL_OPTIONS, ModelProvider } from '@/app/types/models';

interface ModelSelectorProps {
  onModelSelect: (config: { provider: ModelProvider; model: string }) => void;
  defaultProvider?: ModelProvider;
  defaultModel?: string;
}

export function ModelSelector({ 
  onModelSelect, 
  defaultProvider = 'google', 
  defaultModel = 'gemini-2.5-flash-preview-04-17' 
}: ModelSelectorProps) {
  const [selectedProvider, setSelectedProvider] = useState<ModelProvider>(defaultProvider);
  const [selectedModel, setSelectedModel] = useState(defaultModel);
  const [isCustomModel, setIsCustomModel] = useState(false);
  const [customModel, setCustomModel] = useState('');

  const handleProviderChange = (provider: ModelProvider) => {
    setSelectedProvider(provider);
    // Reset custom model state when changing provider
    setIsCustomModel(false);
    // Select the first model of the new provider by default
    const firstModel = MODEL_OPTIONS[provider][0];
    setSelectedModel(firstModel);
    onModelSelect({ provider, model: firstModel });
  };

  const handleModelChange = (model: string) => {
    if (model === 'custom') {
      setIsCustomModel(true);
      setCustomModel('');
    } else {
      setIsCustomModel(false);
      setSelectedModel(model);
      onModelSelect({ provider: selectedProvider, model });
    }
  };

  const handleCustomModelChange = (value: string) => {
    setCustomModel(value);
    onModelSelect({ provider: selectedProvider, model: value });
  };

  return (
    <div className="flex gap-2 items-center flex-wrap">
      <select
        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1 text-sm"
        value={selectedProvider}
        onChange={(e) => handleProviderChange(e.target.value as ModelProvider)}
      >
        {Object.keys(MODEL_OPTIONS).map((provider) => (
          <option key={provider} value={provider}>
            {provider.charAt(0).toUpperCase() + provider.slice(1)}
          </option>
        ))}
      </select>

      <select
        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1 text-sm"
        value={isCustomModel ? 'custom' : selectedModel}
        onChange={(e) => handleModelChange(e.target.value)}
      >
        {MODEL_OPTIONS[selectedProvider].map((model) => (
          <option key={model} value={model}>
            {model}
          </option>
        ))}
        <option value="custom">Custom Version</option>
      </select>

      {isCustomModel && (
        <input
          type="text"
          placeholder="Enter custom model version"
          className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1 text-sm"
          value={customModel}
          onChange={(e) => handleCustomModelChange(e.target.value)}
        />
      )}
    </div>
  );
} 