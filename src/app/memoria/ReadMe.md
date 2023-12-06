## TODO

- [x] Adapt to light theme
- [x] Rewrite all queries from strings to object literals
- [x] Add type annotations for queries
- [ ] Rename `enabled` to `guessed`
- [x] Use `aria-label` or `title` to make all the Links accessible.
- [ ] Add CSS-only tooltips instead of `title` for disabled elements, or make the disabled styles more obvious where they're not (e.g. in board size buttons container).
- [x] "Pending" card style
- [ ] Stop the clock after winning (visually). Not that it's really visible since the win modal blurs the background, but still visible a bit, so stopping just for the polished feel seems necessary. UPD: even more synchronization problems ahead.
- [x] Stop the clock after winning (actually), possibly via a redirect to `?...&finishedAt=Date.now()`. UPD: stopping the clock was easy this whole time! Solution: If there's only one pair left that's not matched — then the game is logically complete. Yes, the player may wait like 20 hours before clicking the final cards, but it's the only thing he can do, so I'm going to assume the game is finished at this point. UPD2: ended up stopping the clock when only 1 card is left — feels more fair, given that the only reason I don't want to stop the clock on win is that it would cause a redirect.
- [ ] Rating system for each stat type. E.g. for moves: 3 stars is 12-14 moves with 16 cards; 2 stars is N moves = N cards; 1 star is therefore 20 moves with 16 cards; and 0 stars is more moves than that. But actually 3 stars should be equal to "perfect", as in "no misses that could be avoided". When winning with "perfect", the win modal should say "OCD!" (as in Obsessive Completion Distinction). UPD: the amount of moves depends on RNG and random choices made by the player, so it cannot be used as a reliable way to determine the amount of mistakes.
- [ ] Track cards that were already seen but not matched in a separate state named `peeked`. It can be used later to display Hints. It can also be used to calculate the amount of mistakes (for rating).
- [ ] (Dev mode) make a button to replay with the same seed and size.

## Ideas

- Make it possible to require 3, 4, 5 or whatever more cards to match.
- Hints: optional toggle. When enabled, and the pending sequence is not complete, the cards that were already peeked and do not match the pending sequence become marked in some way. Obviously, the matching card should never be marked.

### Similar games from the Internet

- [Pearl Pairing by behnamazizi](https://github.com/behnamazizi/pearlpairingthegame)
- [Match Cards by Tinloof](https://dribbble.com/shots/20143404-Match-Cards-game-Case-study)
