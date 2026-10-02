import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, DailyCheckIn, DailyQuestState, HunterStats, UserProfile } from '../types';
import { Bot, Send, Sparkles, X, User, RefreshCw, Dumbbell, Flame, ShieldAlert, Wifi, WifiOff } from 'lucide-react';
import { playRepCountSound } from '../utils/soundEffects';
import { getRankTheme } from '../utils/rankTheme';
import { generateAnalyticalCoachResponse } from '../utils/analyticalCoachEngine';

interface AiCoachModalProps {
  userProfile: UserProfile;
  stats: HunterStats;
  questState: DailyQuestState;
  dailyCheckIn?: DailyCheckIn | null;
  isOfflineMode?: boolean;
  consumedCalories?: number;
  consumedProtein?: number;
  waterIntakeMl?: number;
  onClose: () => void;
}

export const AiCoachModal: React.FC<AiCoachModalProps> = ({
  userProfile,
  stats,
  questState,
  dailyCheckIn,
  isOfflineMode = false,
  consumedCalories = 0,
  consumedProtein = 0,
  waterIntakeMl = 0,
  onClose,
}) => {
  const activeTitle = stats.equippedTitle || stats.title;
  const theme = getRankTheme(stats.rank);

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('solo_ai_chat_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [
      {
        id: 'msg_welcome',
        role: 'system',
        content: `[SYSTEM ARCHITECT & SHADOW MONARCH NEURAL LINK ACTIVE]
Greetings, Player ${userProfile.name} ("${activeTitle}").
Your Hunter Rank is ${stats.rank} (Level ${stats.level}).
Telemetry Status: STR ${stats.str} | AGI ${stats.agi} | VIT ${stats.vit} | INT ${stats.int} | PER ${stats.per}
${dailyCheckIn ? `Today's Biological Check-In: ${dailyCheckIn.sleepHours}h sleep (${dailyCheckIn.sleepQuality}), Mindset: ${dailyCheckIn.mood}. Recovery Buff: +${dailyCheckIn.staminaBuffPercent}% Stamina.` : 'Daily Check-In: Standard baseline.'}
Logged Today: ${consumedCalories} kcal consumed | ${consumedProtein}g protein consumed (Goal: ${userProfile.proteinGrams}g).

I am your Analytical AI Coach. Ask me anything freely:
- Biomechanical joint load & knee/elbow joint fixes
- Work volume & rep breakdown (e.g. 100 push-ups / squats)
- Exact macro calculations for Indian vegetarian/non-vegetarian staples (soya chunks, paneer, sattu, eggs, chicken)
- Zone 2 aerobic pacing & progressive overload milestones
- Shadow Monarch warrior mindset & overcoming mental fatigue.`,
        timestamp: new Date().toISOString(),
      },
    ];
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    localStorage.setItem('solo_ai_chat_history', JSON.stringify(messages.slice(-30)));
  }, [messages]);

  const quickPrompts = [
    'How should I hit my protein goal on an Indian diet without generic answers?',
    'My knees feel strained during squats, what joint angles should I modify?',
    'How should I tactically break down 100 push-ups and squats today?',
    'Analyze my current Hunter Level and calculate progressive overload',
    'What pacing and cadence strategy should I use for my 10km run?',
    'I feel exhausted and lazy today. What is the Monarch’s directive?',
  ];

  const handleSend = async (textToSend?: string) => {
    const messageContent = (textToSend || input).trim();
    if (!messageContent || loading) return;

    playRepCountSound(userProfile.soundEnabled);

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: messageContent,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    const isOnline = navigator.onLine && !isOfflineMode;

    if (!isOnline) {
      // Local Autonomous Analytical AI Engine
      setTimeout(() => {
        const reply = generateAnalyticalCoachResponse({
          message: messageContent,
          userProfile,
          stats,
          questItems: questState.items,
          dailyCheckIn,
          consumedCalories,
          consumedProtein,
          waterIntakeMl,
        });

        const botMsg: ChatMessage = {
          id: `bot_${Date.now()}`,
          role: 'assistant',
          content: reply,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, botMsg]);
        setLoading(false);
      }, 400);
      return;
    }

    try {
      const payload = {
        message: messageContent,
        history: messages.slice(-10).map((m) => ({
          role: m.role === 'system' || m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        })),
        userProfile,
        currentStats: {
          ...stats,
          equippedTitle: activeTitle,
        },
        currentQuest: questState.items.map((i) => ({
          exercise: i.name,
          current: i.current,
          target: i.target,
          unit: i.unit,
        })),
        dailyCheckIn,
        consumedCalories,
        consumedProtein,
        waterIntakeMl,
      };

      const res = await fetch('/api/gemini/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Server status ${res.status}`);
      }

      const data = await res.json();
      const reply = data.reply || 'The System has processed your performance data.';

      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.warn('AI Coach online call failed, falling back to local analytical engine:', err);
      const fallbackReply = generateAnalyticalCoachResponse({
        message: messageContent,
        userProfile,
        stats,
        questItems: questState.items,
        dailyCheckIn,
        consumedCalories,
        consumedProtein,
        waterIntakeMl,
      });

      const errorMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        role: 'assistant',
        content: fallbackReply,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    localStorage.removeItem('solo_ai_chat_history');
    setMessages([
      {
        id: `msg_${Date.now()}`,
        role: 'system',
        content: `[SYSTEM ARCHITECT REBOOTED]\nAnalytical database cleared. Ready to provide numbers-based workout and nutritional calculations for Player ${userProfile.name}.`,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 overflow-hidden">
      <div className="w-full max-w-3xl h-[90vh] sm:h-[85vh] rounded-2xl system-window p-4 sm:p-6 text-slate-100 border border-cyan-500/50 shadow-[0_0_50px_rgba(0,229,255,0.25)] flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3 mb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/60 flex items-center justify-center shadow-[0_0_12px_rgba(0,229,255,0.4)]">
              <Bot className="w-5 h-5 text-cyan-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-system text-base sm:text-lg font-bold tracking-wider text-white">
                  SYSTEM ARCHITECT (SUNG JIN-WOO AI)
                </h2>
                {isOfflineMode ? (
                  <span className="flex items-center gap-1 text-[10px] font-system font-bold px-2 py-0.5 rounded bg-purple-950/80 border border-purple-500/40 text-purple-300">
                    <WifiOff className="w-3 h-3 text-purple-400" />
                    <span>OFFLINE ENGINE</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-system font-bold px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span>NEURAL CLOUD</span>
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                Analytical intelligence powered by live biomechanics, macro calculations, and progressive overload.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearHistory}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 text-xs transition"
              title="Reset Chat History"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white text-xs transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Messages Log */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-3.5 my-2 text-xs sm:text-sm">
          {messages.map((msg) => {
            const isBot = msg.role === 'assistant' || msg.role === 'system';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isBot ? 'justify-start' : 'justify-end'}`}
              >
                {isBot && (
                  <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-300 shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[80%] p-3.5 rounded-xl border ${
                    isBot
                      ? 'bg-slate-950/85 border-cyan-500/30 text-slate-200 shadow-[0_0_15px_rgba(0,229,255,0.08)]'
                      : 'bg-gradient-to-r from-blue-700/70 to-cyan-700/70 border-cyan-400/40 text-white shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                  }`}
                >
                  <div className="whitespace-pre-wrap leading-relaxed font-sans">{msg.content}</div>
                  <div className="text-[10px] text-slate-400 text-right mt-1.5 opacity-70 font-system">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                {!isBot && (
                  <div className="w-7 h-7 rounded-lg bg-blue-950 border border-blue-500/50 flex items-center justify-center text-blue-300 shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-2.5 justify-start">
              <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-300 shrink-0">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-cyan-500/30 text-cyan-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="font-system text-xs tracking-wider">
                  SYSTEM COMPUTING BIOMETRIC FORMULAS & RECOMMENDATIONS...
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="py-2 border-t border-slate-800/80 shrink-0">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                disabled={loading}
                className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-cyan-500/20 hover:border-cyan-400/40 text-cyan-200 text-[11px] whitespace-nowrap transition active:scale-95"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 pt-2 border-t border-cyan-500/20 shrink-0"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Sung Jin-woo anything (knee form, workout sets, protein targets, fatigue)..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 focus:border-cyan-400 focus:outline-none text-white text-xs sm:text-sm placeholder:text-slate-500 transition"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition disabled:opacity-40 disabled:pointer-events-none shadow-[0_0_12px_rgba(0,229,255,0.4)] active:scale-95 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
