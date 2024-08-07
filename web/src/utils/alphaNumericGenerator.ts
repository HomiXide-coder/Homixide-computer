const generateRandomAlphanumericArray = (length: number): string[] => {
  const alphanumericChars: string = "abcdefghijklmnopqrstuvwxyz0123456789";

  return Array.from(
    { length },
    () =>
      alphanumericChars[Math.floor(Math.random() * alphanumericChars.length)]
  );
};

export default generateRandomAlphanumericArray;
