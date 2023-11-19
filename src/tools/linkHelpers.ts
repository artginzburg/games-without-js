export const newTab = {
  target: '_blank',
  rel: 'noreferrer',
} as const;

export const linkBuilders = {
  mailto<T extends string>(email: T) {
    return {
      href: `mailto:${email}`,
      children: email,
    } as const;
  },
  tel<T extends string>(phone: T) {
    return {
      href: `tel:${phone}`,
      children: phone,
    } as const;
  },
};
