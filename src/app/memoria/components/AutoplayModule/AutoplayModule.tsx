'use client';

import { useEventListener } from 'usehooks-ts';

import { roundToDecimals } from '@/tools/roundToDecimals';

// /** @todo implement clickInterval */
// const autoplayConfig = {
//   // searchInterval: 20,
//   clickInterval: 200,
// };

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

    const grid = document.querySelector('[role="grid"]');
    if (!grid) {
      throw new Error('Autoplay: No grid element found');
    }

    const knownPairs = new Map<string, number[]>();
    const nodesToLookAcross: Element[] = [];

    lookAtAllNodesAndStoreKnownOnes();
    const autoplayObserver = observeAllNodes();
    displayETA();
    findClickableUnknownNodeAndClick();

    function lookAtAllNodesAndStoreKnownOnes() {
      if (!grid) {
        throw new Error('Autoplay (initial lookup): No grid element found');
      }

      const allNodes = grid.children;
      const allNodesAsArray = Array.from(allNodes);

      allNodesAsArray.forEach((node, nodeIndex) => {
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

        const isRotated = node.getAttribute('data-rotated') === 'true';
        if (!isRotated) {
          nodesToLookAcross.push(node);
          return;
        }

        // Skip all nodes that (are not pending and) are guessed.
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
          knownPairs.has(content) ? [knownPairs.get(content)![0], nodeIndex] : [nodeIndex],
        );
      });
    }
    function observeAllNodes() {
      if (!grid) {
        throw new Error('Autoplay (observer creation): No grid element found');
      }

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

          const index = getElementIndex(mutation.target as HTMLElement);

          if (knownPairs.has(content)) {
            // All the code inside this `if` statement can be commented out and it will work fine for starting states "game start" and "just-matched".
            // This `if` statement adds support to work out of "pending" and "just-mismatched" states.
            const htmlElement = mutation.target as HTMLElement;

            const isMatched = htmlElement.getAttribute('data-just-matched') === 'true';
            if (isMatched) {
              findClickableUnknownNodeAndClick();
              return;
            }

            const isMismatched = htmlElement.getAttribute('data-just-mismatched') === 'true';
            const thisPairFromKnown = knownPairs.get(content)!; // NonNullable since it's already checked as the condition for this scope.
            if (isMismatched) {
              knownPairs.set(content, [index]);
            }
            clickNode(grid.children[thisPairFromKnown[0]]); // Notice the usage of the old value of `thisPairFromKnown`, not the one that was just set if justMismatched was 'true'.
            return;
          }

          knownPairs.set(content, [index]);
          // Scenario 5.3 — store the content, return to stage 3
          findClickableUnknownNodeAndClick();
        });
      });

      observer.observe(grid, {
        childList: true,
        subtree: true,
      });

      return observer;
    }
    function findClickableUnknownNode(): HTMLElement | undefined {
      const knownPairsValues = new Set([...knownPairs.values()].flat());

      return (nodesToLookAcross as HTMLElement[]).find((node) => {
        const index = getElementIndex(node as HTMLElement);
        return node.getAttribute('data-rotated') === 'false' && !knownPairsValues.has(index);
      });
    }
    function findClickableUnknownNodeAndClick() {
      const clickableUnknownNode = findClickableUnknownNode();
      if (clickableUnknownNode) {
        clickNode(clickableUnknownNode);
      } else {
        autoplayObserver.disconnect();
        console.info('Autoplay: finished.');
      }
    }

    /** @todo include the current state of the game in the ETA calculation */
    function displayETA() {
      if (!grid) {
        throw new Error('Autoplay (ETA display): No grid element found');
      }

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

function clickNode(node: ChildNode | HTMLElement) {
  ((node as HTMLElement).children[0] as HTMLElement).click();
}

function getElementIndex(element: HTMLElement) {
  const parent = element.parentNode;
  if (parent) {
    const children = Array.from(parent.children);
    return children.indexOf(element);
  }
  return -1; // Element has no parent or is not found within parent
}
