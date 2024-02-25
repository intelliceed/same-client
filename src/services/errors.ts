
const getErrorMessage = (error:unknown) => {
  const message = (error as {message?: unknown})?.message;
  if (!message || typeof message !== 'string') { return 'Something went wrong...'; }
  return message || 'Something went wrong...';
};

export default getErrorMessage;
