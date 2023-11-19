import { media } from './media-queries';

export function mobileSafeHoverEffect(effect: string | React.CSSProperties) {
  return `
    ${media.hoverNonTouch} {
      &:hover,
      &:focus {
        ${effect}
      }
    }
    &:active {
      ${effect}
    }
  `;
}
