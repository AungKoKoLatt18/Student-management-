export const YEARS = [1, 2, 3, 4];
export const SEMESTERS = [1, 2];

const ordinals = { 1: "1st", 2: "2nd", 3: "3rd", 4: "4th" };
export const yearLabel = (y) => `${ordinals[y]} Year`;
export const semLabel = (s) => `Semester ${s}`;