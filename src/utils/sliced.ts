export const funSliced = (str: string | undefined, char: number) => {
  if (!str) return;
  const sliced: string = str.slice(0, char);
  if (sliced.length < str.length) {
    return `${sliced}...`;
  }
  return str;
};
