import type { CSSProperties } from '@linaria/core';

export const reset = {
  a: {
    color: 'inherit',
    textDecoration: 'none',
  } as React.CSSProperties,
  ul: {
    margin: 0,
    padding: 0,
    listStyle: 'none',
  } as React.CSSProperties,
  button: {
    appearance: 'none',
    background: 'transparent',
    color: 'inherit',
    border: 'none',
    margin: 0,
    padding: 0,
    fontFamily: 'inherit',
  } as React.CSSProperties,
  textarea: {
    appearance: 'none',
    border: 0,
    margin: 0,
    padding: 0,
    outline: 'none',
    fontFamily: 'inherit',
  } as React.CSSProperties,
} as Record<'a' | 'ul' | 'button' | 'textarea', CSSProperties>;

export const resetExtra = {
  buttonAsIcon: {
    fontSize: 0,
  },
};
