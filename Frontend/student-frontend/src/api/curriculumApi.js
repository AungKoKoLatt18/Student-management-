import http from "./http";

export const getCurriculum = () => http.get("/curriculum").then((r) => r.data);