import Image from 'next/image';
import { FaTelegramPlane } from 'react-icons/fa';
import { FaCirclePlay, FaClock, FaFacebookF, FaShoePrints, FaXTwitter } from 'react-icons/fa6';
import Link from 'next/link';

import winModalDropImage from '@/images/memoria_winmodal_drop.svg';
import { declinationOfNum } from '@/tools/declinationOfNum';
import { roundToDecimals } from '@/tools/roundToDecimals';
import { getSharingTwitter } from '@/tools/social-share/sharers/twitter';
import { getSharingTelegram } from '@/tools/social-share/sharers/telegram';
import { getSharingFacebook } from '@/tools/social-share/sharers/facebook';
import { newTab } from '@/tools/linkHelpers';

import { texts } from '../../data/texts';
import {
  ModalContainer,
  WinModalPlayButton,
  WinModalPLayButtonAndDropContainer,
  WinModalStatsContainer,
} from '../../page.styled';
import { WinModalStars } from '../../features/stars/components/WinModalStars/WinModalStars';
import { GameLink } from '../GameLink';

import {
  StatsEssentialsMainText,
  StatsEssentialsSupText,
  WinModalDetailsContainer,
  WinModalStatsEssentialsContainer,
  WinModalStatsMovesContainer,
  WinModalStatsTimeContainer,
} from './WinModal.styled';

export function WinModal({
  hasWon,
  moves,
  startedAt,
  finishedAt,
  cardCount,
  actionResetHref,
  currentMistakes,
}: {
  hasWon: boolean;
  moves: number;
  startedAt: string | undefined;
  finishedAt: string | undefined;
  cardCount: number;
  actionResetHref: `?${string}`;
} & Parameters<typeof WinModalStars>[0]) {
  const secondsPlayed = startedAt ? (Number(finishedAt) - Number(startedAt)) / 1000 : undefined;
  const secondsPlayedString = secondsPlayed
    ? ` and ${roundToDecimals(secondsPlayed, 2)} seconds`
    : '';
  const secondPerCardString = secondsPlayed
    ? `${roundToDecimals(secondsPlayed / cardCount, 2)}s per card`
    : '';

  const minutes = secondsPlayed ? secondsPlayed / 60 : undefined;
  const minutesFloored = Math.floor(minutes ?? 0);

  const secondsRemainder = minutes ? (minutes - minutesFloored) * 60 : undefined;

  const areSecondsPlayedTooSmall = secondsPlayed !== undefined && secondsPlayed < 2;

  const secondsRounded = areSecondsPlayedTooSmall
    ? roundToDecimals(secondsRemainder ?? 0, 1)
    : Math.floor(secondsRemainder ?? 0);

  const secondsDisplayed =
    secondsRounded <= 9 && (!areSecondsPlayedTooSmall || secondsPlayed === 0)
      ? `0${secondsRounded}`
      : secondsRounded;

  return (
    <ModalContainer data-visible={hasWon} aria-hidden={!hasWon}>
      <section role="alertdialog" aria-modal>
        {hasWon && (
          <>
            <WinModalStatsContainer>
              <WinModalStars currentMistakes={currentMistakes} />
              <WinModalDetailsContainer>
                <p>
                  {currentMistakes === 0
                    ? 'No mistakes'
                    : `${currentMistakes} ${declinationOfNum(currentMistakes, [
                        'mistake',
                        'mistakes',
                        'mistakes',
                      ])}`}
                </p>
                <p>{cardCount} cards</p>
              </WinModalDetailsContainer>
              <WinModalStatsEssentialsContainer>
                <WinModalStatsMovesContainer>
                  <StatsEssentialsSupText>
                    {roundToDecimals(moves / cardCount, 1)} per card
                  </StatsEssentialsSupText>
                  <StatsEssentialsMainText>
                    <span>{moves}</span> <FaShoePrints />
                  </StatsEssentialsMainText>
                </WinModalStatsMovesContainer>
                <WinModalStatsTimeContainer>
                  <StatsEssentialsSupText>{secondPerCardString}</StatsEssentialsSupText>
                  <StatsEssentialsMainText>
                    <FaClock />{' '}
                    <span>
                      {minutesFloored}:{secondsDisplayed}
                    </span>
                  </StatsEssentialsMainText>
                </WinModalStatsTimeContainer>
              </WinModalStatsEssentialsContainer>
            </WinModalStatsContainer>
            <WinModalPLayButtonAndDropContainer>
              {/* TODO is passHref necessary here? Seems to work the same with and without it. Removing legacyBehavior yields an error, but removing passHref does not. */}
              <GameLink href={actionResetHref} legacyBehavior passHref>
                <WinModalPlayButton title="Play">
                  <FaCirclePlay />
                </WinModalPlayButton>
              </GameLink>
              <Image src={winModalDropImage} alt="" height={33} />
            </WinModalPLayButtonAndDropContainer>
          </>
        )}
      </section>

      <section role="alertdialog" aria-modal>
        {hasWon && (
          <WinModalSharingSectionContent
            moves={moves}
            cardCount={cardCount}
            secondsPlayedString={secondsPlayedString}
          />
        )}
      </section>
    </ModalContainer>
  );
}

function WinModalSharingSectionContent({
  moves,
  cardCount,
  secondsPlayedString,
}: {
  moves: number;
  cardCount: number;
  secondsPlayedString: string;
}) {
  function getSharingText(withUrl: boolean) {
    return `This ${texts.title} game without JS is surprisingly playable${
      withUrl ? ` — ${sharingUrl}` : ''
    }. Just won in ${moves} ${declinationOfNum(moves, [
      'move',
      'moves',
      'moves',
    ])}${secondsPlayedString} with ${cardCount} cards`;
  }

  const sharingUrl = 'https://games-without-js.ginzburg.art/memoria';
  const sharingText = getSharingText(false);
  // const sharingTitle = 'Games without JS';
  const sharingLinks = {
    facebook: getSharingFacebook({ u: sharingUrl }),
    // linkedIn: getSharingLinkedIn({ url: sharingUrl, title: sharingTitle, summary: sharingText }),
    twitter: getSharingTwitter({ text: sharingText, url: sharingUrl, hashtags: ['game', 'nojs'] }),
    telegram: getSharingTelegram({ text: sharingText, url: sharingUrl }),
  };

  return (
    <>
      <p>Share</p>
      <Link href={sharingLinks.facebook} {...newTab}>
        <FaFacebookF />
      </Link>
      <Link href={sharingLinks.twitter} {...newTab}>
        <FaXTwitter />
      </Link>
      <Link href={sharingLinks.telegram} {...newTab}>
        <FaTelegramPlane />
      </Link>
    </>
  );
}
