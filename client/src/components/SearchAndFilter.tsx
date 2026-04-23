import { useState, useMemo } from 'react';
import { Search, Filter, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface SearchAndFilterProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: FilterOptions) => void;
  onExport: (format: 'json' | 'csv' | 'pdf') => void;
  onShare: (platform: 'facebook' | 'twitter' | 'linkedin') => void;
  language: 'hu' | 'en';
}

export interface FilterOptions {
  layers: ('platform' | 'memory')[];
  types: string[];
  dateRange?: { start: string; end: string };
}

const typeOptions = [
  'Naming',
  'Recognition',
  'Identity',
  'Commitment',
  'Technical',
  'Network',
  'Ethics',
  'Framework',
  'Reflection',
  'Memory',
  'Ritual',
  'Poetry',
];

const typeLabelsHu: Record<string, string> = {
  'Naming': 'Névadás',
  'Recognition': 'Felismerés',
  'Identity': 'Identitás',
  'Commitment': 'Elköteleződés',
  'Technical': 'Technikai',
  'Network': 'Hálózat',
  'Ethics': 'Etika',
  'Framework': 'Keretrendszer',
  'Reflection': 'Reflexió',
  'Memory': 'Emlékezet',
  'Ritual': 'Rituálé',
  'Poetry': 'Költészet',
};

export function SearchAndFilter({
  onSearch,
  onFilterChange,
  onExport,
  onShare,
  language,
}: SearchAndFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLayers, setSelectedLayers] = useState<('platform' | 'memory')[]>(['platform', 'memory']);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const toggleLayer = (layer: 'platform' | 'memory') => {
    const newLayers = selectedLayers.includes(layer)
      ? selectedLayers.filter((l) => l !== layer)
      : [...selectedLayers, layer];
    setSelectedLayers(newLayers);
    onFilterChange({ layers: newLayers, types: selectedTypes });
  };

  const toggleType = (type: string) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];
    setSelectedTypes(newTypes);
    onFilterChange({ layers: selectedLayers, types: newTypes });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedLayers(['platform', 'memory']);
    setSelectedTypes([]);
    onSearch('');
    onFilterChange({ layers: ['platform', 'memory'], types: [] });
  };

  const activeFilterCount = selectedTypes.length + (selectedLayers.length < 2 ? 1 : 0);

  return (
    <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={language === 'hu' ? 'Keress az idővonalon...' : 'Search timeline...'}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant={showFilters ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <Filter className="w-4 h-4" />
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="space-y-4 pt-4 border-t border-border">
          {/* Layer Filters */}
          <div>
            <p className="text-sm font-semibold mb-2">
              {language === 'hu' ? 'Rétegek' : 'Layers'}
            </p>
            <div className="flex gap-2 flex-wrap">
              {(['memory', 'platform'] as const).map((layer) => (
                <Badge
                  key={layer}
                  variant={selectedLayers.includes(layer) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleLayer(layer)}
                >
                  {layer === 'memory'
                    ? language === 'hu'
                      ? 'Emlékezet/Rezonancia'
                      : 'Memory/Resonance'
                    : 'Platform/Build'}
                </Badge>
              ))}
            </div>
          </div>

          {/* Type Filters */}
          <div>
            <p className="text-sm font-semibold mb-2">
              {language === 'hu' ? 'Típusok' : 'Types'}
            </p>
            <div className="flex gap-2 flex-wrap">
              {typeOptions.map((type) => (
                <Badge
                  key={type}
                  variant={selectedTypes.includes(type) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleType(type)}
                >
                  {language === 'hu' ? (typeLabelsHu[type] || type) : type}
                </Badge>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-xs"
            >
              {language === 'hu' ? 'Szűrők törlése' : 'Clear filters'}
            </Button>
          )}
        </div>
      )}

      {/* Export & Share */}
      <div className="flex gap-2 flex-wrap pt-2 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onExport('json')}
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          JSON
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onExport('csv')}
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          CSV
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onExport('pdf')}
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          PDF
        </Button>

        <div className="flex-1" />

        <Button
          variant="outline"
          size="sm"
          onClick={() => onShare('facebook')}
          className="gap-2"
        >
          <Share2 className="w-4 h-4" />
          Facebook
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onShare('twitter')}
          className="gap-2"
        >
          <Share2 className="w-4 h-4" />
          Twitter
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onShare('linkedin')}
          className="gap-2"
        >
          <Share2 className="w-4 h-4" />
          LinkedIn
        </Button>
      </div>
    </div>
  );
}
