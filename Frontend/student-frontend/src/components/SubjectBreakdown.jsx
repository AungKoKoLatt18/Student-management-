import { semLabel, yearLabel } from "../utils/constants";

export default function SubjectBreakdown({
  year, semesters, curriculum, counts, activeSem, activeSubject, onPick,
}) {
  return (
    <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-base font-bold text-slate-900">
        {yearLabel(year)} · students per subject
      </h2>

      <div className="space-y-5">
        {semesters.map((sem) => {
          const subjects = curriculum?.[year]?.[sem] ?? [];
          const semTotal = counts.sem[`${year}-${sem}`] || 0;
          return (
            <div key={sem}>
              <p className="mb-2 text-sm font-semibold text-slate-600">
                {semLabel(sem)}{" "}
                <span className="font-normal text-slate-400">· {semTotal} students</span>
              </p>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {subjects.map((subj) => {
                  const n = counts.subj[`${year}-${sem}-${subj}`] || 0;
                  const active = activeSem === String(sem) && activeSubject === subj;
                  return (
                    <button
                      key={subj}
                      onClick={() => onPick(sem, subj)}
                      className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left text-sm transition ${
                        active
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
                      }`}
                    >
                      <span className="truncate font-medium text-slate-700">{subj}</span>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${
                          n ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {n}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}