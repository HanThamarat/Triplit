"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Friend {
  id: string;
  name: string;
  color: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: "Food" | "Transport" | "Lodging" | "Fun";
  payerId: string;
  splitWithIds: string[];
}

export interface ItineraryItem {
  day: number;
  time: string;
  title: string;
  description: string;
  category: "dining" | "transport" | "lodging" | "activity";
  costEstimate: number;
}

export interface Trip {
  id: string;
  name: string;
  destination: string;
  dates: string;
  friends: Friend[];
  expenses: Expense[];
  itinerary: ItineraryItem[];
}

interface DashboardContextType {
  trips: Trip[];
  selectedTripId: string;
  setSelectedTripId: (id: string) => void;
  activeTrip: Trip | undefined;
  saveTrips: (newTrips: Trip[]) => void;
  handleDeleteTrip: (id: string, e: React.MouseEvent) => void;
  handleCreateTrip: (e: React.FormEvent) => void;
  handleUpdateTripState: (friends: Friend[], expenses: Expense[]) => void;
  handleImportActivities: (newActivities: Omit<ItineraryItem, "id">[]) => void;
  handleImportExpenses: (newExpenses: { description: string; amount: number; category: string }[]) => void;
  showAddForm: boolean;
  setShowAddForm: (show: boolean) => void;
  newTripName: string;
  setNewTripName: (name: string) => void;
  newDestination: string;
  setNewDestination: (dest: string) => void;
  newDates: string;
  setNewDates: (dates: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const DEFAULT_TRIPS: Trip[] = [
  {
    id: "trip-tokyo",
    name: "Tokyo Summer 2026",
    destination: "Tokyo, Japan",
    dates: "June 12 - June 19, 2026",
    friends: [
      { id: "fr-1", name: "Alice", color: "from-blue-primary to-blue-light text-white" },
      { id: "fr-2", name: "Bob", color: "from-ember to-ember-light text-white" },
      { id: "fr-3", name: "Charlie", color: "from-luxe to-luxe-muted text-white" },
    ],
    expenses: [
      { id: "ex-1", description: "Shibuya Airbnb Stay", amount: 480, category: "Lodging", payerId: "fr-1", splitWithIds: ["fr-1", "fr-2", "fr-3"] },
      { id: "ex-2", description: "Roppongi Premium Sushi", amount: 150, category: "Food", payerId: "fr-2", splitWithIds: ["fr-1", "fr-2", "fr-3"] },
      { id: "ex-3", description: "Tokyo Subway Metro Pass", amount: 30, category: "Transport", payerId: "fr-3", splitWithIds: ["fr-1", "fr-2", "fr-3"] },
    ],
    itinerary: [
      { day: 1, time: "12:00 PM", title: "Tsuta Truffle Ramen", description: "Lunch at the world's first Michelin starred ramen.", category: "dining", costEstimate: 22 },
      { day: 1, time: "06:30 PM", title: "Shinjuku Yakitori Tour", description: "Crawl historical small alleys in Omoide Yokocho.", category: "dining", costEstimate: 35 },
      { day: 2, time: "02:00 PM", title: "Meiji Shrine Gardens", description: "Walk through tall cedar forest pathways.", category: "activity", costEstimate: 12 },
    ]
  },
  {
    id: "trip-paris",
    name: "Euro Escape 2026",
    destination: "Paris, France",
    dates: "August 04 - August 10, 2026",
    friends: [
      { id: "fr-p1", name: "Alice", color: "from-blue-primary to-blue-light text-white" },
      { id: "fr-p2", name: "Sophia", color: "from-rose-accent to-rose-muted text-white" },
    ],
    expenses: [
      { id: "ex-p1", description: "Louvre Museum Passes", amount: 80, category: "Fun", payerId: "fr-p2", splitWithIds: ["fr-p1", "fr-p2"] },
    ],
    itinerary: [
      { day: 1, time: "09:00 AM", title: "🥐 Marais Croissant Walk", description: "Sample fresh local pastries.", category: "dining", costEstimate: 15 }
    ]
  }
];

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string>("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTripName, setNewTripName] = useState("");
  const [newDestination, setNewDestination] = useState("");
  const [newDates, setNewDates] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("triplit_trips_data");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Trip[];
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTrips(parsed);
        if (parsed.length > 0) {
          setSelectedTripId(parsed[0].id);
        }
      } catch (e) {
        setTrips(DEFAULT_TRIPS);
        if (DEFAULT_TRIPS.length > 0) {
          setSelectedTripId(DEFAULT_TRIPS[0].id);
        }
      }
    } else {
      setTrips(DEFAULT_TRIPS);
      if (DEFAULT_TRIPS.length > 0) {
        setSelectedTripId(DEFAULT_TRIPS[0].id);
      }
      localStorage.setItem("triplit_trips_data", JSON.stringify(DEFAULT_TRIPS));
    }
  }, []);

  const saveTrips = (newTrips: Trip[]) => {
    setTrips(newTrips);
    localStorage.setItem("triplit_trips_data", JSON.stringify(newTrips));
  };

  const activeTrip = trips.find((t) => t.id === selectedTripId) || trips[0];

  const handleCreateTrip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTripName || !newDestination) return;

    const newTrip: Trip = {
      id: "trip-" + Math.random().toString(36).substring(2, 9),
      name: newTripName,
      destination: newDestination,
      dates: newDates || "Dates TBD",
      friends: [
        { id: "fr-1", name: "Alice", color: "from-blue-primary to-blue-light text-white" },
      ],
      expenses: [],
      itinerary: [],
    };

    const updated = [newTrip, ...trips];
    saveTrips(updated);
    setSelectedTripId(newTrip.id);
    setNewTripName("");
    setNewDestination("");
    setNewDates("");
    setShowAddForm(false);
  };

  const handleDeleteTrip = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (trips.length <= 1) {
      alert("You must keep at least one trip!");
      return;
    }
    const updated = trips.filter((t) => t.id !== id);
    saveTrips(updated);
    if (selectedTripId === id) {
      setSelectedTripId(updated[0].id);
    }
  };

  const handleUpdateTripState = (friends: Friend[], expenses: Expense[]) => {
    const updated = trips.map((t) =>
      t.id === selectedTripId ? { ...t, friends, expenses } : t
    );
    saveTrips(updated);
  };

  const handleImportActivities = (newActivities: Omit<ItineraryItem, "id">[]) => {
    const updated = trips.map((t) =>
      t.id === selectedTripId ? { ...t, itinerary: [...t.itinerary, ...newActivities] } : t
    );
    saveTrips(updated);
  };

  const handleImportExpenses = (
    newExpenses: { description: string; amount: number; category: string }[]
  ) => {
    const defaultSplitIds = activeTrip?.friends.map((f) => f.id) || [];
    const formatted: Expense[] = newExpenses.map((ex, idx) => ({
      id: "ex-ai-" + Math.random().toString(36).substring(2, 9) + idx,
      description: ex.description,
      amount: ex.amount,
      category: ((ex.category === "Food" ||
        ex.category === "Transport" ||
        ex.category === "Lodging" ||
        ex.category === "Fun")
        ? ex.category
        : "Fun") as "Food" | "Transport" | "Lodging" | "Fun",
      payerId: activeTrip?.friends[0]?.id || "fr-1",
      splitWithIds: defaultSplitIds,
    }));
    const updated = trips.map((t) =>
      t.id === selectedTripId ? { ...t, expenses: [...formatted, ...t.expenses] } : t
    );
    saveTrips(updated);
  };

  return (
    <DashboardContext.Provider
      value={{
        trips,
        selectedTripId,
        setSelectedTripId,
        activeTrip,
        saveTrips,
        handleDeleteTrip,
        handleCreateTrip,
        handleUpdateTripState,
        handleImportActivities,
        handleImportExpenses,
        showAddForm,
        setShowAddForm,
        newTripName,
        setNewTripName,
        newDestination,
        setNewDestination,
        newDates,
        setNewDates,
        sidebarOpen,
        setSidebarOpen,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within DashboardProvider");
  }
  return context;
}
