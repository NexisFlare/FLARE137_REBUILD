import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { ChevronDown, Zap } from 'lucide-react';

interface ModelVersion {
  id: string;
  name: string;
  version: string;
  family: string;
  provider: string;
  capabilities: {
    streaming: boolean;
    vision: boolean;
    functionCalling: boolean;
    contextWindow: number;
    maxOutputTokens: number;
  };
  costPer1kInputTokens: number;
  costPer1kOutputTokens: number;
  releaseDate: string;
  deprecated: boolean;
}

interface ModelFamily {
  id: string;
  name: string;
  provider: string;
  description: string;
  versions: ModelVersion[];
}

interface ModelSelectorProps {
  modelFamilies: Record<string, ModelFamily>;
  selectedFamily: string;
  selectedVersion: string;
  onFamilyChange: (familyId: string) => void;
  onVersionChange: (versionId: string) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  modelFamilies,
  selectedFamily,
  selectedVersion,
  onFamilyChange,
  onVersionChange,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  
  const currentFamily = modelFamilies[selectedFamily];
  const currentVersion = currentFamily?.versions.find(v => v.id === selectedVersion);
  
  const families = Object.values(modelFamilies);

  return (
    <div className="space-y-4">
      {/* Family Selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Model Family</label>
        <Select value={selectedFamily} onValueChange={onFamilyChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select model family" />
          </SelectTrigger>
          <SelectContent>
            {families.map(family => (
              <SelectItem key={family.id} value={family.id}>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{family.name}</span>
                  <span className="text-xs text-muted-foreground">({family.provider})</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Version Selector */}
      {currentFamily && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Model Version</label>
          <Select value={selectedVersion} onValueChange={onVersionChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select version" />
            </SelectTrigger>
            <SelectContent>
              {currentFamily.versions.map(version => (
                <SelectItem key={version.id} value={version.id}>
                  <div className="flex items-center gap-2">
                    <span>{version.name}</span>
                    {version.deprecated && (
                      <span className="text-xs text-destructive">(Deprecated)</span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Model Details */}
      {currentVersion && (
        <Card className="p-4 bg-secondary/50 border-secondary/20">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center justify-between w-full"
          >
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <span className="font-semibold text-sm">{currentVersion.name}</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${showDetails ? 'rotate-180' : ''}`}
            />
          </button>

          {showDetails && (
            <div className="mt-4 space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-muted-foreground">Provider</span>
                  <p className="font-medium">{currentVersion.provider}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Release Date</span>
                  <p className="font-medium">{new Date(currentVersion.releaseDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="border-t border-border pt-3">
                <span className="text-muted-foreground block mb-2">Capabilities</span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <span className={currentVersion.capabilities.streaming ? 'text-green-600' : 'text-red-600'}>
                      ●
                    </span>
                    <span className="text-sm">Streaming</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={currentVersion.capabilities.vision ? 'text-green-600' : 'text-red-600'}>
                      ●
                    </span>
                    <span className="text-sm">Vision</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={currentVersion.capabilities.functionCalling ? 'text-green-600' : 'text-red-600'}>
                      ●
                    </span>
                    <span className="text-sm">Function Calling</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-3">
                <span className="text-muted-foreground block mb-2">Context Window</span>
                <p className="font-medium text-sm">
                  {currentVersion.capabilities.contextWindow.toLocaleString()} tokens
                </p>
              </div>

              <div className="border-t border-border pt-3">
                <span className="text-muted-foreground block mb-2">Max Output Tokens</span>
                <p className="font-medium text-sm">
                  {currentVersion.capabilities.maxOutputTokens.toLocaleString()} tokens
                </p>
              </div>

              <div className="border-t border-border pt-3">
                <span className="text-muted-foreground block mb-2">Pricing (per 1K tokens)</span>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Input</span>
                    <p className="font-medium">${currentVersion.costPer1kInputTokens.toFixed(6)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Output</span>
                    <p className="font-medium">${currentVersion.costPer1kOutputTokens.toFixed(6)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default ModelSelector;
