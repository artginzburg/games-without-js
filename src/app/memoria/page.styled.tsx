import { styled } from '@linaria/react';

import { css } from '@/utils/fakeCssFunction';
import { easings } from '@/tools/easings';
import { getRandomOfAnySign } from '@/tools/getRandomOfAnySign';
import { mobileSafeHoverEffect } from '@/utils/mobileSafeHoverEffect';
import { media } from '@/utils/media-queries';

import { texts } from './data/texts';

const cardBorderRadiusRem = 0.5;
const cardsContainerPaddingRem = 1.25;

/** To force the height, for light theme body background to be full-page */
export const PageWrapper = styled.div`
  min-height: 100svh; // min-height instead of height so that bottom margins on the page work. BUG: this makes content scroll when WinModal is open.
`;

export const GameHeading = styled.h1<{ 'data-animate': boolean }>`
  margin-bottom: 2rem;
  margin-inline: ${cardsContainerPaddingRem + cardBorderRadiusRem / 4}rem;

  font-weight: 100;

  display: flex;
  justify-content: space-between;

  &[data-animate='true'] {
    > span {
      animation: heading-char-appear 1s forwards;

      ${[...Array(texts.title.length)]
        .map(
          (val, index) => `
            &:nth-child(${index + 1}) {
              animation-delay: ${0.1 * index + 0.1}s;
            }
          `,
        )
        .join('\n')}

      transform: rotateZ(-360deg);
      @keyframes heading-char-appear {
        to {
          transform: none;
        }
      }
    }
  }
`;

export const GameContainer = styled.main`
  max-width: 400px;
  margin-inline: auto;

  padding-top: 2.7rem;
`;

export const GameTopButtonsContainer = styled.section`
  display: flex;
  justify-content: space-between;
  padding-inline: ${cardsContainerPaddingRem + cardBorderRadiusRem / 2}rem;

  font-size: 1.2rem;
`;
const gapBetweenSmallRelatedElementsRem = 0.4;
export const MovesStatContainer = styled.div<{ 'data-animate': boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;

  column-gap: ${gapBetweenSmallRelatedElementsRem}rem;

  &[aria-disabled='true'] {
    opacity: 0.6;
  }

  > svg {
    transform: rotateZ(-90deg);
  }

  > div {
    position: relative;

    > p:last-child {
      position: absolute;
      top: 0;
      left: 0;
      transform: scaleY(0);
    }
  }
  &[data-animate='true'] > div {
    > p:first-child {
      animation: disappear 0.3s forwards;
      transform-origin: top;
      @keyframes disappear {
        to {
          transform: scaleY(0);
        }
      }
    }

    > p:last-child {
      animation: appear 0.3s forwards;
      transform-origin: bottom;
      @keyframes appear {
        to {
          transform: none;
        }
      }
    }
  }
`;
const restartButtonPaddingForFingersPx = 30;
const percentsInSecond = 100 / 60;
export const ClockStatContainer = styled.div<{
  skipMs: number;
  'data-animate': boolean;
  /** Used for the classic dirty technique to reset an animation (creating two copies of the same animation and alternating between them based on a state) */
  animationTrigger: boolean;
  /** The `__linaria.className` is supposed to be passed here, because linaria also modifies animation names, and this component needs a conditional animation name. */
  animationTriggerNamePostfix: string;
}>`
  margin-left: ${restartButtonPaddingForFingersPx / 2}px;
  &::before {
    content: '0:';
  }
  &::after {
    content: '00';
  }
  &[data-animate='false'] {
    opacity: 0.6;
  }
  &[data-animate='true'] {
    &::before {
      /* I have no idea why the minute clock is 30 seconds early */
      /* TODO: Is the above comment true anymore? Test later. */
      animation: ${({ animationTrigger, animationTriggerNamePostfix }) =>
          `minutes-${animationTrigger}-${animationTriggerNamePostfix}`}
        ${60 * 60}s forwards step-end;
      animation-delay: ${({ skipMs }) => `-${skipMs}ms`};

      ${['true', 'false']
        .map(
          (val) => `@keyframes minutes-${val} {
        ${[...Array(60)]
          .map((val, index) => {
            const keyframe = percentsInSecond * index;

            return `
              ${keyframe}% {
                content: '${index}:';
              }
            `;
          })
          .join('\n')}
        100% {
          content: '♾️:';
        }
      }`,
        )
        .join('\n')}
    }
    &::after {
      animation: ${({ animationTrigger, animationTriggerNamePostfix }) =>
          `seconds-${animationTrigger}-${animationTriggerNamePostfix}`}
        60s infinite step-end;
      animation-delay: ${({ skipMs }) => `-${skipMs}ms`};

      ${['true', 'false']
        .map(
          (val) => `
            @keyframes seconds-${val} {
              ${[...Array(60)]
                .map((val, index) => {
                  const keyframe = percentsInSecond * index;
                  const content = index < 10 ? `0${index}` : index;

                  return `
                    ${keyframe}% {
                      content: '${content}';
                    }
                  `;
                })
                .join('\n')}
              100% {
                content: '00';
              }
            }
          `,
        )
        .join('\n')}
    }
  }
`;
export const RestartButtonContainer = styled.div`
  &[aria-disabled='true'] {
    pointer-events: none;
    opacity: 0.6;

    &:active {
      cursor: not-allowed;
    }
  }

  > a {
    padding-left: ${restartButtonPaddingForFingersPx}px;
  }

  svg {
    transition: transform 0.3s;
  }
  &:hover {
    svg {
      transform: rotateZ(90deg);
    }
  }
`;

export const GameBottomButtonsContainer = styled.section`
  display: flex;
  align-items: center;

  margin-top: ${cardsContainerPaddingRem}rem;
  margin-inline: ${cardsContainerPaddingRem + cardBorderRadiusRem / 2}rem;
  column-gap: 1rem;

  > p {
    display: flex;
    align-items: center;
    column-gap: ${gapBetweenSmallRelatedElementsRem}rem;
  }

  color: #222;
  @media (prefers-color-scheme: dark) {
    color: #eee;
  }
`;
export const GameBoardSizeButtonsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;

  column-gap: ${gapBetweenSmallRelatedElementsRem}rem;

  &[aria-disabled='true'] {
    pointer-events: none;
    opacity: 0.6;
  }
`;
export const GameBoardSizeButtonContainer = styled.div`
  border-radius: 9999px;
  width: 25px;
  height: 25px;
  background-color: #ddd;
  color: #222;

  display: flex;
  justify-content: center;
  align-items: stretch;

  font-size: 0;

  &:hover {
    opacity: 0.8;
  }

  &[aria-disabled='true'] {
    pointer-events: none;
    opacity: 0.6;
  }

  > a {
    text-align: center;

    border-radius: 9999px;

    width: 100%;
    height: 100%;

    font-size: 1.3rem;
    line-height: 1.2;
  }
`;

export const CardsContainer = styled.section<{
  boardSize: number;
  'data-animate': boolean;
  'data-animate-win': boolean;
}>`
  display: grid;
  grid-template-columns: repeat(${({ boardSize }) => boardSize}, 1fr);
  gap: calc(4rem / ${({ boardSize }) => boardSize});

  padding-inline: ${cardsContainerPaddingRem}rem;
  padding-block: ${cardsContainerPaddingRem / 3}rem;

  &[data-animate='true'] > div {
    ${[...Array(4 ** 2)]
      .map((val, index) => {
        const maxRandomOffset = 300;
        const y = getRandomOfAnySign(maxRandomOffset);
        const rotation = getRandomOfAnySign(90 * 2);

        return `
          &:nth-child(${index + 1}) {
            animation-delay: ${0.06 * index + index * (index * 0.001) + 0.1}s;
            --x: ${maxRandomOffset}px;
            --y: ${y}px;
            --rotation: ${rotation}deg;
            opacity: 0;
          }
        `;
      })
      .join('\n')}

    animation: card-appear-on-start 0.3s forwards;
    @keyframes card-appear-on-start {
      from {
        transform: translate(var(--x), var(--y)) rotateZ(var(--rotation));
      }
      to {
        transform: none; // BUG: this causes &:hover transform to not work.
        opacity: initial;
      }
    }
  }

  &[data-animate-win='true'] > div {
    ${[...Array(4 ** 2)]
      .map((val, index) => {
        const rowsCount = 4;
        const i = index + 1;

        const row = Math.ceil(i / rowsCount);
        // const rowIsOdd = row % 2 === 1;

        const delayMultiplier = 0.1;

        const animationOneElementDelay = 1 * delayMultiplier;
        const columnBasedDelay = animationOneElementDelay * Math.abs(i - (row - 1) * rowsCount);

        const orderBasedDelay = index * (5 / 4 ** 2) * delayMultiplier;

        return `
          &:nth-child(${i}) {
            animation-delay: ${columnBasedDelay + orderBasedDelay}s;
          }
        `;
      })
      .join('\n')}

    animation: card-spin-on-win 4s forwards;
    @keyframes card-spin-on-win {
      10% {
        filter: none;
      }
      50% {
        transform: scale(1.5);
        filter: blur(100px);
        opacity: 1;
      }
      90% {
        opacity: 0;
      }
      to {
        opacity: 0.3;
      }
    }
  }
`;

export const CardContainer = styled.div<{
  'data-rotated': boolean;
  'data-just-matched'?: boolean;
  'data-just-mismatched'?: boolean;
}>`
  user-select: none;
  cursor: default;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;

  aspect-ratio: 1;
  background-color: #fffc;
  @media (prefers-color-scheme: dark) {
    background-color: #fff3;
  }
  border-radius: ${cardBorderRadiusRem}rem;

  transition:
    background-color 0.25s,
    transform 0.25s ${easings.easeOutBack},
    box-shadow 0.25s;

  &[data-rotated='false'] {
    ${mobileSafeHoverEffect(css`
      transform: scale(1.1);
    `)}
  }

  &[data-rotated='true'] {
    background-color: #222;
    @media (prefers-color-scheme: dark) {
      background-color: #ddd;
    }
  }
  &[data-just-matched='true'] {
    background-color: #44be2c;
    @media (prefers-color-scheme: dark) {
      background-color: green;
    }
  }
  &[data-just-mismatched='true'] {
    background-color: #d4003c;
  }

  &[aria-selected='true'] {
    /* "Pending" style */
    --box-shadow-color: #00dfdf;
    @media (prefers-color-scheme: dark) {
      --box-shadow-color: teal;
    }
    box-shadow: 0 0 4rem 0.5rem var(--box-shadow-color);
    z-index: 1; /* So that box-shadow overlays all the other cards, not just the preceding ones */
  }

  position: relative;

  > a {
    display: block;
    width: 100%;
    height: 100%;

    border-radius: inherit;
  }

  &[data-just-matched='true'],
  &[data-just-mismatched='true'] {
    border: 2px solid #222;
    @media (prefers-color-scheme: dark) {
      border-color: #ddd;
    }

    > div {
      animation: appear 0.25s forwards ${easings.easeOutBack};

      transform: scale(0);
      @keyframes appear {
        to {
          transform: scale(1);
        }
      }
    }
  }

  > div {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;

    pointer-events: none;

    font-size: min(10vw, 2.5rem);
  }
`;

export const DevOnlyMenuLi = styled.li`
  &[aria-disabled='true'] {
    opacity: 0.6;

    &:active {
      cursor: not-allowed;
    }

    > a {
      pointer-events: none;
    }
  }
`;

const winModalWidthPx = 280; // 230 initially. Set to 280 to exactly cover half of the outermost column of cards in 4x4 size.
const playButtonCharactersQuantity = 4;
const pxInRem = 16;
const playButtonHoveredLetterSpacingPx =
  (winModalWidthPx / playButtonCharactersQuantity - pxInRem * cardsContainerPaddingRem) / 1.5;

export const ModalContainer = styled.div<{ 'data-visible': boolean }>`
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: ${cardsContainerPaddingRem}rem;

  pointer-events: none;
  opacity: 0;
  transition:
    opacity 0.3s,
    backdrop-filter 1s;
  &[data-visible='true'] {
    pointer-events: initial;
    opacity: 1;
    backdrop-filter: blur(7px);

    > section {
      transform: scale(1);
    }
  }

  > section {
    display: flex;
    flex-direction: column;

    width: ${winModalWidthPx}px;
    max-width: 100%;
    max-height: 400px;
    overflow-y: auto;
    margin-inline: ${cardsContainerPaddingRem}rem;
    background: linear-gradient(#fff, #ddd);
    color: #222;
    border-radius: ${cardBorderRadiusRem * 2}rem;

    transition: transform 0.3s ${easings.easeOutBack};
    transform: scale(0);

    &:first-child {
      padding: ${cardsContainerPaddingRem}rem;
      > a {
        font-size: 2rem;
        border-radius: ${cardBorderRadiusRem}rem;

        margin-left: auto;
        margin-top: 1rem;

        transition: letter-spacing 0.7s;
        &:hover {
          letter-spacing: ${playButtonHoveredLetterSpacingPx}px;
        }
      }
    }

    &:nth-child(2) {
      transition-delay: 0.3s;

      background: linear-gradient(#000, #151617);
      border-radius: 9999px;
      border-top: 1px solid hsla(0, 0%, 100%, 0.15);
      color: #ddd;

      flex-direction: row;
      align-items: center;
      column-gap: ${gapBetweenSmallRelatedElementsRem * 2}rem;

      padding-block: 0.15rem;
      padding-right: 0.2rem;
      padding-left: ${cardsContainerPaddingRem}rem;

      > p {
        flex: 1 0 auto;
      }
      > a {
        font-size: 0; // remove phantom offset

        border-radius: 9999px;
        border: 2px solid #ddd;
        padding: 0.6rem;

        transition-property: background-color, color, border-color, transform;
        transition-duration: 0.2s;
        ${mobileSafeHoverEffect(css`
          background-color: #fff;
          color: #000;
          border-color: #fff;
          transform: scale(0.9);
        `)}

        > svg {
          font-size: 1.5rem;
        }
      }
    }
  }
`;

/** @todo make it available on mobiles when WinModal is opened */
export const BackLinkContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  ${media.mobileStyle} {
    position: initial;
    top: initial;
    left: initial;
    z-index: initial;
  }

  margin-block: ${cardsContainerPaddingRem * 2}rem;
  margin-inline: ${cardsContainerPaddingRem}rem;

  max-width: max-content;

  font-size: 1rem;
  font-weight: 300;
  letter-spacing: 1px;

  border: 1px solid #aaa;
  border-radius: 9999px;

  > a {
    display: flex;
    column-gap: ${gapBetweenSmallRelatedElementsRem * 3}rem;
    align-items: center;
    line-height: 1;
    color: #ddd;
    padding-block: 0.3rem;
    padding-inline: 0.5rem;

    background-color: #ddd;
    color: #222;
    border-radius: inherit;

    ${mobileSafeHoverEffect(css`
      opacity: 0.7;
    `)}
  }
`;
