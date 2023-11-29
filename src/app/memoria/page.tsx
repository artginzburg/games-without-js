import { Metadata } from 'next';
import Image from 'next/image';
import { FaTelegramPlane } from 'react-icons/fa';
import {
  FaArrowLeftLong,
  FaChessBoard,
  FaFacebookF,
  FaRepeat,
  FaShoePrints,
  FaXTwitter,
} from 'react-icons/fa6';
import { redirect } from 'next/navigation';
import Link from 'next/link';

import { deterministicShuffle } from '@/tools/deterministicShuffle';
import { generateRandomString } from '@/tools/generateRandomString';
import { declinationOfNum } from '@/tools/declinationOfNum';
import { roundToDecimals } from '@/tools/roundToDecimals';
import { getSharingTwitter } from '@/tools/social-share/sharers/twitter';
import { getSharingTelegram } from '@/tools/social-share/sharers/telegram';
import { getSharingFacebook } from '@/tools/social-share/sharers/facebook';
import { newTab } from '@/tools/linkHelpers';
import encodeParams from '@/tools/social-share/utils/encodeParams';

import { AutoplayModule } from './components/AutoplayModule/AutoplayModule';
import { CircleProgressBar } from './components/CircleProgressBar/CircleProgressBar';
import { texts } from './data/texts';
import { emojis } from './data/emojis';
import {
  CardContainer,
  CardsContainer,
  DevOnlyMenuLi,
  GameTopButtonsContainer,
  GameContainer,
  GameHeading,
  ModalContainer,
  MovesStatContainer,
  RestartButtonContainer,
  GameBottomButtonsContainer,
  GameBoardSizeButtonContainer,
  GameBoardSizeButtonsContainer,
  BackLinkContainer,
  PageWrapper,
  ClockStatContainer,
} from './page.styled';

export const metadata: Metadata = {
  title: texts.title,
  description: texts.description,
};

const devConfig = {
  showDevOnlyMenu: false,
  clockStat: {
    showStaticValues: false,
  },
  allowAutoplay: true,
};

type AllowedSearchParams = 'seed' | 'size' | 'moves' | 'pending' | 'enabled' | 'startedAt';
const searchParamsDefaults: Record<Extract<AllowedSearchParams, 'size' | 'moves'>, number> = {
  size: 4,
  moves: 0,
};

export default function Memory({
  searchParams,
}: {
  searchParams: Partial<Record<AllowedSearchParams, string>>;
}) {
  const { seed } = searchParams;
  const actionResetHref = `?seed=${generateRandomString()}` as const;
  if (!seed) {
    redirect(actionResetHref);
  }
  const { startedAt, enabled: enabledString, pending: pendingString } = searchParams;

  const boardSize = searchParams.size ? Number(searchParams.size) : searchParamsDefaults.size;
  const moves = searchParams.moves ? Number(searchParams.moves) : searchParamsDefaults.moves;

  const cardCount = boardSize ** 2;
  const { cards, cardContentShuffled } = generateCardsAndContent(seed, cardCount);

  const pendingIndexes = pendingString?.split(',').map(Number);
  const pendingCards = pendingIndexes?.map((pendingIndex) => cards[pendingIndex]);
  const isPendingSequenceComplete = !!pendingCards && pendingCards.length >= 2;
  const doPendingMatch = isPendingSequenceComplete && pendingCards[0].id === pendingCards[1].id;
  const doPendingMismatch = isPendingSequenceComplete && pendingCards[0].id !== pendingCards[1].id;

  const newEnabledString = doPendingMatch
    ? `${enabledString ? `${enabledString},` : ''}${pendingString}`
    : enabledString;

  const currentEnabled = new Set(
    enabledString === '' ? undefined : enabledString?.split(',').map(Number),
  );

  const hasWon = !!pendingIndexes && currentEnabled.size + pendingIndexes.length === cards.length;

  const nextMoves = moves + 0.5;

  const isGameStarted = moves !== 0;
  /** @todo use encryptNumber() with seed as key for this. */
  const newStartedAt = isGameStarted && moves < 1 ? Date.now() : undefined;
  const currentStartedAt = newStartedAt ?? startedAt;

  return (
    <PageWrapper>
      <GameContainer>
        <GameHeading data-animate={!isGameStarted}>
          {texts.title.split('').map((char, charIndex) => (
            <span key={charIndex}>{char}</span>
          ))}
        </GameHeading>
        <GameTopButtonsContainer>
          <MovesStatContainer
            data-animate={Math.floor(moves) !== moves}
            aria-disabled={!isGameStarted}
          >
            <FaShoePrints />
            <div>
              <p>{Math.floor(moves)}</p>
              <p>{Math.floor(moves + 1)}</p>
            </div>
          </MovesStatContainer>
          <ClockStat
            currentStartedAt={currentStartedAt}
            isGameStarted={isGameStarted}
            moves={moves}
          />
          <RestartButtonContainer aria-disabled={!isGameStarted}>
            <Link
              href={actionResetHref}
              scroll={false}
              tabIndex={!isGameStarted ? -1 : undefined}
              accessKey={isGameStarted ? 'r' : undefined}
            >
              <FaRepeat />
            </Link>
          </RestartButtonContainer>
        </GameTopButtonsContainer>
        <CardsContainer
          boardSize={boardSize}
          data-animate={!isGameStarted && boardSize <= searchParamsDefaults.size}
          data-animate-win={hasWon && boardSize <= searchParamsDefaults.size}
          role="grid"
        >
          {cards.map((card) => (
            <Card
              key={card.index}
              card={card}
              currentEnabled={currentEnabled}
              pendingIndexes={pendingIndexes}
              doPendingMatch={doPendingMatch}
              doPendingMismatch={doPendingMismatch}
              cardContentShuffled={cardContentShuffled}
              isPendingSequenceComplete={isPendingSequenceComplete}
              pendingString={pendingString}
              seed={seed}
              boardSize={boardSize}
              newEnabledString={newEnabledString}
              nextMoves={nextMoves}
              currentStartedAt={currentStartedAt}
            />
          ))}
        </CardsContainer>
        <GameBottomButtonsContainer
          title={isGameStarted ? 'Reset the game to change board size' : undefined}
        >
          <p>
            <FaChessBoard />
            {boardSize}x{boardSize}
          </p>
          <GameBoardSizeButtons
            {...{
              isGameStarted,
              boardSize,
              seed,
              moves,
              pendingString,
              enabledString,
            }}
          />
          <GameCircleProgressBar {...{ currentEnabled, doPendingMatch, cardCount }} />
        </GameBottomButtonsContainer>
      </GameContainer>
      <BackLinkContainer>
        <Link href="/" accessKey="q">
          <FaArrowLeftLong />
          Games without JS
        </Link>
      </BackLinkContainer>
      {devConfig.showDevOnlyMenu && (
        <DevOnlyMenu
          seed={seed}
          boardSize={boardSize}
          cards={cards}
          nextMoves={nextMoves}
          enabledString={enabledString}
          searchParams={searchParams}
        />
      )}
      <WinModal {...{ hasWon, moves, startedAt, cardCount, actionResetHref }} />
      {devConfig.allowAutoplay && process.env.NODE_ENV !== 'production' && <AutoplayModule />}
    </PageWrapper>
  );
}

function Card({
  card,
  currentEnabled,
  pendingIndexes,
  doPendingMatch,
  doPendingMismatch,
  cardContentShuffled,
  isPendingSequenceComplete,

  pendingString,
  seed,
  boardSize,
  newEnabledString,
  nextMoves,
  currentStartedAt,
}: {
  card: MemoryCard;
  currentEnabled: Set<number>;
  pendingIndexes: number[] | undefined;
  doPendingMatch: boolean;
  doPendingMismatch: boolean;
  cardContentShuffled: string[];
  isPendingSequenceComplete: boolean;

  pendingString: string | undefined;
  seed: string;
  boardSize: number;
  newEnabledString: string | undefined;
  nextMoves: number;
  currentStartedAt: string | number | undefined;
}) {
  const isEnabled = currentEnabled.has(card.index);
  const isPending = pendingIndexes?.includes(card.index);

  if (isEnabled || isPending) {
    return (
      <CardContainer
        key={card.index}
        role="gridcell"
        data-rotated
        aria-selected={isPending && !doPendingMatch && !doPendingMismatch}
        data-just-matched={isPending && doPendingMatch}
        data-just-mismatched={isPending && doPendingMismatch}
        aria-invalid={isPending && doPendingMismatch}
      >
        <div>{cardContentShuffled[card.id]}</div>
      </CardContainer>
    );
  }

  const newPendingString = isPendingSequenceComplete
    ? card.index
    : `${pendingString ? `${pendingString},` : ''}${card.index}`;

  return (
    <CardContainer key={card.index} role="gridcell" data-rotated={false} aria-selected={false}>
      <Link
        href={`?${encodeParams({
          seed,
          size: boardSize,
          pending: newPendingString,
          enabled: newEnabledString,
          moves: nextMoves,
          startedAt: currentStartedAt,
        })}`}
        scroll={false}
      />
    </CardContainer>
  );
}

/**
 * Beware, cursed code: the animation would get out of sync when JS is enabled, because Next.js updates the animation delay, but the animation itself stays the same (does not reset).
 *
 * When I first encountered this, I paused the animation altogether when JS is enabled.
 * But now, I'm duplicating the animation instead (with no changes but the name), and alternating between the `animation-name`s based on a trigger (`animationTrigger`) that is certain to change whenever the `animation-delay` (`skipMs`) changes.
 */
function ClockStat({
  currentStartedAt,
  isGameStarted,
  moves,
}: {
  currentStartedAt: string | number | undefined;
  isGameStarted: boolean;
  moves: number;
}) {
  const msPlayed = currentStartedAt ? Date.now() - Number(currentStartedAt) : 0;

  return (
    <ClockStatContainer
      skipMs={msPlayed}
      data-animate={isGameStarted}
      animationTrigger={(moves * 2) % 2 === 0}
      animationTriggerNamePostfix={ClockStatContainer.__linaria.className}
    >
      {devConfig.clockStat.showStaticValues && <ClockStatStaticValues msPlayed={msPlayed} />}
    </ClockStatContainer>
  );
}
function ClockStatStaticValues({ msPlayed }: { msPlayed: number }) {
  const secondsPlayed = msPlayed / 1000;
  const secondOfMinutePlayed = secondsPlayed % 60;
  const minutesPlayed = (secondsPlayed - secondOfMinutePlayed) / 60;

  return (
    <>
      . {minutesPlayed}m:{Math.floor(secondOfMinutePlayed)}s .
    </>
  );
}

/** Note: Caching this function would not yield any performance benefits until the cardCount is very large (much bigger then allowed for this game). Additionally, caching makes the first generation many times longer (when a seed is first encountered). */
function generateCardsAndContent(seed: string, cardCount: number) {
  const halfCardCount = cardCount / 2;

  const cardsBase = [...Array(halfCardCount)].map((_val, id) => ({ id }));

  const cards: MemoryCard[] = deterministicShuffle([...cardsBase, ...cardsBase], seed).map(
    ({ id }, index) => ({
      id,
      index,
    }),
  );

  const cardContentShuffled = deterministicShuffle(emojis, seed).slice(0, halfCardCount);

  return { cards, cardContentShuffled };
}

type MemoryCard = {
  /** Unique to a pair of cards and unknown to the player */
  id: number;
  /** Numerical order of the card, can range from 0 to cardCount - 1 */
  index: number;
};

function GameCircleProgressBar({
  currentEnabled,
  doPendingMatch,
  cardCount,
}: {
  currentEnabled: Set<number>;
  doPendingMatch: boolean;
  cardCount: number;
}) {
  const cardPairNumber = 2;

  const value = ((currentEnabled.size + (doPendingMatch ? cardPairNumber : 0)) / cardCount) * 100;
  return (
    <CircleProgressBar
      value={value}
      previousValue={Math.max(0, value - (cardPairNumber / cardCount) * 100)}
      animate={doPendingMatch}
    />
  );
}

function GameBoardSizeButtons({
  isGameStarted,
  boardSize,
  seed,
  moves,
  pendingString,
  enabledString,
}: {
  isGameStarted: boolean;
  boardSize: number;
  seed: string;
  moves: number;
  pendingString: string | undefined;
  enabledString: string | undefined;
}) {
  const boardSizeStep = 2;
  const boardSizeIfIncreased = boardSize + boardSizeStep;

  const isDecreaseButtonDisabled = boardSize <= 2;
  const isIncreaseButtonDisabled = boardSizeIfIncreased ** 2 / 2 > emojis.length;

  return (
    <GameBoardSizeButtonsContainer aria-disabled={isGameStarted}>
      <GameBoardSizeButtonContainer role="button" aria-disabled={isDecreaseButtonDisabled}>
        <Link
          href={`?${encodeParams({
            seed,
            size: boardSize - boardSizeStep,
            pending: pendingString,
            enabled: enabledString,
          })}`}
          scroll={false}
          tabIndex={isDecreaseButtonDisabled || isGameStarted ? -1 : undefined}
          accessKey={isDecreaseButtonDisabled || isGameStarted ? undefined : '-'}
        >
          -
        </Link>
      </GameBoardSizeButtonContainer>
      <GameBoardSizeButtonContainer role="button" aria-disabled={isIncreaseButtonDisabled}>
        <Link
          href={`?${encodeParams({
            seed,
            size: boardSizeIfIncreased,
            pending: pendingString,
            enabled: enabledString,
          })}`}
          scroll={false}
          tabIndex={isIncreaseButtonDisabled || isGameStarted ? -1 : undefined}
          accessKey={isDecreaseButtonDisabled || isGameStarted ? undefined : '='}
        >
          +
        </Link>
      </GameBoardSizeButtonContainer>
    </GameBoardSizeButtonsContainer>
  );
}

function WinModal({
  hasWon,
  moves,
  startedAt,
  cardCount,
  actionResetHref,
}: {
  hasWon: boolean;
  moves: number;
  startedAt: string | undefined;
  cardCount: number;
  actionResetHref: `?${string}`;
}) {
  /** Caveat: if the page is refreshed, secondsPlayed becomes wrong, since it uses Date.now() directly. */
  const secondsPlayed = startedAt ? (Date.now() - Number(startedAt)) / 1000 : undefined;
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
            <h2>Grats!</h2>
            <AnimatedEmojiPartyPooper />
            <p>
              {moves} {declinationOfNum(moves, ['move', 'moves', 'moves'])}
              {secondsPlayedString} with {cardCount} cards.
            </p>
            <p>
              {"That's"} {roundToDecimals(moves / cardCount, 1)} moves{secondPerCardString} per
              card.
            </p>
            <p>{"Let's go again?"}</p>
            <Link href={actionResetHref} scroll={false}>
              Play
            </Link>
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

function DevOnlyMenu({
  seed,
  cards,
  nextMoves,
  enabledString,
  searchParams,
  boardSize,
}: {
  seed: string;
  cards: MemoryCard[];
  nextMoves: number;
  enabledString: string | undefined;
  searchParams: Record<string, string | undefined>;
  boardSize: number;
}) {
  if (process.env.NODE_ENV !== 'development') return null;

  const enableAllEnabledString = cards.map((card) => card.index).join(',');

  return (
    <section>
      <p>Dev-only menu:</p>
      <ul>
        <DevOnlyMenuLi aria-disabled={enabledString === enableAllEnabledString}>
          <Link
            href={`?${encodeParams({
              seed,
              size: boardSize,
              enabled: enableAllEnabledString,
              moves: nextMoves,
            })}`}
            scroll={false}
          >
            Enable all
          </Link>
        </DevOnlyMenuLi>
        <li>
          <Link
            href={`?${encodeParams({
              seed,
              size: boardSize,
              moves: nextMoves,
            })}`}
            scroll={false}
          >
            Disable all
          </Link>
        </li>
      </ul>

      <div style={{ marginTop: 20 }}>
        <p>State:</p>
        <p>
          {Object.entries(searchParams)
            .map((entries) => entries.join(': '))
            .join(', ')}
        </p>
      </div>
    </section>
  );
}
