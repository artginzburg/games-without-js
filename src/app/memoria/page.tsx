import { Metadata } from 'next';
import { FaArrowLeftLong, FaChessBoard, FaRepeat, FaShoePrints } from 'react-icons/fa6';
import Link from 'next/link';

import { deterministicShuffle } from '@/tools/deterministicShuffle';
import { generateRandomString } from '@/tools/generateRandomString';

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
  MovesStatContainer,
  RestartButtonContainer,
  GameBottomButtonsContainer,
  GameBoardSizeButtonContainer,
  BackLinkContainer,
  PageWrapper,
  ClockStatContainer,
  GameBoardSizeButtonsContainerWithTooltip,
} from './page.styled';
import { handleSearchParamMistakes } from './features/mistakes/handlers';
import { MemoryCard } from './types';
import { handleSearchParamSeen } from './features/seen/handlers';
import { DevOptionsObject, DevOptionsFormat } from './features/devOnlyOptions/utils';
import { parseSearchParamDevOptions } from './features/devOnlyOptions/handlers';
import { WinModal } from './components/WinModal/WinModal';
import { GameLink } from './components/GameLink';

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
  allowSmallestBoardSize: true,
};

export type AllowedSearchParams =
  | 'seed'
  | 'size'
  | 'moves'
  | 'pending'
  | 'enabled'
  | 'startedAt'
  | 'finishedAt'
  | 'seen'
  | 'mistakes'
  | 'devOptions';
export const searchParamsDefaults: Record<
  Extract<AllowedSearchParams, 'size' | 'moves' | 'mistakes'>,
  number
> = {
  size: 4,
  moves: 0,
  mistakes: 0,
};

export default function Memory({
  searchParams,
}: {
  searchParams: Partial<Record<AllowedSearchParams, string>>;
}) {
  const seed = searchParams.seed ?? generateRandomString();
  const actionResetHref = `?seed=${generateRandomString()}` as const;

  const {
    startedAt,
    finishedAt,
    enabled: enabledString,
    pending: pendingString,
    seen,
    devOptions,
  } = searchParams;

  const boardSize = searchParams.size ? Number(searchParams.size) : searchParamsDefaults.size;
  const moves = searchParams.moves ? Number(searchParams.moves) : searchParamsDefaults.moves;
  const mistakes = searchParams.mistakes
    ? Number(searchParams.mistakes)
    : searchParamsDefaults.mistakes;

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

  const shouldStopClock = getShouldStopClock(currentEnabled, pendingIndexes, cards);
  const newFinishedAt = shouldStopClock ? Date.now() : undefined;
  const currentFinishedAt = newFinishedAt ?? finishedAt;

  const { previousSeen, newSeenString } = handleSearchParamSeen(
    seen,
    currentEnabled,
    pendingIndexes,
    shouldStopClock,
  );

  const currentMistakes = handleSearchParamMistakes(
    pendingIndexes,
    cards,
    isPendingSequenceComplete,
    doPendingMismatch,
    previousSeen,
    mistakes,
  );

  const devOptionsObject = parseSearchParamDevOptions(devOptions);

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
            <GameLink href={actionResetHref} noFocus={!isGameStarted} accessKey="r" title="Restart">
              <FaRepeat />
            </GameLink>
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
              currentFinishedAt={currentFinishedAt}
              newSeenString={newSeenString}
              currentMistakes={currentMistakes}
              devOptions={devOptions}
              devOptionsObject={devOptionsObject}
            />
          ))}
        </CardsContainer>
        <GameBottomButtonsContainer>
          <p>
            <FaChessBoard />
            {boardSize}x{boardSize}
          </p>
          <GameBoardSizeButtons
            {...{
              isGameStarted,
              boardSize,
              seed,
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
          enabledString={enabledString}
          searchParams={searchParams}
          devOptionsObject={devOptionsObject}
        />
      )}
      <WinModal
        {...{ hasWon, moves, startedAt, finishedAt, cardCount, actionResetHref, currentMistakes }}
      />
      {devConfig.allowAutoplay && process.env.NODE_ENV !== 'production' && <AutoplayModule />}
    </PageWrapper>
  );
}

function getShouldStopClock(
  currentEnabled: Set<number>,
  pendingIndexes: number[] | undefined,
  cards: MemoryCard[],
) {
  const totalRotatedQuantity = currentEnabled.size + (pendingIndexes?.length ?? 0);
  return totalRotatedQuantity > cards.length - 2;
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
  currentFinishedAt,

  newSeenString,
  currentMistakes,

  devOptions,
  devOptionsObject,
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
  currentFinishedAt: string | number | undefined;

  newSeenString: string;
  currentMistakes: number;

  devOptions: string | undefined;
  devOptionsObject: DevOptionsObject | undefined;
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
      <GameLink
        query={{
          seed,
          size: boardSize,
          pending: newPendingString,
          enabled: newEnabledString,
          moves: nextMoves,
          startedAt: currentStartedAt,
          finishedAt: currentFinishedAt,
          seen: newSeenString,
          mistakes: currentMistakes,
          devOptions,
        }}
        aria-label={`Rotate card ${card.index + 1}`}
      >
        {devOptionsObject?.showClosedContent ? cardContentShuffled[card.id] : null}
      </GameLink>
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
  pendingString,
  enabledString,
}: {
  isGameStarted: boolean;
  boardSize: number;
  seed: string;
  pendingString: string | undefined;
  enabledString: string | undefined;
}) {
  const boardSizeStep = 2;
  const boardSizeIfIncreased = boardSize + boardSizeStep;

  const minimumBoardSize =
    process.env.NODE_ENV === 'development' && devConfig.allowSmallestBoardSize ? 2 : 4;
  const isDecreaseButtonDisabled = boardSize <= minimumBoardSize;
  const isIncreaseButtonDisabled = boardSizeIfIncreased ** 2 / 2 > emojis.length;

  return (
    <GameBoardSizeButtonsContainerWithTooltip
      aria-disabled={isGameStarted}
      data-text={isGameStarted ? 'Finish the game to change board size' : undefined}
    >
      <GameBoardSizeButtonContainer role="button" aria-disabled={isDecreaseButtonDisabled}>
        <GameLink
          query={{
            seed,
            size: boardSize - boardSizeStep,
            pending: pendingString,
            enabled: enabledString,
          }}
          noFocus={isDecreaseButtonDisabled || isGameStarted}
          accessKey="-"
        >
          -
        </GameLink>
      </GameBoardSizeButtonContainer>
      <GameBoardSizeButtonContainer role="button" aria-disabled={isIncreaseButtonDisabled}>
        <GameLink
          query={{
            seed,
            size: boardSizeIfIncreased,
            pending: pendingString,
            enabled: enabledString,
          }}
          noFocus={isIncreaseButtonDisabled || isGameStarted}
          accessKey="="
        >
          +
        </GameLink>
      </GameBoardSizeButtonContainer>
    </GameBoardSizeButtonsContainerWithTooltip>
  );
}

function DevOnlyMenu({
  seed,
  cards,
  enabledString,
  searchParams,
  boardSize,

  devOptionsObject,
}: {
  seed: string;
  cards: MemoryCard[];
  enabledString: string | undefined;
  searchParams: Record<string, string | undefined>;
  boardSize: number;

  devOptionsObject: DevOptionsObject | undefined;
}) {
  if (process.env.NODE_ENV !== 'development') return null;

  const enableAllEnabledString = cards.map((card) => card.index).join(',');

  return (
    <section>
      <p>Dev-only actions:</p>
      <ul>
        <DevOnlyMenuLi aria-disabled={enabledString === enableAllEnabledString}>
          <GameLink
            query={{
              seed,
              size: boardSize,
              enabled: enableAllEnabledString,
            }}
          >
            FLip all cards
          </GameLink>
        </DevOnlyMenuLi>
        <DevOnlyMenuLi aria-disabled={enabledString === '' || enabledString === undefined}>
          <GameLink
            query={{
              seed,
              size: boardSize,
            }}
          >
            Close all cards
          </GameLink>
        </DevOnlyMenuLi>
        <DevOnlyMenuLi>
          <GameLink
            query={{
              seed,
              size: boardSize,
            }}
          >
            Replay with the same seed and size
          </GameLink>
        </DevOnlyMenuLi>
      </ul>

      <p style={{ marginTop: 20 }}>Dev-only options:</p>
      <ul>
        <DevOnlyMenuLi>
          <GameLink
            query={{
              seed,
              size: boardSize,
              devOptions: DevOptionsFormat.stringify({
                ...devOptionsObject,
                showClosedContent: !devOptionsObject?.showClosedContent,
              }),
            }}
          >
            Show closed content: {String(!!devOptionsObject?.showClosedContent)}
          </GameLink>
        </DevOnlyMenuLi>
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
