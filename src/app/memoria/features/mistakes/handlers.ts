import { MemoryCard } from '../../types';

export function handleSearchParamMistakes(
  pendingIndexes: number[] | undefined,
  cards: MemoryCard[],
  isPendingSequenceComplete: boolean,
  doPendingMismatch: boolean,
  previousSeen: number[],
  mistakes: number,
) {
  const isMistake = getIsMistake(
    pendingIndexes,
    cards,
    isPendingSequenceComplete,
    doPendingMismatch,
    previousSeen,
  );
  const newMistakes = isMistake ? mistakes + 1 : undefined;
  const currentMistakes = newMistakes ?? mistakes;
  return currentMistakes;
}

function getIsMistake(
  pendingIndexes: number[] | undefined,
  cards: MemoryCard[],
  isPendingSequenceComplete: boolean,
  doPendingMismatch: boolean,
  previousSeen: number[],
) {
  // So, there's two ways the player can make a mistake in this game after opening a first pending card:
  // 1. Deciding that he has not seen the same content when actually he did, and then opening a card that's not a match;
  //    In other words, if user opened a first card of a pair and its content was already seen, and the user opens any card other than its match — it's a mistake.
  // 2. Deciding that he's already seen the same content when actually he hasn't, and trying to match with some of the cards he opened before;
  //    In other words, if the second card the user selects is not a match and was already seen — it's also a mistake.
  // - Just making a mismatch alone doesn't guarantee it is a mistake, because mismatching is a way of first-time exploration.
  if (!(isPendingSequenceComplete && doPendingMismatch && pendingIndexes !== undefined))
    return false;

  const idOfFirstPending = cards[pendingIndexes[0]].id;
  const secondForFirstPending = cards.find(
    (card) => card.id === idOfFirstPending && card.index !== pendingIndexes[0],
  )!;
  if (process.env.NODE_ENV !== 'production' && !secondForFirstPending)
    throw new Error(
      'No second (matching) card found while calculating "isMistake". This should never happen in any environment with any configuration, so needs exploring',
    );

  /** `true` means the content of the first pending card was already seen by the player on a previously checked card */
  const hasSeenMatchingClosedCard = previousSeen.includes(secondForFirstPending.index);
  const hasSeenSecondPendingCard =
    !hasSeenMatchingClosedCard && previousSeen.includes(pendingIndexes[1]);
  const isMistake = hasSeenMatchingClosedCard || hasSeenSecondPendingCard;

  return isMistake;
}
