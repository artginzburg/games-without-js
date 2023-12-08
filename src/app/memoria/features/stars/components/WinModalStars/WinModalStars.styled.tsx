import { styled } from '@linaria/react';

import { easings } from '@/tools/easings';

import { starsConfig } from '../../config';

export const WinModalStarsContainer = styled.p`
  margin-block: 0.5rem;
  text-align: center;
  font-size: 0; /* To remove the phantom offset of <span> */
  display: flex;
  justify-content: space-evenly;

  > span {
    > svg {
      display: inline-block;
      font-size: 2rem;
      animation: star-pop-filled 0.9s ${easings.easeOutBack} backwards;
      animation-delay: inherit;
      filter: drop-shadow(0 -0.6rem 0.6rem white);

      @keyframes star-pop-filled {
        from {
          transform: scale(0);
          opacity: 0;
        }
        80% {
          transform: scale(1.25) translateY(-50%);
        }
      }
    }

    &[data-filled='false'] > svg {
      animation-name: star-pop-outlined;
      animation-delay: inherit;
      animation-duration: 0.9s;
      @keyframes star-pop-outlined {
        from {
          opacity: 0;
        }
        80% {
          transform: scale(0.75);
        }
      }
    }

    ${[...Array(starsConfig.maxStars)]
      .map((_val, starIndex) => {
        return `
          &:nth-child(${starIndex + 1}) {
            animation-delay: ${0.3 + 0.5 * starIndex}s;
          }
        `;
      })
      .join('\n')}
  }
`;
