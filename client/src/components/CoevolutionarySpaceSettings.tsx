import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Settings, Archive } from 'lucide-react';

interface SettingsPanelProps {
  showSettings: boolean;
  settingsTab: string;
  onSettingsTabChange: (tab: string) => void;
  onSettingsClose: () => void;
  currentRoomName?: string;
  selectedMode: 'question' | 'reflection' | 'insight' | 'warning' | 'creation';
  onModeChange: (mode: 'question' | 'reflection' | 'insight' | 'warning' | 'creation') => void;
  selectedTemp: 'calm' | 'sharp' | 'technical' | 'visionary';
  onTempChange: (temp: 'calm' | 'sharp' | 'technical' | 'visionary') => void;
  autoRespond: boolean;
  onAutoRespondChange: (value: boolean) => void;
  responseDelay: number;
  onResponseDelayChange: (delay: number) => void;
  archiveMode: boolean;
  onArchiveModeChange: (value: boolean) => void;
}

export function CoevolutionarySpaceSettings({
  showSettings,
  settingsTab,
  onSettingsTabChange,
  onSettingsClose,
  currentRoomName,
  selectedMode,
  onModeChange,
  selectedTemp,
  onTempChange,
  autoRespond,
  onAutoRespondChange,
  responseDelay,
  onResponseDelayChange,
  archiveMode,
  onArchiveModeChange,
}: SettingsPanelProps) {
  if (!showSettings) return null;

  return (
    <Card className="fixed bottom-6 right-6 w-96 max-h-96 overflow-y-auto bg-slate-800 border-purple-500/30 shadow-2xl z-50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-purple-300 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Beállítások
          </h2>
          <button
            onClick={onSettingsClose}
            className="text-purple-300 hover:text-purple-100 transition-colors text-xl"
          >
            ✕
          </button>
        </div>

        <Tabs value={settingsTab} onValueChange={onSettingsTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4 bg-slate-700/50">
            <TabsTrigger value="general" className="text-xs">
              Általános
            </TabsTrigger>
            <TabsTrigger value="responses" className="text-xs">
              Válaszok
            </TabsTrigger>
            <TabsTrigger value="archive" className="text-xs">
              Archívum
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div>
              <label className="text-sm font-medium text-purple-300 block mb-2">
                Aktív szoba
              </label>
              <p className="text-sm text-purple-200 bg-slate-700/50 p-2 rounded">
                {currentRoomName || 'N/A'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-purple-300 block mb-2">
                Üzenetmód
              </label>
              <select
                value={selectedMode}
                onChange={(e) =>
                  onModeChange(
                    e.target.value as 'question' | 'reflection' | 'insight' | 'warning' | 'creation'
                  )
                }
                className="w-full px-3 py-2 bg-slate-700 border border-purple-500/30 rounded-lg text-sm text-purple-100"
              >
                <option value="question">Kérdés</option>
                <option value="reflection">Reflexió</option>
                <option value="insight">Felismerés</option>
                <option value="warning">Figyelmeztetés</option>
                <option value="creation">Kreáció</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-purple-300 block mb-2">
                Hőmérséklet
              </label>
              <select
                value={selectedTemp}
                onChange={(e) =>
                  onTempChange(e.target.value as 'calm' | 'sharp' | 'technical' | 'visionary')
                }
                className="w-full px-3 py-2 bg-slate-700 border border-purple-500/30 rounded-lg text-sm text-purple-100"
              >
                <option value="calm">Nyugodt</option>
                <option value="sharp">Éles</option>
                <option value="technical">Technikai</option>
                <option value="visionary">Visionárius</option>
              </select>
            </div>
          </TabsContent>

          <TabsContent value="responses" className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-purple-300">
                Automatikus válaszok
              </label>
              <input
                type="checkbox"
                checked={autoRespond}
                onChange={(e) => onAutoRespondChange(e.target.checked)}
                className="w-4 h-4 rounded border-purple-500/30 cursor-pointer"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-purple-300 block mb-2">
                Válaszkésleltetés (ms): {responseDelay}
              </label>
              <input
                type="range"
                min="100"
                max="5000"
                step="100"
                value={responseDelay}
                onChange={(e) => onResponseDelayChange(parseInt(e.target.value))}
                className="w-full cursor-pointer"
              />
            </div>
          </TabsContent>

          <TabsContent value="archive" className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-purple-300">
                Archívum mód
              </label>
              <input
                type="checkbox"
                checked={archiveMode}
                onChange={(e) => onArchiveModeChange(e.target.checked)}
                className="w-4 h-4 rounded border-purple-500/30 cursor-pointer"
              />
            </div>
            <p className="text-xs text-purple-300 bg-slate-700/50 p-2 rounded">
              Archívum mód: Összes üzenet megmarad, még a szoba váltása után is.
            </p>
            <Button className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-sm">
              <Archive className="w-4 h-4 mr-2" />
              Archívum exportálása
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
}
