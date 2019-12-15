export const getInStateBuilder = (state = {}) => (path, defaultValue) => {
  const parsedPath = path
    .replace(/\[/g, '.')
    .replace(/]/g, '')
    .split('.')
    .filter(Boolean);
  let current = { ...state };
  const isValidPath = parsedPath.every((step) => {
    const stepIsValid = current[step] !== undefined;
    if (stepIsValid) {
      current = current[step];
    }
    return stepIsValid;
  });
  return isValidPath ? current : defaultValue;
};
