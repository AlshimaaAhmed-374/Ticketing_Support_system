const priorityOrder = {
  high: 3,
  medium: 2,
  low: 1
};

const sortByPriorityThenNewest = (a, b) => {
  const pA = priorityOrder[a.priority] || 0;
  const pB = priorityOrder[b.priority] || 0;
  if (pA !== pB) return pB - pA;
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
};

module.exports = { sortByPriorityThenNewest };
