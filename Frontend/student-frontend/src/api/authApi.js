import http from "./http";

export const loginRequest = (username, password) =>
  http.post("/auth/login", { username, password }).then((r) => r.data);