export function validateStudent(form, curriculum) {
  const e = {};
  const name = String(form.name ?? "").trim();
  const email = String(form.email ?? "").trim();
  const age = String(form.age ?? "").trim();
  const rollNo = String(form.rollNo ?? "").trim();
  const year = String(form.year ?? "");
  const semester = String(form.semester ?? "");
  const subjects = form.subjects ?? [];

  if (!name) e.name = "Name is required";
  else if (name.length < 2) e.name = "Name must be at least 2 characters";
  else if (name.length > 100) e.name = "Name is too long";
  else if (!/^[\p{L}\s.'-]+$/u.test(name)) e.name = "Use letters, spaces, . ' - only";

  if (!email) e.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) e.email = "Enter a valid email address";

  if (!age) e.age = "Age is required";
  else if (!Number.isInteger(Number(age))) e.age = "Age must be a whole number";
  else if (Number(age) < 5 || Number(age) > 100) e.age = "Age must be between 5 and 100";

  if (!rollNo) e.rollNo = "Roll number is required";
  else if (!Number.isInteger(Number(rollNo)) || Number(rollNo) < 1)
    e.rollNo = "Enter a positive whole number";

  if (!year) e.year = "Select a year";
  if (!semester) e.semester = "Select a semester";

  if (subjects.length === 0) e.subjects = "Select at least one subject";
  else if (year && semester) {
    const offered = curriculum?.[year]?.[semester] ?? [];
    if (!subjects.every((s) => offered.includes(s)))
      e.subjects = "Subjects must all belong to the selected semester";
  }

  return e;
}