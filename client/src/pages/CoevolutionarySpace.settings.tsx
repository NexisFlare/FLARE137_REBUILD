// Settings Panel Component for CoevolutionarySpace
// This will be integrated into the main component

export const SettingsPanelContent = `
{/* Settings Panel Modal */}
{showSettings && (
  <Card className="fixed bottom-6 right-6 w-96 bg-slate-800 border-purple-500/30 shadow-2xl z-50">
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-purple-300 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Beállítások
        </h2>
        <button
          onClick={() => setShowSettings(false)}
          className="text-purple-300 hover:text-purple-100 transition-colors"
        >
          ✕
        </button>
      </div>

      <Tabs value={settingsTab} onValueChange={setSettingsTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="general">Általános</TabsTrigger>
          <TabsTrigger value="responses">Válaszok</TabsTrigger>
          <TabsTrigger value="archive">Archívum</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <div>
            <label className="text-sm font-medium text-purple-300 block mb-2">
              Aktív szoba
            </label>
            <p className="text-sm text-purple-200">{currentRoom?.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-purple-300 block mb-2">
              Üzenetmód
            </label>
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value as Message['mode'])}
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
              onChange={(e) => setSelectedTemp(e.target.value as Message['temperature'])}
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
              onChange={(e) => setAutoRespond(e.target.checked)}
              className="w-4 h-4 rounded border-purple-500/30"
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
              onChange={(e) => setResponseDelay(parseInt(e.target.value))}
              className="w-full"
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
              onChange={(e) => setArchiveMode(e.target.checked)}
              className="w-4 h-4 rounded border-purple-500/30"
            />
          </div>
          <p className="text-xs text-purple-300">
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
)}
`;
