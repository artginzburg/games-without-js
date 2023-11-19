import { styled } from '@linaria/react';

import { easings } from '@/tools/easings';

const cssHideElement = {
  progress: {
    visibility: 'hidden',
    height: '0',
    width: '0',
  },
};

const colorScheme = {
  holeColorAkaBackground: 'rgb(var(--background-end-rgb))',
  progressBackgroundColor: '#ddd',
  progressForegroundColor: '#222',
};

const size = 25;

const circleBarConfig = {
  experimental: {
    /** Settings this to `false` does not cancel all the properties related to the animation, but switches the functional part to the non-animated version */
    animate: true,
  },
};

/** @default 20 */
const progressLineSizePercents = 25;
const holeSizePercents = 100 - progressLineSizePercents;

export const CircleProgressBarContainer = styled.div<{
  value: number;
  previousValue: number;
  'data-animate': boolean;
}>`
  /* #region experimental animation */
  @property --progress-value {
    syntax: '<integer>';
    inherits: false;
    initial-value: 0;
  }
  @keyframes progress {
    from {
      --progress-value: ${({ previousValue }) => Math.round(previousValue)};
    }
    to {
      --progress-value: ${({ value }) => Math.round(value)};
    }
  }
  &[data-animate='false'] {
    --progress-value: ${({ value }) => Math.round(value)};
  }
  &[data-animate='true'] {
    animation: progress 2s 1 forwards ${easings.easeOutBack};
  }
  /* #endregion experimental animation */

  --progress-background-color: ${colorScheme.progressBackgroundColor};
  --progress-foreground-color: ${colorScheme.progressForegroundColor};
  @media (prefers-color-scheme: dark) {
    --progress-background-color: ${colorScheme.progressForegroundColor};
    --progress-foreground-color: ${colorScheme.progressBackgroundColor};
  }

  margin-left: auto;
  width: ${size}px;
  height: ${size}px;
  border-radius: 50%;
  background: radial-gradient(
      closest-side,
      ${colorScheme.holeColorAkaBackground} ${holeSizePercents - 1}%,
      transparent ${holeSizePercents}% 100%
    ),
    conic-gradient(
      var(--progress-foreground-color)
        ${({ value }) =>
          circleBarConfig.experimental.animate ? `calc(var(--progress-value) * 1%)` : `${value}%`},
      var(--progress-background-color) 0
    );

  > progress {
    ${cssHideElement.progress}
  }
`;
