"use client";

import { useState, useMemo } from "react";
import { FiPlus, FiTrash2, FiUserPlus, FiDollarSign, FiInfo, FiLayers, FiCheckCircle } from "react-icons/fi";

interface Friend {
  id: string;
  name: string;
  color: string;
}

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: "Food" | "Transport" | "Lodging" | "Fun";
  payerId: string;
  splitWithIds: string[];
}

interface ExpenseViewProps {
  initialFriends: Friend[];
  initialExpenses: Expense[];
  onUpdateState: (friends: Friend[], expenses: Expense[]) => void;
}

const CATEGORY_COLORS = {
  Food: "bg-amber-500/10 border-amber-500/25 text-amber-600 dark:text-amber-400",
  Transport: "bg-blue-subtle dark:bg-gold/10 border-blue-primary/25 dark:border-gold/25 text-blue-primary dark:text-gold",
  Lodging: "bg-luxe/10 border-luxe/25 text-luxe dark:text-luxe-muted",
  Fun: "bg-rose-accent/10 border-rose-accent/25 text-rose-accent dark:text-rose-muted",
};

const FRIEND_COLORS = [
  "from-blue-primary to-blue-light text-white",
  "from-ember to-ember-light text-white",
  "from-luxe to-luxe-muted text-white",
  "from-rose-accent to-rose-muted text-white",
  "from-emerald-accent to-teal-500 text-white",
];

export default function ExpenseView({ initialFriends, initialExpenses, onUpdateState }: ExpenseViewProps) {
  const [friends, setFriends] = useState<Friend[]>(initialFriends);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [newFriendName, setNewFriendName] = useState("");
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<"Food" | "Transport" | "Lodging" | "Fun">("Food");
  const [payerId, setPayerId] = useState("");
  const [splitWithIds, setSplitWithIds] = useState<string[]>([]);
  const [splitAll, setSplitAll] = useState(true);

  useMemo(() => {
    if (friends.length > 0) {
      if (!payerId) setPayerId(friends[0].id);
      if (splitWithIds.length === 0) setSplitWithIds(friends.map((f) => f.id));
    }
  }, [friends, payerId, splitWithIds]);

  const handleAddFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFriendName.trim()) return;
    const newFriend: Friend = {
      id: "fr-" + Math.random().toString(36).substring(2, 9),
      name: newFriendName.trim(),
      color: FRIEND_COLORS[friends.length % FRIEND_COLORS.length],
    };
    const updatedFriends = [...friends, newFriend];
    setFriends(updatedFriends);
    setSplitWithIds((prev) => [...prev, newFriend.id]);
    setNewFriendName("");
    onUpdateState(updatedFriends, expenses);
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!desc.trim() || isNaN(parsedAmount) || parsedAmount <= 0 || !payerId) return;
    const selectedSplitIds = splitAll ? friends.map((f) => f.id) : splitWithIds;
    if (selectedSplitIds.length === 0) return;
    const newExpense: Expense = {
      id: "ex-" + Math.random().toString(36).substring(2, 9),
      description: desc.trim(),
      amount: parsedAmount,
      category,
      payerId,
      splitWithIds: selectedSplitIds,
    };
    const updatedExpenses = [newExpense, ...expenses];
    setExpenses(updatedExpenses);
    setDesc("");
    setAmount("");
    onUpdateState(friends, updatedExpenses);
  };

  const handleDeleteExpense = (id: string) => {
    const updated = expenses.filter((ex) => ex.id !== id);
    setExpenses(updated);
    onUpdateState(friends, updated);
  };

  const balances = useMemo(() => {
    const net: Record<string, number> = {};
    friends.forEach((f) => { net[f.id] = 0; });
    expenses.forEach((ex) => {
      if (net[ex.payerId] !== undefined) net[ex.payerId] += ex.amount;
      const share = ex.amount / ex.splitWithIds.length;
      ex.splitWithIds.forEach((sid) => { if (net[sid] !== undefined) net[sid] -= share; });
    });
    return net;
  }, [friends, expenses]);

  const settlementTransactions = useMemo(() => {
    const debtors: { id: string; amount: number }[] = [];
    const creditors: { id: string; amount: number }[] = [];
    Object.entries(balances).forEach(([friendId, bal]) => {
      const amt = Math.round(bal * 100) / 100;
      if (amt < -0.05) debtors.push({ id: friendId, amount: Math.abs(amt) });
      else if (amt > 0.05) creditors.push({ id: friendId, amount: amt });
    });
    debtors.sort((a, b) => b.amount - a.amount);
    creditors.sort((a, b) => b.amount - a.amount);
    const txs: { fromId: string; toId: string; amount: number }[] = [];
    let dIdx = 0, cIdx = 0;
    while (dIdx < debtors.length && cIdx < creditors.length) {
      const d = debtors[dIdx], c = creditors[cIdx];
      const minAmt = Math.min(d.amount, c.amount);
      if (minAmt > 0.01) txs.push({ fromId: d.id, toId: c.id, amount: minAmt });
      d.amount -= minAmt; c.amount -= minAmt;
      if (d.amount < 0.01) dIdx++;
      if (c.amount < 0.01) cIdx++;
    }
    return txs;
  }, [balances]);

  const handleSettleDebt = (fromId: string, toId: string, settleAmount: number) => {
    const newExpense: Expense = {
      id: "settle-" + Math.random().toString(36).substring(2, 9),
      description: `Settlement: ${friends.find((f) => f.id === fromId)?.name} paid ${friends.find((f) => f.id === toId)?.name}`,
      amount: settleAmount,
      category: "Transport",
      payerId: fromId,
      splitWithIds: [toId],
    };
    const updated = [newExpense, ...expenses];
    setExpenses(updated);
    onUpdateState(friends, updated);
  };

  const categoryStats = useMemo(() => {
    const stats = { Food: 0, Transport: 0, Lodging: 0, Fun: 0 };
    let total = 0;
    expenses.forEach((ex) => {
      if (stats[ex.category] !== undefined) { stats[ex.category] += ex.amount; total += ex.amount; }
    });
    return { breakdown: stats, total };
  }, [expenses]);

  const chartSlices = useMemo(() => {
    const { breakdown, total } = categoryStats;
    if (total === 0) return [];
    let cumPercent = 0;
    return Object.entries(breakdown).map(([cat, amt]) => {
      const percent = amt / total;
      const startPercent = cumPercent;
      cumPercent += percent;
      return { category: cat as "Food" | "Transport" | "Lodging" | "Fun", amount: amt, percentage: Math.round(percent * 100), startPercent };
    }).filter(s => s.amount > 0);
  }, [categoryStats]);

  const toggleSplitFriend = (id: string) => {
    setSplitAll(false);
    setSplitWithIds((prev) => prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start font-sans">

      {/* LEFT: Form + Ledger */}
      <div className="lg:col-span-7 flex flex-col gap-5 sm:gap-6">

        {/* Form */}
        <div className="p-5 sm:p-6 rounded-2xl border border-pearl-border dark:border-obsidian-border bg-pearl-card dark:bg-obsidian-card shadow-sm">
          <h3 className="font-display font-extrabold text-sm text-slate-800 dark:text-stone-50 mb-4 sm:mb-5 flex items-center gap-2">
            <FiDollarSign className="w-4 h-4 text-blue-primary dark:text-gold" /> Record Expense
          </h3>
          <form onSubmit={handleAddExpense} className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="text-[10px] font-bold text-pearl-muted dark:text-obsidian-muted uppercase tracking-wider">Expense Name</label>
                <input required value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="e.g. Roppongi Sushi Dinner" className="w-full mt-1.5 bg-pearl-surface dark:bg-obsidian text-slate-800 dark:text-stone-100 rounded-xl px-3 py-2.5 text-xs border border-pearl-border dark:border-obsidian-border focus:border-blue-primary dark:focus:border-gold focus:outline-none transition-all" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-pearl-muted dark:text-obsidian-muted uppercase tracking-wider">Amount (USD)</label>
                <input required type="number" step="0.01" min="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 145.00" className="w-full mt-1.5 bg-pearl-surface dark:bg-obsidian text-slate-800 dark:text-stone-100 rounded-xl px-3 py-2.5 text-xs border border-pearl-border dark:border-obsidian-border focus:border-blue-primary dark:focus:border-gold focus:outline-none transition-all" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="text-[10px] font-bold text-pearl-muted dark:text-obsidian-muted uppercase tracking-wider">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value as typeof category)} className="w-full mt-1.5 bg-pearl-surface dark:bg-obsidian text-slate-800 dark:text-stone-100 rounded-xl px-3 py-2.5 text-xs border border-pearl-border dark:border-obsidian-border focus:border-blue-primary dark:focus:border-gold focus:outline-none transition-all">
                  <option value="Food">🍱 Food & Dining</option>
                  <option value="Transport">🚕 Transport & Fares</option>
                  <option value="Lodging">🏨 Lodging & Stays</option>
                  <option value="Fun">🎟️ Fun & Activities</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-pearl-muted dark:text-obsidian-muted uppercase tracking-wider">Paid By</label>
                <select value={payerId} onChange={(e) => setPayerId(e.target.value)} className="w-full mt-1.5 bg-pearl-surface dark:bg-obsidian text-slate-800 dark:text-stone-100 rounded-xl px-3 py-2.5 text-xs border border-pearl-border dark:border-obsidian-border focus:border-blue-primary dark:focus:border-gold focus:outline-none transition-all">
                  {friends.map((f) => (<option key={f.id} value={f.id}>{f.name}</option>))}
                </select>
              </div>
            </div>

            {/* Split picker */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] font-bold text-pearl-muted dark:text-obsidian-muted uppercase tracking-wider">Split Recipients</label>
                <button type="button" onClick={() => { setSplitAll(true); setSplitWithIds(friends.map((f) => f.id)); }}
                  className={`text-[9px] font-bold uppercase transition-all cursor-pointer ${splitAll ? "text-blue-primary dark:text-gold" : "text-pearl-muted hover:text-slate-600"}`}>
                  Split Equally
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {friends.map((f) => {
                  const selected = splitAll || splitWithIds.includes(f.id);
                  return (
                    <button key={f.id} type="button" onClick={() => toggleSplitFriend(f.id)}
                      className={`px-2.5 sm:px-3 py-1.5 rounded-lg border text-[11px] sm:text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
                        selected
                          ? "border-blue-primary/30 dark:border-gold/30 bg-blue-subtle dark:bg-gold/[0.06] text-blue-primary dark:text-gold font-bold"
                          : "border-pearl-border dark:border-obsidian-border bg-pearl-surface dark:bg-obsidian text-pearl-muted dark:text-obsidian-muted"
                      }`}>
                      <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${f.color}`} />
                      {f.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <button type="submit" className="w-full py-2.5 sm:py-3 rounded-xl font-bold text-xs bg-blue-primary dark:bg-gold text-white dark:text-obsidian shadow hover:scale-[1.02] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1">
              <FiPlus className="w-4 h-4" /> Add to Ledger
            </button>
          </form>
        </div>

        {/* Ledger */}
        <div className="p-5 sm:p-6 rounded-2xl border border-pearl-border dark:border-obsidian-border bg-pearl-card dark:bg-obsidian-card shadow-sm">
          <div className="flex justify-between items-center mb-4 sm:mb-5 border-b border-pearl-border/50 dark:border-obsidian-border/50 pb-3">
            <h3 className="font-display font-extrabold text-sm text-slate-800 dark:text-stone-50">Group Ledger</h3>
            <span className="text-[10px] font-bold text-pearl-muted dark:text-obsidian-muted uppercase tracking-wider">{expenses.length} Records</span>
          </div>
          <div className="space-y-3 max-h-[300px] sm:max-h-[350px] overflow-y-auto pr-1">
            {expenses.length === 0 ? (
              <div className="text-center py-8 sm:py-10 text-pearl-muted dark:text-obsidian-muted text-xs">
                <FiInfo className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2" /> No expenses logged yet.
              </div>
            ) : (
              expenses.map((ex) => {
                const payer = friends.find((f) => f.id === ex.payerId);
                const isSettlement = ex.description.startsWith("Settlement:");
                return (
                  <div key={ex.id} className="p-3 sm:p-3.5 rounded-xl border border-pearl-border dark:border-obsidian-border/60 bg-pearl-surface/50 dark:bg-obsidian-elevated/50 flex items-center justify-between hover:border-blue-primary/15 dark:hover:border-gold/15 transition-all duration-200">
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                      <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr ${payer?.color || "from-slate-500 to-slate-700 text-white"} flex items-center justify-center font-bold text-[10px] sm:text-xs flex-shrink-0`}>
                        {payer?.name[0].toUpperCase() || "?"}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-[11px] sm:text-xs text-slate-800 dark:text-stone-200 leading-tight truncate">{ex.description}</h4>
                        <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1 flex-wrap">
                          <span className={`text-[8px] px-1.5 py-0.5 rounded border uppercase tracking-wider font-bold ${isSettlement ? "bg-emerald-accent/10 border-emerald-accent/20 text-emerald-accent" : CATEGORY_COLORS[ex.category]}`}>
                            {isSettlement ? "Settled" : ex.category}
                          </span>
                          <span className="text-[8px] sm:text-[9px] text-pearl-muted dark:text-obsidian-muted font-medium">
                            {payer?.name || "?"} • {ex.splitWithIds.length} sharing
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                      <span className="font-black text-[11px] sm:text-xs text-slate-900 dark:text-stone-50">${ex.amount.toFixed(2)}</span>
                      <button onClick={() => handleDeleteExpense(ex.id)} className="p-1 sm:p-1.5 text-pearl-muted hover:text-rose-accent rounded hover:bg-pearl-surface dark:hover:bg-obsidian-elevated transition-all cursor-pointer" title="Delete">
                        <FiTrash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* RIGHT: Balances, Chart, Settlement */}
      <div className="lg:col-span-5 flex flex-col gap-5 sm:gap-6">

        {/* Friends & Balances */}
        <div className="p-5 sm:p-6 rounded-2xl border border-pearl-border dark:border-obsidian-border bg-pearl-card dark:bg-obsidian-card shadow-sm">
          <div className="flex justify-between items-center mb-3 sm:mb-4 pb-2 border-b border-pearl-border/50 dark:border-obsidian-border/50">
            <h3 className="font-display font-extrabold text-sm text-slate-800 dark:text-stone-50">Trip Mates & Balances</h3>
            <span className="text-[10px] font-bold text-pearl-muted dark:text-obsidian-muted uppercase tracking-wider">{friends.length} Active</span>
          </div>
          <form onSubmit={handleAddFriend} className="flex gap-2 mb-3 sm:mb-4">
            <input required value={newFriendName} onChange={(e) => setNewFriendName(e.target.value)} placeholder="Friend's name" className="flex-1 bg-pearl-surface dark:bg-obsidian text-slate-800 dark:text-stone-100 rounded-lg px-3 py-2 text-[11px] border border-pearl-border dark:border-obsidian-border focus:border-blue-primary dark:focus:border-gold focus:outline-none transition-all" />
            <button type="submit" className="px-3 py-2 bg-blue-primary dark:bg-gold text-white dark:text-obsidian rounded-lg hover:scale-105 active:scale-95 transition-all text-xs font-bold flex items-center justify-center cursor-pointer shadow-sm">
              <FiUserPlus className="w-3.5 h-3.5" />
            </button>
          </form>
          <div className="space-y-2.5 sm:space-y-3 max-h-[200px] sm:max-h-[220px] overflow-y-auto pr-1">
            {friends.map((f) => {
              const bal = balances[f.id] || 0;
              const formattedBal = Math.round(bal * 100) / 100;
              const isPositive = formattedBal > 0.05;
              const isZero = Math.abs(formattedBal) <= 0.05;
              return (
                <div key={f.id} className="flex items-center justify-between text-xs py-0.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-tr ${f.color} flex items-center justify-center font-bold text-[9px] sm:text-[10px]`}>
                      {f.name[0].toUpperCase()}
                    </div>
                    <span className="font-bold text-slate-800 dark:text-stone-200">{f.name}</span>
                  </div>
                  <span className={`font-black text-xs ${isZero ? "text-pearl-muted dark:text-obsidian-muted" : isPositive ? "text-emerald-accent" : "text-rose-accent"}`}>
                    {isZero ? "Balanced" : isPositive ? `+ $${formattedBal.toFixed(2)}` : `- $${Math.abs(formattedBal).toFixed(2)}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Chart */}
        <div className="p-5 sm:p-6 rounded-2xl border border-pearl-border dark:border-obsidian-border bg-pearl-card dark:bg-obsidian-card shadow-sm">
          <h3 className="font-display font-extrabold text-sm text-slate-800 dark:text-stone-50 mb-3 sm:mb-4">Category Analysis</h3>
          {categoryStats.total === 0 ? (
            <div className="text-center py-5 sm:py-6 text-pearl-muted dark:text-obsidian-muted text-xs">Add expenses to see category breakdown.</div>
          ) : (
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 42 42">
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="currentColor" strokeWidth="4" className="text-pearl-border dark:text-obsidian-border" />
                  {chartSlices.map((slice, i) => {
                    const strokeDash = `${slice.percentage} ${100 - slice.percentage}`;
                    const strokeOffset = 100 - slice.startPercent * 100;
                    let strokeColor = "#f59e0b";
                    if (slice.category === "Transport") strokeColor = "#3B82F6";
                    if (slice.category === "Lodging") strokeColor = "#9B7AEA";
                    if (slice.category === "Fun") strokeColor = "#F0556E";
                    return (
                      <circle key={i} cx="21" cy="21" r="15.915" fill="transparent" stroke={strokeColor} strokeWidth="4" strokeDasharray={strokeDash} strokeDashoffset={strokeOffset} className="transition-all duration-500 ease-in-out" />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center font-sans">
                  <span className="text-[8px] sm:text-[10px] font-bold text-pearl-muted dark:text-obsidian-muted uppercase tracking-wider">Total</span>
                  <span className="text-[11px] sm:text-xs font-black text-slate-900 dark:text-stone-50">${categoryStats.total.toFixed(0)}</span>
                </div>
              </div>
              <div className="flex-1 space-y-1.5 sm:space-y-2 text-xs">
                {Object.entries(categoryStats.breakdown).map(([cat, amt]) => {
                  const percent = categoryStats.total > 0 ? Math.round((amt / categoryStats.total) * 100) : 0;
                  let dotColor = "bg-amber-500";
                  if (cat === "Transport") dotColor = "bg-blue-primary";
                  if (cat === "Lodging") dotColor = "bg-luxe";
                  if (cat === "Fun") dotColor = "bg-rose-accent";
                  return (
                    <div key={cat} className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-slate-600 dark:text-obsidian-muted">
                        <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                        <span className="font-medium">{cat}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-800 dark:text-stone-200">${amt.toFixed(0)}</span>
                        <span className="text-[10px] text-pearl-muted dark:text-obsidian-muted ml-1.5">({percent}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Settlement */}
        <div className="p-5 sm:p-6 rounded-2xl border border-pearl-border dark:border-obsidian-border bg-gradient-to-b from-slate-800 to-slate-900 dark:from-obsidian-card dark:to-obsidian-surface text-stone-100 shadow-lg">
          <div className="flex justify-between items-center mb-3 sm:mb-4 pb-2 border-b border-slate-700 dark:border-obsidian-border">
            <h3 className="font-display font-extrabold text-sm text-blue-light dark:text-gold flex items-center gap-1.5">
              <FiLayers className="w-4 h-4" /> Optimal Settlement
            </h3>
            <span className="text-[8px] sm:text-[9px] bg-blue-primary/15 dark:bg-gold/10 border border-blue-primary/20 dark:border-gold/15 text-blue-light dark:text-gold px-1.5 sm:px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              {settlementTransactions.length} Paths
            </span>
          </div>
          <div className="space-y-3">
            {settlementTransactions.length === 0 ? (
              <div className="text-center py-5 sm:py-6 text-stone-400 text-xs flex flex-col items-center gap-1">
                <FiCheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-accent" />
                All balances settled!
              </div>
            ) : (
              settlementTransactions.map((tx, idx) => {
                const from = friends.find((f) => f.id === tx.fromId);
                const to = friends.find((f) => f.id === tx.toId);
                return (
                  <div key={idx} className="p-3 sm:p-3.5 rounded-xl border border-slate-700 dark:border-obsidian-border bg-slate-800/60 dark:bg-obsidian/60 flex items-center justify-between text-xs gap-2">
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap min-w-0">
                      <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-tr ${from?.color || "from-slate-500 to-slate-700 text-white"} flex items-center justify-center font-bold text-[8px] sm:text-[9px] flex-shrink-0`}>
                        {from?.name[0].toUpperCase()}
                      </div>
                      <span className="font-bold text-stone-300 text-[11px] sm:text-xs truncate">{from?.name}</span>
                      <span className="text-[8px] sm:text-[9px] font-bold text-rose-accent bg-rose-accent/10 border border-rose-accent/20 px-1 sm:px-1.5 py-0.5 rounded shadow flex-shrink-0">
                        ${tx.amount.toFixed(2)}
                      </span>
                      <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-tr ${to?.color || "from-slate-500 to-slate-700 text-white"} flex items-center justify-center font-bold text-[8px] sm:text-[9px] flex-shrink-0`}>
                        {to?.name[0].toUpperCase()}
                      </div>
                      <span className="font-bold text-stone-300 text-[11px] sm:text-xs truncate">{to?.name}</span>
                    </div>
                    <button onClick={() => handleSettleDebt(tx.fromId, tx.toId, tx.amount)}
                      className="px-2 sm:px-2.5 py-1.5 bg-blue-primary dark:bg-gold text-white dark:text-obsidian font-black text-[8px] sm:text-[9px] uppercase tracking-wider rounded hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow flex-shrink-0">
                      Settle
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
