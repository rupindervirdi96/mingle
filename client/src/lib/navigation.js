// Lets non-React code (socket handlers, desktop notifications) navigate the SPA.
let navigateFn = (path) => window.location.assign(path);

export const setNavigate = (fn) => {
  navigateFn = fn;
};

export const navigate = (path) => navigateFn(path);
