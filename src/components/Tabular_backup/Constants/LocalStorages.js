// set Local Storages
export const setAnomalyPercentage = (percentage) => {
  localStorage.setItem("AnomalyPct", percentage);
};

// get Local Storages

export const getProjectId = () => {
  return localStorage.getItem("projectId") || "";
};


export const getAnomalyPercentage = () => {
  return localStorage.getItem("AnomalyPct") || "";
};

export const getProjectDescription = () => {
  return localStorage.getItem("projectDescription") || "";
};