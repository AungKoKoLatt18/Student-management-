import { useEffect, useState } from "react";
import { Check, Loader2, X } from "lucide-react";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import { validateStudent } from "../utils/validators";
import { SEMESTERS, YEARS, semLabel, yearLabel } from "../utils/constants";

const empty = { name: "", email: "", age: "", rollNo: "", year: "", semester: "", subjects: [] };

const init = (student) =>
  student
    ? {
        ...student,
        year: student.year ? String(student.year) : "",
        semester: student.semester ? String(student.semester) : "",
        subjects: student.subjects ?? [],
      }
    : empty;

export default function StudentFormModal({ student, curriculum, onClose, onSave }) {
  const [form, setForm] = useState(() => init(student));
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [serverErrors, setServerErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const errors = validateStudent(form, curriculum);
  const show = (f) => (touched[f] || submitted ? errors[f] : undefined) || serverErrors[f];

  const subjectList = curriculum?.[form.year]?.[form.semester] ?? [];
  const ready = form.year && form.semester;

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => {
      const next = { ...f, [name]: value };
      if (name === "year" || name === "semester") {
        const list = curriculum?.[next.year]?.[next.semester] ?? [];
        next.subjects = f.subjects.filter((s) => list.includes(s)); // one semester only
      }
      return next;
    });
    setServerErrors((er) => ({ ...er, [name]: undefined }));
  };

  const handleBlur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }));

  const toggleSubject = (subject) => {
    setForm((f) => ({
      ...f,
      subjects: f.subjects.includes(subject)
        ? f.subjects.filter((s) => s !== subject)
        : [...f.subjects, subject],
    }));
    setTouched((t) => ({ ...t, subjects: true }));
    setServerErrors((er) => ({ ...er, subjects: undefined }));
  };

  const setAll = (all) => {
    setForm((f) => ({ ...f, subjects: all ? [...subjectList] : [] }));
    setTouched((t) => ({ ...t, subjects: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length) return;

    setSaving(true);
    const result = await onSave({
      name: form.name.trim(),
      email: form.email.trim(),
      age: Number(form.age),
      rollNo: Number(form.rollNo),
      year: Number(form.year),
      semester: Number(form.semester),
      subjects: form.subjects,
    });
    setSaving(false);
    if (result?.errors) setServerErrors(result.errors);
  };

  const props = (name) => ({
    name,
    value: form[name],
    onChange: handleChange,
    onBlur: handleBlur,
    error: show(name),
  });

  const subjectsError = show("subjects");

  return (
    <div
      className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        noValidate
        onClick={(e) => e.stopPropagation()}
        className="my-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold">{student ? "Edit student" : "Add student"}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <FormInput label="Full name" placeholder="Jane Doe" {...props("name")} />
          <FormInput label="Email" type="email" placeholder="jane@example.com" {...props("email")} />
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Age" type="number" placeholder="20" {...props("age")} />
            <FormInput label="Roll number" type="number" placeholder="101" {...props("rollNo")} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              label="Year"
              placeholder="Select year"
              options={YEARS.map((y) => ({ value: String(y), label: yearLabel(y) }))}
              {...props("year")}
            />
            <FormSelect
              label="Semester"
              placeholder="Select semester"
              options={SEMESTERS.map((s) => ({ value: String(s), label: semLabel(s) }))}
              {...props("semester")}
            />
          </div>

          {/* Subjects: multi-select, one semester only */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">
                Subjects{" "}
                {ready && (
                  <span className="font-normal text-slate-400">
                    ({form.subjects.length}/{subjectList.length} selected)
                  </span>
                )}
              </label>
              {ready && (
                <div className="flex gap-3 text-xs font-medium">
                  <button type="button" onClick={() => setAll(true)} className="text-indigo-600 hover:underline">
                    Select all
                  </button>
                  <button type="button" onClick={() => setAll(false)} className="text-slate-500 hover:underline">
                    Clear
                  </button>
                </div>
              )}
            </div>

            {!ready ? (
              <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-4 text-center text-sm text-slate-400">
                Choose a year and semester first
              </p>
            ) : (
              <div
                className={`grid gap-2 rounded-xl border p-2 sm:grid-cols-2 ${
                  subjectsError ? "border-red-400" : "border-slate-200"
                }`}
              >
                {subjectList.map((subj) => {
                  const on = form.subjects.includes(subj);
                  return (
                    <button
                      type="button"
                      key={subj}
                      onClick={() => toggleSubject(subj)}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition ${
                        on
                          ? "border-indigo-500 bg-indigo-50 text-indigo-800"
                          : "border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                          on ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-300"
                        }`}
                      >
                        {on && <Check size={12} strokeWidth={3} />}
                      </span>
                      <span className="truncate">{subj}</span>
                    </button>
                  );
                })}
              </div>
            )}
            {subjectsError && <p className="mt-1 text-xs text-red-600">{subjectsError}</p>}
            {ready && (
              <p className="mt-1.5 text-xs text-slate-400">
                A student can take subjects from one semester only. Changing the year or semester clears the selection.
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            {saving ? "Saving..." : student ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}