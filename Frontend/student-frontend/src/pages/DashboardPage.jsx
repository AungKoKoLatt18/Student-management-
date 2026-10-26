import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { Plus, Search, X } from "lucide-react";
import {
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../api/studentApi";
import { getCurriculum } from "../api/curriculumApi";
import { SEMESTERS, YEARS, semLabel, yearLabel } from "../utils/constants";
import Navbar from "../components/Navbar";
import YearCard from "../components/YearCard";
import SubjectBreakdown from "../components/SubjectBreakdown";
import StudentTable from "../components/StudentTable";
import Pagination from "../components/Pagination";
import StudentFormModal from "../components/StudentFormModal";
import ConfirmDialog from "../components/ConfirmDialog";

const PAGE_SIZE = 8;
const selectClass =
  "rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400";

export default function DashboardPage() {
  const [students, setStudents] = useState([]);
  const [curriculum, setCurriculum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [yearF, setYearF] = useState("all");
  const [semF, setSemF] = useState("all");
  const [subjectF, setSubjectF] = useState("all");
  const [sort, setSort] = useState({ key: "name", dir: "asc" });
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [list, cur] = await Promise.all([getAllStudents(), getCurriculum()]);
        setStudents(list);
        setCurriculum(cur);
      } catch {
        toast.error("Could not load data. Is the backend running?");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Student counts per year, per semester and per subject
  const counts = useMemo(() => {
    const year = {};
    const sem = {};
    const subj = {};
    students.forEach((s) => {
      year[s.year] = (year[s.year] || 0) + 1;
      const k = `${s.year}-${s.semester}`;
      sem[k] = (sem[k] || 0) + 1;
      (s.subjects ?? []).forEach((sub) => {
        const k2 = `${k}-${sub}`;
        subj[k2] = (subj[k2] || 0) + 1;
      });
    });
    return { year, sem, subj };
  }, [students]);

  const subjectOptions =
    yearF !== "all" && semF !== "all" ? curriculum?.[yearF]?.[semF] ?? [] : [];

  const sorted = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = students.filter((s) => {
      if (yearF !== "all" && String(s.year) !== yearF) return false;
      if (semF !== "all" && String(s.semester) !== semF) return false;
      if (subjectF !== "all" && !(s.subjects ?? []).includes(subjectF)) return false;
      return (
        !q ||
        [s.name, s.email, (s.subjects ?? []).join(" "), String(s.rollNo)]
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    });
    const dir = sort.dir === "asc" ? 1 : -1;
    return filtered.sort((a, b) => {
      const x = a[sort.key];
      const y = b[sort.key];
      if (typeof x === "number") return (x - y) * dir;
      return String(x).localeCompare(String(y)) * dir;
    });
  }, [students, search, yearF, semF, subjectF, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const hasFilters = yearF !== "all" || semF !== "all" || subjectF !== "all" || search;

  const changeYear = (v) => {
    setYearF(v);
    setSemF("all");
    setSubjectF("all");
    setPage(1);
  };
  const changeSem = (v) => {
    setSemF(v);
    setSubjectF("all");
    setPage(1);
  };
  const clearFilters = () => {
    setSearch("");
    changeYear("all");
  };

  const pickSubject = (sem, subject) => {
    if (semF === String(sem) && subjectF === subject) {
      setSubjectF("all");
    } else {
      setSemF(String(sem));
      setSubjectF(subject);
    }
    setPage(1);
  };

  const handleSort = (key) =>
    setSort((s) =>
      s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }
    );

  const handleSave = async (data) => {
    try {
      if (editing) {
        const updated = await updateStudent(editing.id, data);
        setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
        toast.success("Student updated");
      } else {
        const created = await createStudent(data);
        setStudents((prev) => [...prev, created]);
        toast.success("Student added");
      }
      setFormOpen(false);
      setEditing(null);
      return { ok: true };
    } catch (err) {
      const status = err.response?.status;
      const errors = err.response?.data?.errors;
      if ((status === 400 || status === 409) && errors) {
        toast.error(err.response.data.message || "Please fix the highlighted fields");
        return { ok: false, errors };
      }
      toast.error(status ? `Server error ${status}` : "Cannot reach the server");
      return { ok: false };
    }
  };

  const handleDelete = async () => {
    try {
      await deleteStudent(toDelete.id);
      setStudents((prev) => prev.filter((s) => s.id !== toDelete.id));
      toast.success("Student deleted");
    } catch {
      toast.error("Could not delete the student");
    } finally {
      setToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Students</h1>
            <p className="text-sm text-slate-500">
              {students.length} {students.length === 1 ? "student" : "students"} enrolled across 4 years
            </p>
          </div>
          <button
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
            disabled={!curriculum}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700 disabled:opacity-50"
          >
            <Plus size={18} /> Add student
          </button>
        </div>

        {/* One card per year, with the semester split */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {YEARS.map((y) => (
            <YearCard
              key={y}
              year={y}
              total={counts.year[y] || 0}
              sem1={counts.sem[`${y}-1`] || 0}
              sem2={counts.sem[`${y}-2`] || 0}
              active={yearF === String(y)}
              onClick={() => changeYear(yearF === String(y) ? "all" : String(y))}
            />
          ))}
        </div>

        {/* Students enrolled per subject for the selected year (and semester) */}
        {yearF !== "all" && curriculum && (
          <SubjectBreakdown
            year={Number(yearF)}
            semesters={semF === "all" ? SEMESTERS : [Number(semF)]}
            curriculum={curriculum}
            counts={counts}
            activeSem={semF}
            activeSubject={subjectF}
            onPick={pickSubject}
          />
        )}
        {yearF === "all" && (
          <p className="mb-6 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-3 text-center text-sm text-slate-500">
            Click a year card or pick a year below to see how many students are enrolled in each subject.
          </p>
        )}

        {/* Filters */}
        <div className="mb-4 flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name, email, subject or roll no..."
              className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </div>
          <select value={yearF} onChange={(e) => changeYear(e.target.value)} className={selectClass}>
            <option value="all">All years</option>
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {yearLabel(y)}
              </option>
            ))}
          </select>
          <select
            value={semF}
            onChange={(e) => changeSem(e.target.value)}
            disabled={yearF === "all"}
            className={selectClass}
          >
            <option value="all">All semesters</option>
            {SEMESTERS.map((s) => (
              <option key={s} value={s}>
                {semLabel(s)}
              </option>
            ))}
          </select>
          <select
            value={subjectF}
            onChange={(e) => {
              setSubjectF(e.target.value);
              setPage(1);
            }}
            disabled={semF === "all"}
            className={selectClass}
          >
            <option value="all">All subjects</option>
            {subjectOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-200"
            >
              <X size={16} /> Clear
            </button>
          )}
        </div>

        <StudentTable
          students={pageItems}
          loading={loading}
          sort={sort}
          onSort={handleSort}
          onEdit={(s) => {
            setEditing(s);
            setFormOpen(true);
          }}
          onDelete={setToDelete}
        />

        {!loading && sorted.length > 0 && (
          <Pagination
            page={safePage}
            totalPages={totalPages}
            total={sorted.length}
            pageSize={PAGE_SIZE}
            onChange={setPage}
          />
        )}
      </main>

      {formOpen && (
        <StudentFormModal
          student={editing}
          curriculum={curriculum}
          onClose={() => {
            setFormOpen(false);
            setEditing(null);
          }}
          onSave={handleSave}
        />
      )}

      {toDelete && (
        <ConfirmDialog
          title="Delete student"
          message={`Are you sure you want to delete ${toDelete.name}? This cannot be undone.`}
          onCancel={() => setToDelete(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}