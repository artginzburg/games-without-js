'use client';

import { useEventListener } from 'usehooks-ts';

import { roundToDecimals } from '@/tools/roundToDecimals';
import { getElementIndex } from '@/tools/domToolkit';

const autoplayConfig = {
  // searchInterval: 20,
  useClickInterval: false,
  clickInterval: 250,
};

/** @todo disconnect observer on unmount */
export function AutoplayModule() {
  function autoplay() {
    // Autoplay logic:
    // 1. Look at all nodes and store already known ones
    // 2. Observe all nodes
    // 3. Find a clickable unknown node
    // 4. Click it
    // 5. The observer catches a change

    // (Old, not working) Observer logic:
    // 5.1. If the node has an already known match — get and click the matching node.
    // 5.2. If the node itself is already known — then it was clicked by being a known match for another node from stage 5.1, so skip it.
    // 5.3. If not either of the above, store the content of the node and get back to stage 3
    // * The new Observer logic works a bit differently, but I did not explain it here yet.

    const grid = getGridElement();

    const { knownPairs, nodesToLookAcross } = lookAtAllNodesAndStoreKnownOnes(grid);
    const autoplayObserver = observeAllNodes();
    displayETA(grid);
    findClickableUnknownNodeAndClick();

    function observeAllNodes() {
      const observer = new MutationObserver((mutationsList) => {
        mutationsList.forEach((mutation) => {
          if (mutation.addedNodes.length === 0) {
            // Skipping any node that caused a mutation by "hiding". Nodes that were "shown" (rotated) can proceed.
            return;
          }

          const content = mutation.addedNodes[0].textContent;
          if (!content) {
            // Content is not present if the addedNode is an anchor tag (<a/>). Which means that a node also caused a mutation by hiding.
            return;
          }

          const htmlElement = mutation.target as HTMLElement;
          const index = getElementIndex(htmlElement);

          //#region Support for starting out of "pending" and "just-mismatched" states. Without this, autoplay will only work for starting states "game start" and "just-matched"
          if (knownPairs.has(content)) {
            const isMatched = htmlElement.getAttribute('data-just-matched') === 'true';
            if (isMatched) {
              findClickableUnknownNodeAndClick();
              return;
            }

            const thisPairFromKnown = knownPairs.get(content)!; // NonNullable since it's already checked as the condition for this scope.
            const isMismatched = htmlElement.getAttribute('data-just-mismatched') === 'true';
            if (isMismatched) {
              knownPairs.set(content, [index]);
            }
            clickNode(grid.children[thisPairFromKnown[0]]); // Notice the usage of the old value of `thisPairFromKnown`, not the one that was just set if justMismatched was 'true'.
            return;
          }
          //#endregion

          // Scenario 5.3 — store the content, return to stage 3
          knownPairs.set(content, [index]);
          findClickableUnknownNodeAndClick();
        });
      });

      observer.observe(grid, {
        childList: true,
        subtree: true,
      });

      return observer;
    }
    function findClickableUnknownNode() {
      const knownPairsValues = new Set([...knownPairs.values()].flat());

      return nodesToLookAcross.find((node) => {
        const index = getElementIndex(node);
        const isRotated = node.getAttribute('data-rotated') === 'true';
        return !isRotated && !knownPairsValues.has(index);
      });
    }
    function findClickableUnknownNodeAndClick() {
      const clickableUnknownNode = findClickableUnknownNode();
      if (clickableUnknownNode) {
        clickNode(clickableUnknownNode);
        return;
      }

      autoplayObserver.disconnect();
      console.info('Autoplay: finished.');
    }
  }

  useEventListener(
    'keydown',
    (event) => {
      if (event.code !== 'KeyA') return;

      autoplay();
    },
    undefined,
    true,
  );

  return null;
}

function clickNode(node: Element) {
  function action() {
    (node.children[0] as HTMLElement).click();
  }

  if (autoplayConfig.useClickInterval && autoplayConfig.clickInterval !== 0) {
    setTimeout(action, autoplayConfig.clickInterval);
  } else {
    action();
  }
}

function getGridElement() {
  const grid = document.querySelector('[role="grid"]');
  if (!grid) {
    throw new Error('Autoplay: No grid element found');
  }
  return grid;
}

function lookAtAllNodesAndStoreKnownOnes(grid: ReturnType<typeof getGridElement>) {
  const knownPairs = new Map<string, number[]>();
  /** @todo splice when nodes are about to be clicked anyway without a lookup. And splice when nodes are matched. Beware: it may cause problems with starting out of some game states. */
  const nodesToLookAcross: Element[] = [];

  Array.from(grid.children).forEach((node, nodeIndex) => {
    const isRotated = node.getAttribute('data-rotated') === 'true';
    if (!isRotated) {
      nodesToLookAcross.push(node);
      return;
    }

    const isPending = node.getAttribute('aria-selected') === 'true';
    if (isPending) {
      const content = node.children[0].textContent;
      if (!content) {
        // This would normally never happen unless something is terribly wrong in the code.
        throw new Error('Autoplay (initial lookup): Content of a pending node is missing');
      }
      console.info('Autoplay (initial lookup): found a pending node with content:', content);

      knownPairs.set(content, [nodeIndex]);
      return;
    }

    const isMismatched = node.getAttribute('data-just-mismatched') === 'true';
    if (!isMismatched) return;

    const content = node.children[0].textContent;
    if (!content) {
      // This would normally never happen unless something is terribly wrong in the code.
      throw new Error('Autoplay (initial lookup): Content of a mismatched node is missing');
    }
    console.info('Autoplay (initial lookup): found a mismatched node with content:', content);

    knownPairs.set(
      content,
      knownPairs.has(content) ? [knownPairs.get(content)![0], nodeIndex] : [nodeIndex], // This condition will never return true in pair = 2 mode, but may be the case if pair = 3 (in the future).
    );
  });

  return {
    knownPairs,
    nodesToLookAcross,
  };
}

/** @todo include the current state of the game in the ETA calculation */
function displayETA(grid: ReturnType<typeof getGridElement>) {
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
