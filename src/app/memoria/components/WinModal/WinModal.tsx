import Image from 'next/image';
import { FaTelegramPlane } from 'react-icons/fa';
import { FaCirclePlay, FaFacebookF, FaXTwitter } from 'react-icons/fa6';
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
    ? ` and ${roundToDecimals(secondsPlayed / cardCount, 2)}s`
    : '';

  return (
    <ModalContainer data-visible={hasWon} aria-hidden={!hasWon}>
      <section role="alertdialog" aria-modal>
        {hasWon && (
          <>
            <WinModalStatsContainer>
              <h2>Grats!</h2>
              <AnimatedEmojiPartyPooper />
              <WinModalStars currentMistakes={currentMistakes} />
              <p>
                {moves} {declinationOfNum(moves, ['move', 'moves', 'moves'])}
                {secondsPlayedString} with {cardCount} cards.
              </p>
              <p>
                {"That's"} {roundToDecimals(moves / cardCount, 1)} moves{secondPerCardString} per
                card.
              </p>
              <p>{"Let's go again?"}</p>
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

/** @see https://googlefonts.github.io/noto-emoji-animation/ */
function AnimatedEmojiPartyPooper() {
  return (
    <picture style={{ position: 'absolute', top: 10, right: 10 }}>
      <source
        srcSet="https://fonts.gstatic.com/s/e/notoemoji/latest/1f389/512.webp"
        type="image/webp"
      />
      <Image
        src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f389/512.gif"
        alt="🎉"
        width={32}
        height={32}
      />
    </picture>
  );
}
