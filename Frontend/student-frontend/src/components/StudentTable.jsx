import { ChevronDown, ChevronUp, ChevronsUpDown, Pencil, Trash2 } from "lucide-react";

const colors = [
  "bg-indigo-100 text-indigo-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-sky-100 text-sky-700",
  "bg-violet-100 text-violet-700",
];

const colorFor = (name = "") =>
  colors[[...name].reduce((sum, c) => sum + c.charCodeAt(0), 0) % colors.length];

const initials = (name = "") =>
  name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]).join("").toUpperCase();

function SortHeader({ label, field, sort, onSort, className = "" }) {
  const active = sort.key === field;
  const Icon = !active ? ChevronsUpDown : sort.dir === "asc" ? ChevronUp : ChevronDown;
  return (
    <th className={`px-4 py-3 ${className}`}>
      <button
        onClick={() => onSort(field)}
        className={`flex items-center gap-1 uppercase tracking-wider ${active ? "text-indigo-600" : ""}`}
      >
        {label} <Icon size={14} />
      </button>
    </th>
  );
}

export default function StudentTable({ students, loading, sort, onSort, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 animate-pulse rounded-lg bg-slate-100" />
        ))}
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-14 text-center">
        <p className="font-semibold text-slate-700">No students found</p>
        <p className="mt-1 text-sm text-slate-500">Add a student or adjust your filters.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left text-xs font-semibold text-slate-500">
          <tr>
            <SortHeader label="Roll No" field="rollNo" sort={sort} onSort={onSort} />
            <SortHeader label="Student" field="name" sort={sort} onSort={onSort} />
            <SortHeader label="Age" field="age" sort={sort} onSort={onSort} />
            <SortHeader label="Year / Sem" field="year" sort={sort} onSort={onSort} />
            <th className="px-4 py-3 uppercase tracking-wider">Subjects</th>
            <th className="px-4 py-3 text-right uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {students.map((s) => (
            <tr key={s.id} className="transition hover:bg-slate-50">
              <td className="px-4 py-3 font-mono text-slate-600">{s.rollNo}</td>

              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${colorFor(s.name)}`}
                  >
                    {initials(s.name)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{s.name}</p>
                    <p className="text-xs text-slate-500">{s.email}</p>
                  </div>
                </div>
              </td>

              <td className="px-4 py-3">{s.age}</td>

              <td className="px-4 py-3">
                {s.year ? (
                  <span className="whitespace-nowrap rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                    Year {s.year} · Sem {s.semester}
                  </span>
                ) : (
                  <span className="text-slate-400">–</span>
                )}
              </td>

              <td className="px-4 py-3">
                <div className="flex max-w-xs flex-wrap gap-1.5">
                  {(s.subjects ?? []).slice(0, 2).map((sub) => (
                    <span
                      key={sub}
                      className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700"
                    >
                      {sub}
                    </span>
                  ))}
                  {(s.subjects?.length ?? 0) > 2 && (
                    <span
                      title={s.subjects.slice(2).join(", ")}
                      className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600"
                    >
                      +{s.subjects.length - 2}
                    </span>
                  )}
                  {(s.subjects?.length ?? 0) === 0 && <span className="text-slate-400">–</span>}
                </div>
              </td>

              <td className="whitespace-nowrap px-4 py-3 text-right">
                <button
                  onClick={() => onEdit(s)}
                  className="mr-1 rounded-lg p-2 text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600"
                  aria-label="Edit"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => onDelete(s)}
                  className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                  aria-label="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}