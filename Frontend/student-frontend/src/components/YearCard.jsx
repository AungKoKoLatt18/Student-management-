import { yearLabel } from "../utils/constants";

const tones = {
  1: { bar: "bg-indigo-500", chip: "bg-indigo-50 text-indigo-700", ring: "ring-indigo-400" },
  2: { bar: "bg-emerald-500", chip: "bg-emerald-50 text-emerald-700", ring: "ring-emerald-400" },
  3: { bar: "bg-amber-500", chip: "bg-amber-50 text-amber-700", ring: "ring-amber-400" },
  4: { bar: "bg-rose-500", chip: "bg-rose-50 text-rose-700", ring: "ring-rose-400" },
};

export default function YearCard({ year, total, sem1, sem2, active, onClick }) {
  const t = tones[year];
  return (
    <button
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        active ? `ring-2 ${t.ring}` : ""
      }`}
    >
      <div className={`absolute inset-x-0 top-0 h-1 ${t.bar}`} />
      <p className="text-sm font-medium text-slate-500">{yearLabel(year)}</p>
      <p className="mt-1 text-3xl font-bold text-slate-900">{total}</p>
      <p className="text-xs text-slate-400">students</p>
      <div className="mt-4 flex gap-2 text-xs font-medium">
        <span className={`rounded-full px-2.5 py-1 ${t.chip}`}>Sem 1: {sem1}</span>
        <span className={`rounded-full px-2.5 py-1 ${t.chip}`}>Sem 2: {sem2}</span>
      </div>
    </button>
  );
}