export const stringAvatar = (nameAvatar?: string | null) => {
  if (!nameAvatar) return;
    return {
      children: `${nameAvatar?.split(' ')[0][0]}`,
    }
};
