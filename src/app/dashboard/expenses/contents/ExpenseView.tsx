"use client";

import { useState, useMemo } from "react";
import { FiPlus, FiTrash2, FiUserPlus, FiDollarSign, FiInfo, FiLayers, FiCheckCircle } from "react-icons/fi";
import { useLanguage } from "@/i18n/LanguageProvider";
import { friendTone } from "../../layout/DashboardContext";

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
  Food: "bg-sunset-wash text-sunset-ink",
  Transport: "bg-coast-wash text-coast-deep",
  Lodging: "bg-sun/25 text-ink",
  Fun: "bg-meadow/15 text-meadow-deep",
};

// Donut + legend swatch per category, drawn from the "Sunset Coast" tokens.
const CATEGORY_DOT: Record<Expense["category"], string> = {
  Food: "bg-sunset",
  Transport: "bg-coast",
  Lodging: "bg-sun",
  Fun: "bg-meadow",
};
const CATEGORY_STROKE: Record<Expense["category"], string> = {
  Food: "var(--color-sunset)",
  Transport: "var(--color-coast)",
  Lodging: "var(--color-sun)",
  Fun: "var(--color-meadow)",
};

const FRIEND_COLORS = [
  "from-blue-primary to-blue-light text-white",
  "from-ember to-ember-light text-white",
  "from-luxe to-luxe-muted text-white",
  "from-rose-accent to-rose-muted text-white",
  "from-emerald-accent to-teal-500 text-white",
];

export default function ExpenseView({ initialFriends, initialExpenses, onUpdateState }: ExpenseViewProps) {
  const { t } = useLanguage();
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

  const inputClass =
    "w-full rounded-xl border border-line bg-canvas px-3 py-2.5 text-xs text-ink placeholder:text-ink-faint transition-colors focus:border-coast focus:outline-none focus:ring-2 focus:ring-coast/30";

  return (
    <div className="grid grid-cols-1 items-start gap-5 font-sans sm:gap-6 lg:grid-cols-12">

      {/* LEFT: Form + Ledger */}
      <div className="flex flex-col gap-5 sm:gap-6 lg:col-span-7">

        {/* Form */}
        <div className="rounded-3xl border border-line bg-canvas p-5 lp-postcard sm:p-6">
          <h3 className="mb-5 flex items-center gap-2 font-serif text-lg text-ink">
            <FiDollarSign className="h-4 w-4 text-sunset" /> {t("expenses.record")}
          </h3>
          <form onSubmit={handleAddExpense} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-faint">{t("expenses.name")}</label>
                <input required value={desc} onChange={(e) => setDesc(e.target.value)} placeholder={t("expenses.namePlaceholder")} className={`mt-1.5 ${inputClass}`} />
              </div>
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-faint">{t("expenses.amount")}</label>
                <input required type="number" step="0.01" min="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={t("expenses.amountPlaceholder")} className={`mt-1.5 ${inputClass}`} />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-faint">{t("expenses.category")}</label>
                <select value={category} onChange={(e) => setCategory(e.target.value as typeof category)} className={`mt-1.5 cursor-pointer ${inputClass}`}>
                  <option value="Food">{t("expenses.catFood")}</option>
                  <option value="Transport">{t("expenses.catTransport")}</option>
                  <option value="Lodging">{t("expenses.catLodging")}</option>
                  <option value="Fun">{t("expenses.catFun")}</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-faint">{t("expenses.paidBy")}</label>
                <select value={payerId} onChange={(e) => setPayerId(e.target.value)} className={`mt-1.5 cursor-pointer ${inputClass}`}>
                  {friends.map((f) => (<option key={f.id} value={f.id}>{f.name}</option>))}
                </select>
              </div>
            </div>

            {/* Split picker */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-faint">{t("expenses.splitRecipients")}</label>
                <button type="button" onClick={() => { setSplitAll(true); setSplitWithIds(friends.map((f) => f.id)); }}
                  className={`cursor-pointer text-[10px] font-semibold uppercase tracking-wider transition-colors ${splitAll ? "text-coast-deep" : "text-ink-faint hover:text-ink"}`}>
                  {t("expenses.splitEqually")}
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {friends.map((f) => {
                  const selected = splitAll || splitWithIds.includes(f.id);
                  return (
                    <button key={f.id} type="button" onClick={() => toggleSplitFriend(f.id)}
                      className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                        selected
                          ? "border-coast/40 bg-coast-wash text-coast-deep"
                          : "border-line bg-canvas text-ink-faint hover:text-ink"
                      }`}>
                      <span className={`h-2 w-2 rounded-full ${friendTone(f.id)}`} />
                      {f.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <button type="submit" className="lp-focus flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-full bg-sunset-deep py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 active:translate-y-0">
              <FiPlus className="h-4 w-4" /> {t("expenses.addToLedger")}
            </button>
          </form>
        </div>

        {/* Ledger */}
        <div className="rounded-3xl border border-line bg-canvas p-5 lp-postcard sm:p-6">
          <div className="mb-5 flex items-center justify-between border-b border-line pb-3">
            <h3 className="font-serif text-lg text-ink">{t("expenses.groupLedger")}</h3>
            <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-faint">{t("expenses.records", { n: expenses.length })}</span>
          </div>
          <div className="max-h-[350px] space-y-3 overflow-y-auto pr-1">
            {expenses.length === 0 ? (
              <div className="py-10 text-center text-xs text-ink-faint">
                <FiInfo className="mx-auto mb-2 h-6 w-6" /> {t("expenses.noExpenses")}
              </div>
            ) : (
              expenses.map((ex) => {
                const payer = friends.find((f) => f.id === ex.payerId);
                const isSettlement = ex.description.startsWith("Settlement:");
                return (
                  <div key={ex.id} className="flex items-center justify-between rounded-2xl border border-line bg-canvas-sink/50 p-3.5 transition-colors hover:border-coast/30">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold ${payer ? friendTone(payer.id) : "bg-shell text-ink-soft"}`}>
                        {payer?.name[0].toUpperCase() || "?"}
                      </div>
                      <div className="min-w-0">
                        <h4 className="truncate text-xs font-semibold leading-tight text-ink">{ex.description}</h4>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <span className={`rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${isSettlement ? "bg-meadow/15 text-meadow-deep" : CATEGORY_COLORS[ex.category]}`}>
                            {isSettlement ? t("expenses.settled") : t(`categories.${ex.category}`)}
                          </span>
                          <span className="text-[9px] font-medium text-ink-faint">
                            {t("expenses.sharing", { name: payer?.name || "?", n: ex.splitWithIds.length })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-3">
                      <span className="text-xs font-semibold tabular-nums text-ink">${ex.amount.toFixed(2)}</span>
                      <button onClick={() => handleDeleteExpense(ex.id)} className="lp-focus rounded-md p-1.5 text-ink-faint transition-colors hover:bg-sunset-wash hover:text-sunset-ink" title={t("common.delete")}>
                        <FiTrash2 className="h-3.5 w-3.5" />
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
      <div className="flex flex-col gap-5 sm:gap-6 lg:col-span-5">

        {/* Friends & Balances */}
        <div className="rounded-3xl border border-line bg-canvas p-5 lp-postcard sm:p-6">
          <div className="mb-4 flex items-center justify-between border-b border-line pb-3">
            <h3 className="font-serif text-lg text-ink">{t("expenses.mates")}</h3>
            <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-faint">{t("expenses.active", { n: friends.length })}</span>
          </div>
          <form onSubmit={handleAddFriend} className="mb-4 flex gap-2">
            <input required value={newFriendName} onChange={(e) => setNewFriendName(e.target.value)} placeholder={t("expenses.friendNamePlaceholder")} className={inputClass} />
            <button type="submit" className="lp-focus grid cursor-pointer place-items-center rounded-full bg-sunset-deep px-3.5 text-white transition-transform hover:-translate-y-0.5 active:translate-y-0">
              <FiUserPlus className="h-3.5 w-3.5" />
            </button>
          </form>
          <div className="max-h-[220px] space-y-3 overflow-y-auto pr-1">
            {friends.map((f) => {
              const bal = balances[f.id] || 0;
              const formattedBal = Math.round(bal * 100) / 100;
              const isPositive = formattedBal > 0.05;
              const isZero = Math.abs(formattedBal) <= 0.05;
              return (
                <div key={f.id} className="flex items-center justify-between py-0.5 text-xs">
                  <div className="flex items-center gap-2">
                    <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold ${friendTone(f.id)}`}>
                      {f.name[0].toUpperCase()}
                    </div>
                    <span className="font-semibold text-ink">{f.name}</span>
                  </div>
                  <span className={`text-xs font-semibold tabular-nums ${isZero ? "text-ink-faint" : isPositive ? "text-meadow-deep" : "text-sunset-ink"}`}>
                    {isZero ? t("expenses.balanced") : isPositive ? `+ $${formattedBal.toFixed(2)}` : `- $${Math.abs(formattedBal).toFixed(2)}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Chart */}
        <div className="rounded-3xl border border-line bg-canvas p-5 lp-postcard sm:p-6">
          <h3 className="mb-4 font-serif text-lg text-ink">{t("expenses.categoryAnalysis")}</h3>
          {categoryStats.total === 0 ? (
            <div className="py-6 text-center text-xs text-ink-faint">{t("expenses.addToSeeBreakdown")}</div>
          ) : (
            <div className="flex items-center gap-6">
              <div className="relative h-24 w-24 flex-shrink-0">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 42 42">
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="currentColor" strokeWidth="4" className="text-line" />
                  {chartSlices.map((slice, i) => {
                    const strokeDash = `${slice.percentage} ${100 - slice.percentage}`;
                    const strokeOffset = 100 - slice.startPercent * 100;
                    return (
                      <circle key={i} cx="21" cy="21" r="15.915" fill="transparent" stroke={CATEGORY_STROKE[slice.category]} strokeWidth="4" strokeDasharray={strokeDash} strokeDashoffset={strokeOffset} className="transition-all duration-500 ease-in-out" />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[9px] font-semibold uppercase tracking-wider text-ink-faint">{t("expenses.total")}</span>
                  <span className="font-serif text-sm tabular-nums text-ink">${categoryStats.total.toFixed(0)}</span>
                </div>
              </div>
              <div className="flex-1 space-y-2 text-xs">
                {Object.entries(categoryStats.breakdown).map(([cat, amt]) => {
                  const percent = categoryStats.total > 0 ? Math.round((amt / categoryStats.total) * 100) : 0;
                  return (
                    <div key={cat} className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-ink-soft">
                        <span className={`h-2 w-2 rounded-full ${CATEGORY_DOT[cat as Expense["category"]]}`} />
                        <span className="font-medium">{t(`categories.${cat}`)}</span>
                      </div>
                      <div className="text-right tabular-nums">
                        <span className="font-semibold text-ink">${amt.toFixed(0)}</span>
                        <span className="ml-1.5 text-[10px] text-ink-faint">({percent}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Settlement — the page's one dark moment */}
        <div className="rounded-3xl bg-ink p-5 text-canvas shadow-lg sm:p-6">
          <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="flex items-center gap-1.5 font-serif text-lg text-sun">
              <FiLayers className="h-4 w-4" /> {t("expenses.optimalSettlement")}
            </h3>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-sun">
              {t("expenses.paths", { n: settlementTransactions.length })}
            </span>
          </div>
          <div className="space-y-3">
            {settlementTransactions.length === 0 ? (
              <div className="flex flex-col items-center gap-1 py-6 text-center text-xs text-canvas/60">
                <FiCheckCircle className="h-6 w-6 text-meadow" />
                {t("expenses.allSettled")}
              </div>
            ) : (
              settlementTransactions.map((tx, idx) => {
                const from = friends.find((f) => f.id === tx.fromId);
                const to = friends.find((f) => f.id === tx.toId);
                return (
                  <div key={idx} className="flex items-center justify-between gap-2 rounded-2xl bg-white/[0.06] p-3.5 text-xs">
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                      <div className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[9px] font-semibold ${from ? friendTone(from.id) : "bg-white/15 text-canvas"}`}>
                        {from?.name[0].toUpperCase()}
                      </div>
                      <span className="truncate text-xs font-semibold text-canvas/80">{from?.name}</span>
                      <span className="flex-shrink-0 rounded-full bg-white/10 px-1.5 py-0.5 text-[9px] font-semibold tabular-nums text-sun">
                        ${tx.amount.toFixed(2)}
                      </span>
                      <div className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[9px] font-semibold ${to ? friendTone(to.id) : "bg-white/15 text-canvas"}`}>
                        {to?.name[0].toUpperCase()}
                      </div>
                      <span className="truncate text-xs font-semibold text-canvas/80">{to?.name}</span>
                    </div>
                    <button onClick={() => handleSettleDebt(tx.fromId, tx.toId, tx.amount)}
                      className="lp-focus flex-shrink-0 cursor-pointer rounded-full bg-sunset-deep px-3 py-1.5 text-[9px] font-semibold uppercase tracking-wider text-white transition-transform hover:-translate-y-0.5 active:translate-y-0">
                      {t("expenses.settle")}
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
