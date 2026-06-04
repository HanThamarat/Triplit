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

// Dot tone per itinerary category, on the "Sunset Coast" palette.
const CATEGORY_DOT: Record<TripActivity["category"], string> = {
  dining: "bg-sunset",
  activity: "bg-meadow",
  transport: "bg-coast",
  lodging: "bg-sun",
};

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

  const messagesRef = useRef<HTMLDivElement>(null);

  // Keep the latest message in view by scrolling the message list itself, never
  // the document (scrollIntoView would scroll the whole page and expose the body
  // behind this full-height panel).
  useEffect(() => {
    const el = messagesRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
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
    <div className="flex h-[calc(100vh-150px)] flex-col overflow-hidden rounded-3xl border border-line bg-canvas lp-postcard sm:h-[calc(100vh-120px)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line bg-canvas-sink/60 px-4 py-3 sm:px-5 sm:py-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-coast-wash text-coast-deep sm:h-10 sm:w-10">
            <FiCpu className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div>
            <h3 className="font-serif text-base text-ink">{t("ai.assistant")}</h3>
            <span className="flex items-center gap-1 text-[10px] font-medium text-meadow-deep">
              <span className="h-1.5 w-1.5 rounded-full bg-meadow" /> {t("ai.online")}
            </span>
          </div>
        </div>
        <div className="hidden rounded-full border border-line bg-canvas px-2.5 py-1 text-[10px] font-medium text-ink-faint sm:block">
          {t("ai.context")} <b className="font-semibold text-ink">{activeTripName}</b>
        </div>
      </div>

      {/* Suggestions */}
      {messages.length === 1 && (
        <div className="border-b border-line bg-canvas-sink/40 px-4 py-3 sm:px-5 sm:py-4">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
            {t("ai.suggestedPrompts")}
          </p>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {INITIAL_SUGGESTIONS.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(sug.query)}
                className="lp-focus flex cursor-pointer items-center gap-1 rounded-full border border-line bg-canvas px-3 py-1.5 text-[11px] font-semibold text-ink-soft transition-colors hover:border-coast hover:bg-coast-wash hover:text-coast-deep"
              >
                {t(sug.key)} <FiArrowRight className="h-3 w-3 text-ink-faint" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div ref={messagesRef} className="flex-1 space-y-4 overflow-y-auto p-4 sm:space-y-5 sm:p-5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex max-w-[92%] flex-col sm:max-w-[85%] ${
              msg.sender === "user" ? "ml-auto items-end self-end" : "mr-auto items-start self-start"
            }`}
          >
            <div
              className={`rounded-2xl p-3 text-xs font-sans leading-relaxed sm:p-4 ${
                msg.sender === "user"
                  ? "rounded-br-md bg-sunset-deep text-white"
                  : "rounded-bl-md border border-line bg-canvas-sink text-ink-soft"
              }`}
            >
              {msg.id === "init" ? t("ai.greeting", { name: activeTripName }) : msg.text}
            </div>

            {msg.sender === "ai" && msg.itinerary && (
              <div className="mt-3 flex w-full max-w-md flex-col gap-3 rounded-2xl border border-line bg-canvas p-4 lp-postcard sm:gap-4 sm:p-5">
                <div className="flex items-center justify-between border-b border-line pb-3">
                  <h4 className="font-serif text-sm text-ink">{msg.itinerary.title}</h4>
                  <span className="rounded-full bg-coast-wash px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-coast-deep">
                    {t("ai.stops", { n: msg.itinerary.activities.length })}
                  </span>
                </div>

                {/* Timeline */}
                <div className="relative space-y-3 pl-3.5 before:absolute before:bottom-2 before:left-1 before:top-2 before:w-px before:bg-line sm:space-y-4">
                  {msg.itinerary.activities.map((act) => (
                    <div key={act.id} className="relative text-xs">
                      <span
                        className={`absolute -left-[17px] top-1.5 h-2 w-2 rounded-full ring-2 ring-canvas ${CATEGORY_DOT[act.category]}`}
                      />
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-[10px] font-semibold tracking-wider text-ink-faint">
                          {t("ai.day")} {act.day} • {act.time}
                        </span>
                        <span className="text-[10px] font-semibold tabular-nums text-ink-faint">
                          {t("ai.est")} ${act.costEstimate}
                        </span>
                      </div>
                      <h5 className="mt-0.5 font-semibold text-ink">{act.title}</h5>
                      <p className="mt-0.5 text-[10px] leading-normal text-ink-soft">{act.description}</p>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 border-t border-line pt-3">
                  <button
                    onClick={() => importItinerary(msg.id, msg.itinerary!)}
                    disabled={appliedItineraryId === msg.id}
                    className={`lp-focus flex cursor-pointer items-center justify-center gap-1 rounded-full px-3 py-2 text-[10px] font-semibold transition-all ${
                      appliedItineraryId === msg.id
                        ? "bg-meadow/15 text-meadow-deep"
                        : "bg-sunset-deep text-white hover:-translate-y-0.5 active:translate-y-0"
                    }`}
                  >
                    {appliedItineraryId === msg.id ? (
                      <><FiCheckCircle className="h-3.5 w-3.5" /> {t("ai.added")}</>
                    ) : (
                      <><FiPlus className="h-3.5 w-3.5" /> {t("ai.syncSchedule")}</>
                    )}
                  </button>
                  <button
                    onClick={() => importExpenses(msg.id, msg.itinerary!.activities)}
                    disabled={appliedExpensesId === msg.id}
                    className={`lp-focus flex cursor-pointer items-center justify-center gap-1 rounded-full border px-3 py-2 text-[10px] font-semibold transition-all ${
                      appliedExpensesId === msg.id
                        ? "border-meadow/30 bg-meadow/15 text-meadow-deep"
                        : "border-line bg-canvas text-ink hover:bg-shell active:translate-y-0"
                    }`}
                  >
                    {appliedExpensesId === msg.id ? (
                      <><FiCheckCircle className="h-3.5 w-3.5" /> {t("ai.done")}</>
                    ) : (
                      <><FiDollarSign className="h-3.5 w-3.5" /> {t("ai.splitFares")}</>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 self-start rounded-2xl rounded-bl-md border border-line bg-canvas-sink p-3 sm:p-4">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-faint" style={{ animationDelay: "0ms" }} />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-faint" style={{ animationDelay: "150ms" }} />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-faint" style={{ animationDelay: "300ms" }} />
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }}
        className="flex gap-2 border-t border-line bg-canvas-sink/60 p-3 sm:p-4"
      >
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={t("ai.inputPlaceholder")}
          className="flex-1 rounded-xl border border-line bg-canvas px-3 py-2.5 text-xs text-ink placeholder:text-ink-faint transition-colors focus:border-coast focus:outline-none focus:ring-2 focus:ring-coast/30 sm:px-4 sm:py-3"
        />
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className="lp-focus grid cursor-pointer place-items-center rounded-xl bg-sunset-deep p-2.5 text-white transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:translate-y-0 disabled:opacity-40 sm:p-3"
        >
          <FiSend className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
