export const setSessionType = (partial) => {
  if (partial === false || partial === undefined) {
    localStorage.setItem("Partial", 0)
    return 0;
  }
  if (partial === true) {
    localStorage.setItem("Partial", 1)
    return 1;
  }
}

export const getSessionType = () => {
  const partial = localStorage.getItem("Partial")
  return partial === 1;
}