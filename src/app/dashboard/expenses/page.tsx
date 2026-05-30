"use client";

import ExpenseView from "../../components/ExpenseView";
import { useDashboard } from "../layout/DashboardContext";

export default function ExpensesDashboardPage() {
  const { activeTrip, handleUpdateTripState } = useDashboard();

  if (!activeTrip) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-primary dark:border-gold" />
      </div>
    );
  }

  return (
    <ExpenseView
      initialFriends={activeTrip.friends}
      initialExpenses={activeTrip.expenses}
      onUpdateState={handleUpdateTripState}
    />
  );
}
