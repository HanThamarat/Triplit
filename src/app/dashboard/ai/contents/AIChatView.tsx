"use client";

import { useState, useRef, useEffect } from "react";
import { FiCpu, FiSend, FiPlus, FiArrowRight, FiCheckCircle, FiDollarSign } from "react-icons/fi";
import { useLanguage } from "@/i18n/LanguageProvider";

interface TripActivity {
  id: string;
  day: number;
  time: string;
  title: string;
  description: string;
  category: "dining" | "transport" | "lodging" | "activity";
  costEstimate: number;
}

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  itinerary?: {
    title: string;
    activities: TripActivity[];
  };
}

interface AIChatViewProps {
  activeTripName: string;
  onImportActivities: (activities: Omit<TripActivity, "id">[]) => void;
  onImportExpenses: (expenses: { description: string; amount: number; category: string }[]) => void;
}

// Suggestion display text is translated at render; the query stays in English
// because generateItineraryResponse() matches on English keywords.
const INITIAL_SUGGESTIONS = [
  { key: "ai.sug1", query: "Plan a 3-day Tokyo culinary tour" },
  { key: "ai.sug2", query: "Give me a weekend itinerary for Paris" },
  { key: "ai.sug3", query: "Recommend 2 days in Miami Beach" },
];

export default function AIChatView({ activeTripName, onImportActivities, onImportExpenses }: AIChatViewProps) {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    { id: "init", sender: "ai", text: "" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [appliedItineraryId, setAppliedItineraryId] = useState<string | null>(null);
  const [appliedExpensesId, setAppliedExpensesId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const generateItineraryResponse = (query: string): { text: string; itinerary?: { title: string; activities: TripActivity[] } } => {
    const normalized = query.toLowerCase();

    if (normalized.includes("tokyo") || normalized.includes("food") || normalized.includes("ramen")) {
      return {
        text: "I have curated an elite 3-day culinary expedition through Tokyo. This covers legendary ramen joints, fresh sushi spots, and modern izakayas.",
        itinerary: {
          title: "🗼 Tokyo Premium Culinary Expedition",
          activities: [
            { id: "tk1", day: 1, time: "12:00 PM", title: "Tsuta Truffle Ramen", description: "Lunch at the world's first Michelin-starred ramen eatery in Sugamo.", category: "dining", costEstimate: 22 },
            { id: "tk2", day: 1, time: "06:30 PM", title: "Shinjuku Omoide Yokocho", description: "Yakitori crawl down historical narrow corridors near Shinjuku Station.", category: "dining", costEstimate: 35 },
            { id: "tk3", day: 2, time: "07:00 AM", title: "Toyosu Market Sushi Breakfast", description: "Enjoy ultra-fresh tuna direct from the auction block at Sushi Dai.", category: "dining", costEstimate: 45 },
            { id: "tk4", day: 2, time: "02:00 PM", title: "Meiji Shrine & Matcha in Harajuku", description: "Quiet stroll in the forest park followed by custom stone-ground matcha latte.", category: "activity", costEstimate: 12 },
            { id: "tk5", day: 3, time: "05:00 PM", title: "Shibuya Crossing Rooftop Drinks", description: "Sip sunset highballs overlooking Shibuya's kinetic street intersection.", category: "dining", costEstimate: 25 },
          ]
        }
      };
    }

    if (normalized.includes("paris") || normalized.includes("weekend") || normalized.includes("romance")) {
      return {
        text: "Here is a refined weekend guide in Paris. Walk aesthetic alleys, sample top croissants, and view the Eiffel Tower at sunset.",
        itinerary: {
          title: "🥐 Paris Romantic Weekend",
          activities: [
            { id: "pr1", day: 1, time: "09:00 AM", title: "Croissant Tour at Marais", description: "Sample buttery flake pastries from Tout Autour du Pain in the historic Marais.", category: "dining", costEstimate: 15 },
            { id: "pr2", day: 1, time: "02:00 PM", title: "Louvre Museum Private Tour", description: "Skip-the-line review of Mona Lisa and classical sculptures.", category: "activity", costEstimate: 60 },
            { id: "pr3", day: 1, time: "08:00 PM", title: "Seine River Dinner Cruise", description: "Three-course French dining on a glass-dome boat at sunset.", category: "dining", costEstimate: 95 },
            { id: "pr4", day: 2, time: "11:00 AM", title: "Montmartre Art Stroll", description: "Hike up to Sacré-Cœur, explore local watercolor painters, and drink espresso.", category: "activity", costEstimate: 20 },
            { id: "pr5", day: 2, time: "08:00 PM", title: "Eiffel Tower Picnic", description: "Sip Bordeaux wine with artisan cheese at Champ de Mars.", category: "activity", costEstimate: 30 },
          ]
        }
      };
    }

    return {
      text: "I've structured a custom coastal itinerary packed with water sports, local beachside dinners, and sunset yacht lounge views.",
      itinerary: {
        title: "🌴 Golden Shoreline Getaway",
        activities: [
          { id: "df1", day: 1, time: "10:00 AM", title: "Parasailing & Jet Skiing", description: "Glide over clear blue waves with custom instructors.", category: "activity", costEstimate: 85 },
          { id: "df2", day: 1, time: "01:00 PM", title: "Plaza Seafood Pier Lunch", description: "Fresh lobster rolls and grilled mahi-mahi by the beachfront bar.", category: "dining", costEstimate: 30 },
          { id: "df3", day: 2, time: "09:00 AM", title: "Scenic Cliffside Hiking", description: "Breathtaking ocean views down historical botanical tracks.", category: "activity", costEstimate: 10 },
          { id: "df4", day: 2, time: "05:00 PM", title: "Ocean Sunset Catamaran", description: "Sip mojitos and listen to live steel drum tunes on the open deck.", category: "activity", costEstimate: 75 },
        ]
      }
    };
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Math.random().toString(), sender: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);
    setTimeout(() => {
      const response = generateItineraryResponse(text);
      const aiMsg: Message = { id: Math.random().toString(), sender: "ai", text: response.text, itinerary: response.itinerary };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const importItinerary = (msgId: string, itinerary: { title: string; activities: TripActivity[] }) => {
    const activitiesWithoutIds = itinerary.activities.map(({ id, ...rest }) => rest);
    onImportActivities(activitiesWithoutIds);
    setAppliedItineraryId(msgId);
    setTimeout(() => setAppliedItineraryId(null), 3000);
  };

  const importExpenses = (msgId: string, activities: TripActivity[]) => {
    const mockExpenses = activities.map(act => {
      let cat = "Fun";
      if (act.category === "dining") cat = "Food";
      if (act.category === "lodging") cat = "Lodging";
      if (act.category === "transport") cat = "Transport";
      return { description: act.title, amount: act.costEstimate, category: cat };
    });
    onImportExpenses(mockExpenses);
    setAppliedExpensesId(msgId);
    setTimeout(() => setAppliedExpensesId(null), 3000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] sm:h-[calc(100vh-100px)] border border-pearl-border dark:border-obsidian-border bg-pearl-card dark:bg-obsidian-card rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-pearl-border dark:border-obsidian-border bg-pearl-surface/50 dark:bg-obsidian/25 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-subtle dark:bg-gold/10 border border-blue-primary/15 dark:border-gold/15 text-blue-primary dark:text-gold flex items-center justify-center">
            <FiCpu className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-display font-bold text-xs sm:text-sm text-slate-800 dark:text-stone-50 flex items-center gap-1.5">
              {t("ai.assistant")}
            </h3>
            <span className="text-[9px] sm:text-[10px] font-medium text-emerald-accent flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-accent" /> {t("ai.online")}
            </span>
          </div>
        </div>
        <div className="text-[9px] sm:text-[10px] px-2 sm:px-2.5 py-1 rounded-full border border-pearl-border dark:border-obsidian-border bg-pearl-card dark:bg-obsidian-elevated text-pearl-muted dark:text-obsidian-muted font-medium hidden sm:block">
          {t("ai.context")} <b className="text-slate-800 dark:text-stone-200 font-semibold">{activeTripName}</b>
        </div>
      </div>

      {/* Suggestions */}
      {messages.length === 1 && (
        <div className="px-4 sm:px-5 py-3 sm:py-4 bg-pearl-surface/30 dark:bg-obsidian/10 border-b border-pearl-border/50 dark:border-obsidian-border/50">
          <p className="text-[10px] font-bold text-pearl-muted dark:text-obsidian-muted uppercase tracking-wider mb-2">{t("ai.suggestedPrompts")}</p>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {INITIAL_SUGGESTIONS.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(sug.query)}
                className="text-[10px] sm:text-[11px] font-semibold px-2.5 sm:px-3 py-1.5 rounded-lg border border-pearl-border dark:border-obsidian-border bg-pearl-card dark:bg-obsidian-elevated text-slate-600 dark:text-stone-300 hover:border-blue-primary dark:hover:border-gold hover:bg-blue-subtle/50 dark:hover:bg-gold/[0.04] transition-all duration-200 cursor-pointer flex items-center gap-1"
              >
                {t(sug.key)} <FiArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-pearl-muted" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 sm:space-y-5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col max-w-[92%] sm:max-w-[85%] ${
              msg.sender === "user" ? "self-end items-end ml-auto" : "self-start items-start mr-auto"
            }`}
          >
            <div
              className={`p-3 sm:p-4 rounded-2xl text-xs font-sans leading-relaxed border shadow-sm ${
                msg.sender === "user"
                  ? "bg-blue-primary dark:bg-gold text-white dark:text-obsidian border-blue-dark dark:border-gold-dark rounded-br-none"
                  : "bg-pearl-surface dark:bg-obsidian text-slate-700 dark:text-stone-200 border-pearl-border dark:border-obsidian-border rounded-bl-none"
              }`}
            >
              {msg.id === "init" ? t("ai.greeting", { name: activeTripName }) : msg.text}
            </div>

            {msg.sender === "ai" && msg.itinerary && (
              <div className="mt-3 w-full max-w-md rounded-2xl border border-pearl-border dark:border-obsidian-border bg-pearl-card dark:bg-obsidian-elevated shadow-lg p-4 sm:p-5 flex flex-col gap-3 sm:gap-4">
                <div className="flex items-center justify-between border-b border-pearl-border/50 dark:border-obsidian-border/50 pb-3">
                  <h4 className="font-display font-extrabold text-xs sm:text-sm text-slate-900 dark:text-stone-50">{msg.itinerary.title}</h4>
                  <span className="text-[8px] sm:text-[9px] font-bold text-blue-primary dark:text-gold bg-blue-subtle dark:bg-gold/10 border border-blue-primary/15 dark:border-gold/15 px-1.5 sm:px-2 py-0.5 rounded uppercase tracking-wider">
                    {t("ai.stops", { n: msg.itinerary.activities.length })}
                  </span>
                </div>

                {/* Timeline */}
                <div className="space-y-3 sm:space-y-4 relative pl-3 sm:pl-3.5 before:absolute before:left-[3px] sm:before:left-1 before:top-2 before:bottom-2 before:w-[1px] before:bg-pearl-border dark:before:bg-obsidian-border">
                  {msg.itinerary.activities.map((act) => (
                    <div key={act.id} className="relative text-xs">
                      <span className={`absolute -left-[14px] sm:-left-[17px] top-1.5 h-2 w-2 rounded-full border ${
                        act.category === "dining"
                          ? "bg-amber-500 border-amber-400"
                          : act.category === "activity"
                          ? "bg-blue-primary dark:bg-gold border-blue-dark dark:border-gold-dark"
                          : "bg-luxe border-luxe-dark"
                      }`} />
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-[9px] sm:text-[10px] font-bold text-pearl-muted dark:text-obsidian-muted tracking-wider">{t("ai.day")} {act.day} • {act.time}</span>
                        <span className="text-[9px] sm:text-[10px] font-bold text-pearl-muted dark:text-obsidian-muted">{t("ai.est")} ${act.costEstimate}</span>
                      </div>
                      <h5 className="font-bold text-slate-800 dark:text-stone-200 mt-0.5">{act.title}</h5>
                      <p className="text-[9px] sm:text-[10px] text-pearl-muted dark:text-obsidian-muted mt-0.5 leading-normal">{act.description}</p>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 border-t border-pearl-border/50 dark:border-obsidian-border/50 pt-3">
                  <button
                    onClick={() => importItinerary(msg.id, msg.itinerary!)}
                    disabled={appliedItineraryId === msg.id}
                    className={`px-2 sm:px-3 py-2 rounded-xl text-[9px] sm:text-[10px] font-bold shadow-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-1 ${
                      appliedItineraryId === msg.id
                        ? "bg-emerald-accent/10 border border-emerald-accent/20 text-emerald-accent"
                        : "bg-blue-primary dark:bg-gold text-white dark:text-obsidian hover:opacity-90 active:scale-95"
                    }`}
                  >
                    {appliedItineraryId === msg.id ? <><FiCheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {t("ai.added")}</> : <><FiPlus className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {t("ai.syncSchedule")}</>}
                  </button>
                  <button
                    onClick={() => importExpenses(msg.id, msg.itinerary!.activities)}
                    disabled={appliedExpensesId === msg.id}
                    className={`px-2 sm:px-3 py-2 rounded-xl text-[9px] sm:text-[10px] font-bold shadow-sm border transition-all duration-200 cursor-pointer flex items-center justify-center gap-1 ${
                      appliedExpensesId === msg.id
                        ? "bg-emerald-accent/10 border-emerald-accent/20 text-emerald-accent"
                        : "border-pearl-border dark:border-obsidian-border bg-pearl-surface dark:bg-obsidian-card hover:bg-pearl-card dark:hover:bg-obsidian-elevated text-slate-700 dark:text-stone-200 active:scale-95"
                    }`}
                  >
                    {appliedExpensesId === msg.id ? <><FiCheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {t("ai.done")}</> : <><FiDollarSign className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {t("ai.splitFares")}</>}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 self-start bg-pearl-surface dark:bg-obsidian border border-pearl-border dark:border-obsidian-border p-3 sm:p-4 rounded-2xl rounded-bl-none">
            <span className="w-1.5 h-1.5 bg-pearl-muted dark:bg-obsidian-muted rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-1.5 h-1.5 bg-pearl-muted dark:bg-obsidian-muted rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-1.5 h-1.5 bg-pearl-muted dark:bg-obsidian-muted rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }}
        className="p-3 sm:p-4 border-t border-pearl-border dark:border-obsidian-border bg-pearl-surface/50 dark:bg-obsidian/25 flex gap-2"
      >
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={t("ai.inputPlaceholder")}
          className="flex-1 bg-pearl-card dark:bg-obsidian-surface text-slate-800 dark:text-stone-100 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs border border-pearl-border dark:border-obsidian-border focus:border-blue-primary dark:focus:border-gold focus:outline-none transition-all"
        />
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className="p-2.5 sm:p-3 bg-blue-primary dark:bg-gold text-white dark:text-obsidian rounded-xl hover:scale-105 active:scale-95 disabled:opacity-40 disabled:scale-100 disabled:pointer-events-none transition-all duration-200 shadow-md cursor-pointer"
        >
          <FiSend className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </form>
    </div>
  );
}
