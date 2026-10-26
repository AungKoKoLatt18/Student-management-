import http from "./http";

export const getAllStudents = () => http.get("/students/getAll").then((r) => r.data);
export const createStudent = (data) => http.post("/students/create", data).then((r) => r.data);
export const updateStudent = (id, data) => http.put(`/students/update/${id}`, data).then((r) => r.data);
export const deleteStudent = (id) => http.delete(`/students/delete/${id}`);