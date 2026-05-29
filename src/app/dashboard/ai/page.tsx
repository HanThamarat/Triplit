"use client";

import AIChatView from "../../components/AIChatView";
import { useDashboard } from "../DashboardContext";

export default function AIDashboardPage() {
  const { activeTrip, handleImportActivities, handleImportExpenses } = useDashboard();

  if (!activeTrip) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-primary dark:border-gold" />
      </div>
    );
  }

  return (
    <AIChatView
      activeTripName={activeTrip.name}
      onImportActivities={handleImportActivities}
      onImportExpenses={handleImportExpenses}
    />
  );
}
