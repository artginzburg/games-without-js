import { roundToDecimals } from '@/tools/roundToDecimals';

import { autoplayConfig } from './autoplayConfig';
import { getIsAttributeTrue } from './autoplayTools';

export function lookAtAllNodesAndStoreKnownOnes(grid: ReturnType<typeof getGridElement>) {
  const knownPairs = new Map<string, number[]>();
  /** @todo splice when nodes are about to be clicked anyway without a lookup. And splice when nodes are matched. Beware: it may cause problems with starting out of some game states. */
  const nodesToLookAcross: Element[] = [];

  Array.from(grid.children).forEach((node, nodeIndex) => {
    const isRotated = getIsAttributeTrue(node, 'data-rotated');
    if (!isRotated) {
      nodesToLookAcross.push(node);
      return;
    }

    const isPending = getIsAttributeTrue(node, 'aria-selected');
    if (isPending) {
      const content = getNodeTextContentOrThrow(node, 'pending');

      knownPairs.set(content, [nodeIndex]);
      return;
    }

    const isMismatched = getIsAttributeTrue(node, 'data-just-mismatched');
    if (!isMismatched) return;

    const content = getNodeTextContentOrThrow(node, 'mismatched');

    knownPairs.set(
      content,
      knownPairs.has(content) ? [knownPairs.get(content)![0], nodeIndex] : [nodeIndex],
    );
  });

  return {
    knownPairs,
    nodesToLookAcross,
  };
}

function getNodeTextContentOrThrow(node: Element, stateDescription: 'mismatched' | 'pending') {
  const content = node.children[0].textContent;
  if (!content) {
    // This would normally never happen unless something is terribly wrong in the code.
    throw new Error(`Autoplay (initial lookup): Content of a ${stateDescription} node is missing`);
  }
  console.info(
    `Autoplay (initial lookup): found a ${stateDescription} node with content:`,
    content,
  );

  return content;
}

export function clickNode(node: Element) {
  function action() {
    (node.children[0] as HTMLElement).click();
  }

  if (autoplayConfig.useClickInterval && autoplayConfig.clickInterval !== 0) {
    setTimeout(action, autoplayConfig.clickInterval);
  } else {
    action();
  }
}
export function getGridElement() {
  const grid = document.querySelector('[role="grid"]');
  if (!grid) {
    throw new Error('Autoplay: No grid element found');
  }
  return grid;
}

/** @todo include the current state of the game in the ETA calculation */
export function displayETA(grid: ReturnType<typeof getGridElement>) {
  /** Actually ranges from 0.75 to 0.8 */
  const approximateMovesPerCard = 0.8;
  /** 0.05-0.07 in Chrome, 0.06-0.08 in Safari on M1 Pro */
  const approximateSecondsPerCard = 0.065;
  const etaMoves = grid.children.length * approximateMovesPerCard;
  const etaSeconds = grid.children.length * approximateSecondsPerCard;
  console.info(
    `Autoplay: started. ETA: ${Math.round(etaMoves)} moves, ${roundToDecimals(etaSeconds, 2)}s`,
  );
}
