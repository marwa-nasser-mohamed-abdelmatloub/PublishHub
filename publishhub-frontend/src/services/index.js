import api from "./api";

export const apiService = api;

export const authService = {
  register: (data) => api.post("/auth/register", data),
  login: (email, password) => api.post("/auth/login", { email, password }),
  logout: () => api.post("/auth/logout"),
  me: () => api.get("/auth/me"),
  updateProfile: (data) => api.put("/auth/profile", data),
  changePassword: (data) => api.post("/auth/change-password", data),
};

export const articleService = {
  getAll: (page = 1) => api.get("/articles", { params: { page } }),
  getById: (id) => api.get(`/articles/${id}`),
  create: (data) => api.post("/articles", data),
  update: (id, data) => api.patch(`/articles/${id}`, data),
  delete: (id) => api.delete(`/articles/${id}`),
  submit: (id) => api.post(`/articles/${id}/submit`),
  approve: (id) => api.post(`/articles/${id}/approve`),
  reject: (id) => api.post(`/articles/${id}/reject`),
  assignReviewer: (id, reviewerId) =>
    api.post(`/articles/${id}/assign-reviewer`, { reviewer_id: reviewerId }),
  getPendingApproval: (page = 1) =>
    api.get("/articles/pending-approval", { params: { page } }),
};

export const versionService = {
  getVersions: (articleId, page = 1) =>
    api.get(`/articles/${articleId}/versions`, { params: { page } }),
  getVersion: (articleId, versionId) =>
    api.get(`/articles/${articleId}/versions/${versionId}`),
  compareVersions: (articleId, version1, version2) =>
    api.post(`/articles/${articleId}/compare-versions`, { version1, version2 }),
};

export const commentService = {
  getComments: (articleId, page = 1) =>
    api.get(`/articles/${articleId}/comments`, { params: { page } }),
  createComment: (articleId, data) =>
    api.post(`/articles/${articleId}/comments`, data),
  updateComment: (articleId, commentId, data) =>
    api.patch(`/articles/${articleId}/comments/${commentId}`, data),
  deleteComment: (articleId, commentId) =>
    api.delete(`/articles/${articleId}/comments/${commentId}`),
};

export const reviewService = {
  getAssignments: (page = 1) =>
    api.get("/reviews/assignments", { params: { page } }),
  myAssignments: (page = 1) =>
    api.get("/reviews/my-assignments", { params: { page } }),
  submitReview: (articleId, data) =>
    api.post(`/articles/${articleId}/workflow/submit-review`, data),
  submitReviewDecision: (assignmentId, data) =>
    api.post(`/reviews/${assignmentId}/decision`, data),
};

export const revisionService = {
  getAll: (page = 1) => api.get("/revisions", { params: { page } }),
  getById: (id) => api.get(`/revisions/${id}`),
  create: (data) => api.post("/revisions", data),
  approve: (id) => api.post(`/revisions/${id}/approve`),
  reject: (id) => api.post(`/revisions/${id}/reject`),
  getMyRequests: (page = 1) =>
    api.get("/revisions/my-requests", { params: { page } }),
  complete: (id) => api.post(`/revisions/${id}/complete`),
};

export const changeService = {
  getChanges: (articleId, status = "all") =>
    api.get(`/articles/${articleId}/changes`, { params: { status } }),
  trackChanges: (articleId, data) =>
    api.post(`/articles/${articleId}/changes`, data),
  approveChange: (articleId, changeId) =>
    api.post(`/articles/${articleId}/changes/${changeId}/approve`),
  rejectChange: (articleId, changeId) =>
    api.post(`/articles/${articleId}/changes/${changeId}/reject`),
  approveAll: (articleId) =>
    api.post(`/articles/${articleId}/changes/approve-all`),
  rejectAll: (articleId) =>
    api.post(`/articles/${articleId}/changes/reject-all`),
};

export const userService = {
  getAll: (page = 1) => api.get("/users", { params: { page } }),
  getById: (id) => api.get(`/users/${id}`),
  getByRole: (role, page = 1) =>
    api.get("/users/by-role", { params: { role, page } }),
  create: (data) => api.post("/users", data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};
