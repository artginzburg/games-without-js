export type MemoryCard = {
  /** Unique to a pair of cards and unknown to the player */
  id: number;
  /** Numerical order of the card, can range from 0 to cardCount - 1 */
  index: number;
};
