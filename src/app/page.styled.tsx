import { styled } from '@linaria/react';

import { mobileSafeHoverEffect } from '@/utils/mobileSafeHoverEffect';
import { reset } from '@/utils/reset';
import { css } from '@/utils/fakeCssFunction';

/** A wrapper to force the `footer` to the bottom */
export const PageWrapper = styled.div`
  height: 100svh;
  display: flex;
  flex-direction: column;
`;

export const MainContainer = styled.main`
  margin-inline: auto;
  width: 800px;
  max-width: 100%;

  padding: 20px;

  flex: 1 0 auto; /*  to force the footer to the bottom */
`;

export const Heading1 = styled.h1`
  --text-gradient: linear-gradient(180deg, #555, #000);
  @media (prefers-color-scheme: dark) {
    --text-gradient: linear-gradient(180deg, #fff, #adadad);
  }

  background: var(--text-gradient);
  background-clip: text;
  -webkit-text-fill-color: transparent;

  text-align: center;
  font-weight: 800;
  font-size: max(48px, min(5vw, 76px));
  line-height: 1;
`;

export const Subtitle = styled.p`
  text-align: center;
  font-size: max(15px, min(2vw, 20px));
  color: rgb(136, 136, 136);
  @media (prefers-color-scheme: dark) {
    color: rgb(102, 102, 102);
  }

  margin-top: 20px;

  > span {
    color: rgb(var(--foreground-rgb));
  }
`;

export const SmallSubtitle = styled(Subtitle)`
  opacity: 0.7;
  font-weight: 300;
  font-size: max(11px, min(2vw, 14px));
  margin-top: 10px;
`;

export const GamesList = styled.ul`
  ${reset.ul}

  margin-top: 40px;

  > li > a {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    column-gap: 0.4rem;

    font-size: max(20px, min(3vw, 30px));

    ${mobileSafeHoverEffect(css`
      opacity: 0.7;
    `)}

    > span {
      color: rgb(136, 136, 136);
      @media (prefers-color-scheme: dark) {
        color: rgb(102, 102, 102);
      }
    }
  }
`;

export const FutureGamesSection = styled.section`
  margin-top: 60px;
  text-align: right;
  opacity: 0.3;
`;
export const Heading2 = styled.h2`
  font-weight: 600;
  letter-spacing: 1px;
  font-size: max(24px, min(4vw, 40px));
  line-height: 1;
`;
export const FutureGamesList = styled.ul`
  ${reset.ul}
  margin-top: 20px;

  > li {
    font-size: max(15px, min(2vw, 20px));
    line-height: 1;
    &:not(:first-child) {
      margin-top: 0.4rem;
    }

    &::after {
      content: ' ·';
    }
  }
`;

export const Footer = styled.footer`
  flex-shrink: 0;
  padding: 20px;
  padding-bottom: 20px;
`;
export const FooterLinks = styled(Subtitle)`
  font-size: max(18px, min(2.5vw, 25px));
  > a {
    display: inline-flex;
    align-items: center;
    column-gap: 0.4rem;

    ${mobileSafeHoverEffect(css`
      opacity: 0.7;
    `)}
  }
`;
