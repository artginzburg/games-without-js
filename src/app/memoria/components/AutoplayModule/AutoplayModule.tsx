'use client';

import { useEventListener } from 'usehooks-ts';
import { memo, useEffect, useRef } from 'react';

import { getElementIndex } from '@/tools/domToolkit';

import {
  getGridElement,
  lookAtAllNodesAndStoreKnownOnes,
  displayETA,
  clickNode,
} from './autoplayUtils';
import { getIsAttributeTrue } from './autoplayTools';

function AutoplayModulePure() {
  const autoplayObserverRef = useRef<MutationObserver>();

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
    autoplayObserverRef.current = observeAllNodes();
    displayETA(grid);
    clickUnknownNodeOrFinish();

    function observeAllNodes() {
      const observer = new MutationObserver((mutationsList) => {
        mutationsList.forEach(handleMutation);
      });

      observer.observe(grid, {
        childList: true,
        subtree: true,
      });

      return observer;
    }

    /**
     * (Old, not actualized) Observer logic:
     * 1. If the node has an already known match — get and click the matching node.
     * 2. If the node itself is already known — then it was clicked by being a known match for another node from stage 5.1, so skip it.
     * 3. If not either of the above, store the content of the node and get back to stage 3
     * * The new Observer logic works a bit differently, but I did not explain it here yet.
     */
    function handleMutation(mutation: MutationRecord): void {
      if (mutation.addedNodes.length === 0) return; // Skipping any node that caused a mutation by "hiding". Nodes that were "shown" (rotated) can proceed.

      const content = mutation.addedNodes[0].textContent;
      if (!content) return; // Content is not present if the addedNode is an anchor tag (<a/>). Which means that a node also caused a mutation by hiding.

      const htmlElement = mutation.target as HTMLElement;
      const index = getElementIndex(htmlElement);

      if (knownPairs.has(content)) {
        handleKnownPair(htmlElement, content, index);
        return;
      }

      // Scenario 3 — store the content, return to Autoplay Logic stage 3
      knownPairs.set(content, [index]);
      clickUnknownNodeOrFinish();
    }

    /** Implements support for starting out of "pending" and "just-mismatched" states. Without this, autoplay will only work for starting states "game start" and "just-matched" */
    function handleKnownPair(htmlElement: HTMLElement, content: string, index: number) {
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

      autoplayObserverRef.current?.disconnect();
      autoplayObserverRef.current = undefined;
      console.info('Autoplay: finished.');
    }
  }

  useEventListener(
    'keydown',
    (event) => {
      if (event.code !== 'KeyA') return;

      if (autoplayObserverRef.current === undefined) {
        autoplay();
      } else {
        autoplayObserverRef.current?.disconnect();
        autoplayObserverRef.current = undefined; //* To implement pause instead of stop, this line should be commented out in favour of tracking autoplay status separately, and doing an .observe(grid, ...) call if future "resume" method was called.
        console.info('Autoplay: stopped manually.');
      }
    },
    undefined,
    true,
  );

  useEffect(
    () => () => {
      autoplayObserverRef.current?.disconnect();
      autoplayObserverRef.current = undefined;
    },
    [],
  );

  return null;
}

export const AutoplayModule = memo(AutoplayModulePure, () => true);
