'use client';

import { useEventListener } from 'usehooks-ts';

import { getElementIndex } from '@/tools/domToolkit';

import {
  getGridElement,
  lookAtAllNodesAndStoreKnownOnes,
  displayETA,
  clickNode,
} from './autoplayUtils';
import { getIsAttributeTrue } from './autoplayTools';

/** @todo disconnect observer on unmount */
export function AutoplayModule() {
  /**
   * Logic:
   * 1. Look at all nodes and store already known ones
   * 2. Observe all nodes
   * 3. Find a clickable unknown node
   * 4. Click it
   * 5. The observer catches a change
   */
  function autoplay() {
    const grid = getGridElement();

    const { knownPairs, nodesToLookAcross } = lookAtAllNodesAndStoreKnownOnes(grid);
    const autoplayObserver = observeAllNodes();
    displayETA(grid);
    clickUnknownNodeOrFinish();

    /**
     * (Old, not actualized) Observer logic:
     * 1. If the node has an already known match — get and click the matching node.
     * 2. If the node itself is already known — then it was clicked by being a known match for another node from stage 5.1, so skip it.
     * 3. If not either of the above, store the content of the node and get back to stage 3
     * * The new Observer logic works a bit differently, but I did not explain it here yet.
     */
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
            const isMatched = getIsAttributeTrue(htmlElement, 'data-just-matched');
            if (isMatched) {
              clickUnknownNodeOrFinish();
              return;
            }

            const thisPairFromKnown = knownPairs.get(content)!; // NonNullable since it's already checked as the condition for this scope.
            const isMismatched = getIsAttributeTrue(htmlElement, 'data-just-mismatched');
            if (isMismatched) {
              knownPairs.set(content, [index]);
            }
            clickNode(grid.children[thisPairFromKnown[0]]); // Notice the usage of the old value of `thisPairFromKnown`, not the one that was just set if justMismatched was 'true'.
            return;
          }
          //#endregion

          // Scenario 5.3 — store the content, return to stage 3
          knownPairs.set(content, [index]);
          clickUnknownNodeOrFinish();
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
        const isRotated = getIsAttributeTrue(node, 'data-rotated');
        return !isRotated && !knownPairsValues.has(index);
      });
    }
    function clickUnknownNodeOrFinish() {
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
