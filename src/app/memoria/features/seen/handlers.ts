export function handleSearchParamSeen(
  seen: string | undefined,
  currentEnabled: Set<number>,
  pendingIndexes: number[] | undefined,
  shouldStopClock: boolean,
): { previousSeen: number[]; newSeenString: string } {
  if (shouldStopClock) {
    // TODO technically, it should stop tracking even one move earlier than shouldStopClock becomes true
    return { previousSeen: [], newSeenString: '' };
  }

  const previousSeen = seen === '' || seen === undefined ? [] : seen.split(',').map(Number);
  const newSeenSet = new Set([...previousSeen, ...currentEnabled, ...(pendingIndexes ?? [])]);
  const newSeenString = [...newSeenSet].join(',');
  return { previousSeen, newSeenString };
}
