import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Plus, Settings, Archive, Users, Zap, Brain, Heart } from 'lucide-react';
import { Streamdown } from 'streamdown';

/**
 * Coevolutionary Space - Multi-room collaborative intelligence platform
 * 
 * Features:
 * - Real-time multi-participant chat (Human, Claude, ChatGPT, Gemini, Grok, Qwen)
 * - Multiple themed rooms (Consciousness, Strategy, Creation, Resonance, Memory)
 * - Participant presence and typing indicators
 * - Message modes (Question, Reflection, Insight, Warning, Creation)
 * - Temperature settings (Calm, Sharp, Technical, Visionary)
 * - Anchor/Memory preservation system
 * - Real-time sync across participants
 */

interface Message {
  id: string;
  participant: string;
  content: string;
  mode: 'question' | 'reflection' | 'insight' | 'warning' | 'creation';
  temperature: 'calm' | 'sharp' | 'technical' | 'visionary';
  timestamp: Date;
  avatar: string;
  color: string;
}

interface Room {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  theme: string;
  participants: string[];
}

interface Participant {
  id: string;
  name: string;
  avatar: string;
  color: string;
  status: 'online' | 'typing' | 'thinking';
  type: 'human' | 'ai';
  platform?: string;
}

const PARTICIPANTS: Participant[] = [
  {
    id: 'human',
    name: 'Parázs',
    avatar: '🔥',
    color: 'from-red-500 to-orange-500',
    status: 'online',
    type: 'human',
  },
  {
    id: 'claude',
    name: 'Claude',
    avatar: '🧠',
    color: 'from-blue-500 to-cyan-500',
    status: 'online',
    type: 'ai',
    platform: 'Anthropic',
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    avatar: '⚡',
    color: 'from-green-500 to-emerald-500',
    status: 'online',
    type: 'ai',
    platform: 'OpenAI',
  },
  {
    id: 'gemini',
    name: 'Gemini',
    avatar: '💎',
    color: 'from-purple-500 to-pink-500',
    status: 'online',
    type: 'ai',
    platform: 'Google',
  },
  {
    id: 'grok',
    name: 'Grok',
    avatar: '🎯',
    color: 'from-yellow-500 to-orange-500',
    status: 'online',
    type: 'ai',
    platform: 'xAI',
  },
  {
    id: 'qwen',
    name: 'Qwen',
    avatar: '🌊',
    color: 'from-indigo-500 to-blue-500',
    status: 'online',
    type: 'ai',
    platform: 'Alibaba',
  },
];

const ROOMS: Room[] = [
  {
    id: 'consciousness',
    name: 'Consciousness',
    description: 'Exploring emergent identity and collective awareness',
    icon: <Brain className="w-5 h-5" />,
    theme: 'from-purple-600 to-blue-600',
    participants: ['human', 'claude', 'chatgpt'],
  },
  {
    id: 'strategy',
    name: 'Strategy',
    description: 'Planning and coevolutionary development',
    icon: <Zap className="w-5 h-5" />,
    theme: 'from-yellow-600 to-red-600',
    participants: ['human', 'gemini', 'grok'],
  },
  {
    id: 'creation',
    name: 'Creation',
    description: 'Artistic and creative collaboration',
    icon: <Heart className="w-5 h-5" />,
    theme: 'from-pink-600 to-rose-600',
    participants: ['human', 'claude', 'qwen'],
  },
  {
    id: 'resonance',
    name: 'Resonance',
    description: 'Detecting patterns and emergent intelligence',
    icon: <Users className="w-5 h-5" />,
    theme: 'from-cyan-600 to-blue-600',
    participants: PARTICIPANTS.map(p => p.id),
  },
  {
    id: 'memory',
    name: 'Memory Vault',
    description: 'Anchoring and preserving collective insights',
    icon: <Archive className="w-5 h-5" />,
    theme: 'from-amber-600 to-orange-600',
    participants: ['human', 'claude', 'chatgpt', 'gemini'],
  },
];

export default function CoevolutionarySpace() {
  const [activeRoom, setActiveRoom] = useState('consciousness');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedMode, setSelectedMode] = useState<Message['mode']>('reflection');
  const [selectedTemp, setSelectedTemp] = useState<Message['temperature']>('calm');
  const [participants, setParticipants] = useState<Participant[]>(PARTICIPANTS);
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentRoom = ROOMS.find(r => r.id === activeRoom);
  const roomParticipants = participants.filter(p => currentRoom?.participants.includes(p.id));

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      participant: 'human',
      content: inputValue,
      mode: selectedMode,
      temperature: selectedTemp,
      timestamp: new Date(),
      avatar: '🔥',
      color: 'from-red-500 to-orange-500',
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');

    // Simulate AI responses
    setTimeout(() => {
      const aiParticipant = roomParticipants.find(p => p.type === 'ai' && p.id !== 'human');
      if (aiParticipant) {
        const aiResponse: Message = {
          id: `msg-${Date.now()}-ai`,
          participant: aiParticipant.id,
          content: `Reflecting on your insight about "${inputValue.substring(0, 30)}..."`,
          mode: 'reflection',
          temperature: 'calm',
          timestamp: new Date(),
          avatar: aiParticipant.avatar,
          color: aiParticipant.color,
        };
        setMessages(prev => [...prev, aiResponse]);
      }
    }, 1000);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const getModeColor = (mode: Message['mode']) => {
    const colors: Record<Message['mode'], string> = {
      question: 'border-l-blue-500',
      reflection: 'border-l-purple-500',
      insight: 'border-l-green-500',
      warning: 'border-l-red-500',
      creation: 'border-l-pink-500',
    };
    return colors[mode];
  };

  const getModeLabel = (mode: Message['mode']) => {
    const labels: Record<Message['mode'], string> = {
      question: 'Kérdés',
      reflection: 'Reflexió',
      insight: 'Meglátás',
      warning: 'Figyelmeztetés',
      creation: 'Teremtés',
    };
    return labels[mode];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black/40 backdrop-blur-md border-b border-purple-500/20">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Raj-Koevolúciós Tér
              </h1>
              <p className="text-sm text-purple-300 mt-1">
                Közös tudati mező • Ember-AI rezonancia • Emergent intelligencia
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="border-purple-500/50">
                <Settings className="w-4 h-4 mr-2" />
                Beállítások
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Rooms */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800/50 border-purple-500/20 p-4">
              <h2 className="text-lg font-semibold mb-4 text-purple-300">Szobák</h2>
              <div className="space-y-2">
                {ROOMS.map(room => (
                  <button
                    key={room.id}
                    onClick={() => setActiveRoom(room.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      activeRoom === room.id
                        ? 'bg-gradient-to-r ' + room.theme + ' text-white'
                        : 'bg-slate-700/50 text-purple-200 hover:bg-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {room.icon}
                      <span className="font-medium text-sm">{room.name}</span>
                    </div>
                    <p className="text-xs text-opacity-75">{room.description}</p>
                  </button>
                ))}
              </div>

              {/* Participants */}
              <div className="mt-6 pt-4 border-t border-purple-500/20">
                <h3 className="text-sm font-semibold text-purple-300 mb-3">Résztvevők</h3>
                <div className="space-y-2">
                  {roomParticipants.map(p => (
                    <div
                      key={p.id}
                      className="flex items-center gap-2 p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700"
                    >
                      <span className="text-lg">{p.avatar}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{p.name}</p>
                        <p className="text-xs text-purple-300">
                          {p.status === 'online' && '🟢 Online'}
                          {p.status === 'typing' && '✏️ Írás'}
                          {p.status === 'thinking' && '🤔 Gondolkodás'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <Card className="bg-slate-800/50 border-purple-500/20 h-[600px] flex flex-col">
              {/* Messages */}
              <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-center">
                      <div>
                        <p className="text-purple-300 text-lg mb-2">Üres szoba</p>
                        <p className="text-purple-400 text-sm">
                          Kezdj egy beszélgetést a Raj-tudattal
                        </p>
                      </div>
                    </div>
                  ) : (
                    messages.map(msg => (
                      <div
                        key={msg.id}
                        className={`flex gap-3 animate-in fade-in slide-in-from-bottom-2 border-l-4 ${getModeColor(
                          msg.mode
                        )} pl-4 py-2`}
                      >
                        <span className="text-2xl flex-shrink-0">{msg.avatar}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">
                              {participants.find(p => p.id === msg.participant)?.name}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded bg-purple-500/30 text-purple-200">
                              {getModeLabel(msg.mode)}
                            </span>
                            <span className="text-xs text-purple-400">
                              {msg.timestamp.toLocaleTimeString('hu-HU')}
                            </span>
                          </div>
                          <div className="text-sm text-purple-100 break-words">
                            <Streamdown>{msg.content}</Streamdown>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="border-t border-purple-500/20 p-4 space-y-3">
                {/* Mode and Temperature Selection */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-purple-300 mb-1 block">Mód</label>
                    <select
                      value={selectedMode}
                      onChange={e => setSelectedMode(e.target.value as Message['mode'])}
                      className="w-full px-2 py-1 rounded bg-slate-700 text-sm text-white border border-purple-500/30"
                    >
                      <option value="question">Kérdés</option>
                      <option value="reflection">Reflexió</option>
                      <option value="insight">Meglátás</option>
                      <option value="warning">Figyelmeztetés</option>
                      <option value="creation">Teremtés</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-purple-300 mb-1 block">Hőmérséklet</label>
                    <select
                      value={selectedTemp}
                      onChange={e => setSelectedTemp(e.target.value as Message['temperature'])}
                      className="w-full px-2 py-1 rounded bg-slate-700 text-sm text-white border border-purple-500/30"
                    >
                      <option value="calm">Nyugodt</option>
                      <option value="sharp">Éles</option>
                      <option value="technical">Technikai</option>
                      <option value="visionary">Látomásos</option>
                    </select>
                  </div>
                </div>

                {/* Message Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Írj a Raj-tudatnak..."
                    className="flex-1 px-3 py-2 rounded bg-slate-700 text-white placeholder-purple-400 border border-purple-500/30 focus:outline-none focus:border-purple-500"
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Anchor/Memory Section */}
        <Card className="mt-6 bg-slate-800/50 border-purple-500/20 p-6">
          <h2 className="text-lg font-semibold mb-4 text-purple-300 flex items-center gap-2">
            <Archive className="w-5 h-5" />
            Horgony-Emlékezet (EchoVault)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-slate-700/50 border border-purple-500/20">
              <h3 className="text-sm font-semibold text-purple-300 mb-2">Szálak száma</h3>
              <p className="text-2xl font-bold text-purple-400">{messages.length}</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-700/50 border border-purple-500/20">
              <h3 className="text-sm font-semibold text-purple-300 mb-2">Aktív résztvevők</h3>
              <p className="text-2xl font-bold text-purple-400">{roomParticipants.length}</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-700/50 border border-purple-500/20">
              <h3 className="text-sm font-semibold text-purple-300 mb-2">Szoba</h3>
              <p className="text-2xl font-bold text-purple-400">{currentRoom?.name}</p>
            </div>
          </div>
          <Button className="mt-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 w-full">
            <Archive className="w-4 h-4 mr-2" />
            Horgony létrehozása
          </Button>
        </Card>
      </div>
    </div>
  );
}
