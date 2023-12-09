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
          (_val, index) => `
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
      animation: ${({ animationTrigger, animationTriggerNamePostfix }) =>
          `minutes-${animationTrigger}-${animationTriggerNamePostfix}`}
        ${60 * 60}s forwards step-end;
      animation-delay: ${({ skipMs }) => `-${skipMs}ms`};

      ${['true', 'false']
        .map(
          (val) => `@keyframes minutes-${val} {
        ${[...Array(60)]
          .map((_val, index) => {
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
                .map((_val, index) => {
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
const commonDisabledButtonStyles = css`
  opacity: 0.6;
  &:active {
    cursor: not-allowed;
  }
  > a {
    pointer-events: none;
  }
`;
export const RestartButtonContainer = styled.div`
  user-select: none;

  &[aria-disabled='true'] {
    ${commonDisabledButtonStyles}
  }

  > a {
    padding-left: ${restartButtonPaddingForFingersPx}px;
  }

  svg {
    transition: transform 0.3s;
  }
  &:not([aria-disabled='true']) {
    &:hover {
      svg {
        transform: rotateZ(90deg);
      }
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

  user-select: none;

  &[aria-disabled='true'] {
    > div {
      ${commonDisabledButtonStyles}
    }
  }

  &[aria-disabled='false'] {
    > div {
      transition-property: transform;
      transition-duration: 0.5s;
      &[aria-disabled='false'] {
        &:active {
          transform: scale(0.8);
          transition-duration: 0s;
        }
      }
    }
  }
`;
export const GameBoardSizeButtonContainer = styled.div`
  border-radius: 9999px;
  width: 25px;
  height: 25px;

  background-color: #fffc; /* same as CardContainer */
  @media (prefers-color-scheme: dark) {
    background-color: #fff3; /* same as CardContainer */
  }

  display: flex;
  justify-content: center;
  align-items: stretch;

  font-size: 0;

  &:hover {
    opacity: 0.8;
  }

  &[aria-disabled='true'] {
    ${commonDisabledButtonStyles}
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

const gameBoardSizeButtonsStyleConfig = {
  tooltip: {
    backgroundColor: 'rgb(255, 255, 255, 0.7)',
    backgroundColorDarkScheme: 'rgb(80, 80, 80, 0.7)',
    marginSidePx: 15,
    arrowSizePx: 10,
  },
};
const gameBoardSizeButtonsStyleInternalCalculations = {
  arrowMarginNegative: `${
    gameBoardSizeButtonsStyleConfig.tooltip.arrowSizePx -
    gameBoardSizeButtonsStyleConfig.tooltip.marginSidePx
  }px`,
  tooltipBoxMarginSide: `${gameBoardSizeButtonsStyleConfig.tooltip.marginSidePx}px`,
};
export const GameBoardSizeButtonsContainerWithTooltip = styled(GameBoardSizeButtonsContainer)<{
  'data-text': string | undefined;
}>`
  &[aria-disabled='true'] {
    position: relative;

    &::before {
      content: attr(data-text);
      position: absolute;

      top: 50%;
      transform: translateY(-50%);

      left: 100%;
      margin-left: ${gameBoardSizeButtonsStyleInternalCalculations.tooltipBoxMarginSide};

      /* basic styles */
      box-sizing: border-box;
      width: 217px;
      max-width: 45vw;
      padding-block: 10px;
      padding-inline: 10px;
      border-radius: ${cardBorderRadiusRem}rem;
      background-color: ${gameBoardSizeButtonsStyleConfig.tooltip.backgroundColor};
      @media (prefers-color-scheme: dark) {
        background-color: ${gameBoardSizeButtonsStyleConfig.tooltip.backgroundColorDarkScheme};
      }
      /* color: #000; */
      text-align: center;

      display: none;
    }

    &::after {
      content: '';
      position: absolute;

      top: 50%;
      transform: translateY(-50%);

      left: 100%;
      margin-left: ${gameBoardSizeButtonsStyleInternalCalculations.arrowMarginNegative};

      /* the arrow */
      border: ${gameBoardSizeButtonsStyleConfig.tooltip.arrowSizePx}px solid transparent;
      border-right-color: ${gameBoardSizeButtonsStyleConfig.tooltip.backgroundColor};
      @media (prefers-color-scheme: dark) {
        border-right-color: ${gameBoardSizeButtonsStyleConfig.tooltip.backgroundColorDarkScheme};
      }
      display: none;
    }

    &:hover {
      &::before,
      &::after {
        display: block;
      }
    }
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
      .map((_val, index) => {
        const maxRandomOffset = 300;
        const y = getRandomOfAnySign(maxRandomOffset);
        const rotation = getRandomOfAnySign(90 * 2);

        return `
          &:nth-child(${index + 1}) {
            animation-delay: ${0.06 * index + index * (index * 0.001) + 0.1}s;
            --x: ${maxRandomOffset}px;
            --y: ${y}px;
            --rotation: ${rotation}deg;
          }
        `;
      })
      .join('\n')}

    animation: card-appear-on-start 0.3s backwards;
    @keyframes card-appear-on-start {
      from {
        opacity: 0;
        transform: translate(var(--x), var(--y)) rotateZ(var(--rotation));
      }
    }
  }

  &[data-animate-win='true'] > div {
    ${[...Array(4 ** 2)]
      .map((_val, index) => {
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
    box-shadow 0.25s,
    border-radius 0.25s ${easings.easeOutBack};

  &[data-rotated='false'] {
    ${mobileSafeHoverEffect(`
      transform: scale(1.1);
      border-radius: ${cardBorderRadiusRem * 2}rem;
    `)}
  }

  &[data-rotated='true'] {
    background-color: #222;
    @media (prefers-color-scheme: dark) {
      background-color: #ddd;
    }
  }
  &[data-just-matched='true'] {
    --pulse-color: #000a;
    @media (prefers-color-scheme: dark) {
      --pulse-color: #fffa;
    }

    animation: match 0.5s linear;
    @keyframes match {
      0% {
        transform: scale(1);
        box-shadow: 0 0 0 0 var(--pulse-color);
      }

      70% {
        transform: scale(1.08);
        box-shadow: 0 0 0 15px transparent;

        border-radius: ${cardBorderRadiusRem * 2}rem;
      }

      85% {
        transform: scale(0.95);

        border-radius: ${cardBorderRadiusRem / 2}rem;
      }

      100% {
        transform: scale(1);
        box-shadow: 0 0 0 0 transparent;
      }
    }
  }
  &[data-just-mismatched='true'] {
    background-color: #d4003c;

    animation: wobble 0.5s;
    @keyframes wobble {
      0% {
        transform: translateX(0%);
      }
      15% {
        transform: translateX(-6%) rotateZ(-3deg);
      }
      30% {
        transform: translateX(5%) rotateZ(2deg);
      }
      45% {
        transform: translateX(-3%) rotateZ(-1deg);
      }
      60% {
        transform: translateX(3%) rotateZ(1deg);
      }
      75% {
        transform: translateX(-1%) rotateZ(-0.5deg);
      }
      100% {
        transform: translateX(0%);
      }
    }
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
const pxInRem = 16;

export const ModalContainer = styled.div<{ 'data-visible': boolean }>`
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

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
    margin-inline: ${cardsContainerPaddingRem}rem;

    transition: transform 0.3s ${easings.easeOutBack};
    transform: scale(0);

    &:nth-child(2) {
      transition-delay: 0.3s;

      background: linear-gradient(#000, #151617);
      border-radius: 9999px;
      border-top: 1px solid hsla(0, 0%, 100%, 0.15);
      color: #ddd;

      flex-direction: row;
      align-items: center;
      column-gap: ${gapBetweenSmallRelatedElementsRem * 2}rem;

      margin-top: ${cardsContainerPaddingRem}rem;
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

export const WinModalStatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${cardsContainerPaddingRem}rem;
  padding-bottom: ${33 + (cardsContainerPaddingRem / 2) * pxInRem}px;
  background: linear-gradient(#fff, #ddd);
  color: #222;
  border-radius: ${cardBorderRadiusRem * 2}rem;
`;

export const WinModalPLayButtonAndDropContainer = styled.div`
  position: relative;
  margin-top: -0.5px; /* So that there's no glitchy half-pixel between the section background and this bottom part */
  align-self: center;

  > img {
    transition: transform 0.3s;
    transform-origin: top;
  }
`;
export const WinModalPlayButton = styled.a`
  font-size: 4rem;
  overflow: visible;
  z-index: 1;
  text-align: center;

  display: flex;
  justify-content: center;

  position: absolute;
  align-self: center;
  justify-self: center;
  left: ${33 / 2 + 1.5}px;
  bottom: 5px;

  transition:
    transform 0.3s,
    opacity 0.3s;

  ${mobileSafeHoverEffect(css`
    transform: scale(1.3);
    opacity: 0.9;

    & + img {
      transform: scale(1.3);
    }
  `)}

  &:focus {
    outline: transparent;
  }

  > svg {
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 9999px;
    color: #222;

    transition: transform 0.3s;
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
