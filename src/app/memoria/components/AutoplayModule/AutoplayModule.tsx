'use client';

import { useEventListener } from 'usehooks-ts';

const autoplayConfig = {
  // searchInterval: 20,
  matchInterval: 200,
};

export function AutoplayModule() {
  // Logic:
  // - Find the first unclicked node the value of which is not known, click it.
  // - Wait until it re-renders and save the value.
  // - Repeat from step one until all nodes are rotated.
  // - Match them all.
  useEventListener(
    'keydown',
    (event) => {
      if (event.code !== 'KeyA') return;

      const grid = document.querySelector('[role="grid"]');
      if (!grid) {
        console.error('No grid element found');
        return;
      }
      const approximateActualSearchInterval = 100;
      console.info(
        `Autoplay: started. ETA: ${
          (grid.children.length *
            (autoplayConfig.matchInterval + approximateActualSearchInterval)) /
          1000
        }s`,
      );
      const knownNodes = new Map<number, string>();
      function getUnknownNode() {
        if (!grid) {
          console.error('No grid element found');
          return;
        }
        return Array.from(grid.children).find(
          (node, nodeIndex) =>
            node.getAttribute('data-rotated') === 'false' && !knownNodes.has(nodeIndex),
        );
      }
      function findUnknownNode() {
        if (!grid) {
          console.error('No grid element found');
          return;
        }
        const observer = new MutationObserver((mutationsList) => {
          mutationsList.forEach((mutation) => {
            if (mutation.addedNodes.length === 0) return;
            const content = mutation.addedNodes[0].textContent;
            if (!content) return;

            const index = getElementIndex(mutation.target as HTMLElement);
            knownNodes.set(index, content);
            observer.disconnect();
            findUnknownNode();
          });
        });
        const nonRotatedNode = getUnknownNode();
        if (!nonRotatedNode) {
          console.info('Proceed to matching: Could not find non-rotated unknown node');
          observer.disconnect();
          matchAllKnownNodes();
          return;
        }

        clickNode(nonRotatedNode);

        observer.observe(nonRotatedNode, { childList: true });
      }
      findUnknownNode();

      function matchAllKnownNodes() {
        if (!grid) {
          console.error('No grid element found');
          return;
        }

        const knownNodesInverted = new Map<string, number[]>();

        knownNodes.forEach((content, index) => {
          if (knownNodesInverted.has(content)) {
            knownNodesInverted.set(content, [knownNodesInverted.get(content)![0], index]);
          } else {
            knownNodesInverted.set(content, [index]);
          }
        });

        let delay = autoplayConfig.matchInterval;

        const theOnlySelectedNodes = grid.querySelectorAll(
          '[data-rotated="true"][data-just-matched="false"][data-just-mismatched="false"]',
        );
        /** TODO: instead of just the last (by index) rotated node, this should be the node that is selected but not yet matched. */
        const theOnlySelectedNode: Element | undefined =
          theOnlySelectedNodes[theOnlySelectedNodes.length - 1];
        if (theOnlySelectedNode) {
          const theOnlySelectedContent = theOnlySelectedNode.textContent;
          if (theOnlySelectedContent) {
            const theOnlySelectedNodeMatches = knownNodesInverted.get(theOnlySelectedContent);

            if (theOnlySelectedNodeMatches) {
              setTimeout(() => {
                clickNode(grid.children[theOnlySelectedNodeMatches[0]] as HTMLElement);
                knownNodesInverted.delete(theOnlySelectedContent);
              }, delay);
              delay += autoplayConfig.matchInterval;
            } else {
              console.info(`No "theOnlySelectedNodeMatches" by content: ${theOnlySelectedContent}`);
            }
          } else {
            console.error(`Could not find "The only selected node"'s content`);
          }
        } else {
          console.info('Could not find "The only selected node"');
        }

        // TODO: before matching the pairs, also remove the ones that are already matching from the knownNodesInverted Map.
        knownNodesInverted.forEach((indexes) => {
          indexes.forEach((index) => {
            setTimeout(() => {
              clickNode(grid.children[index]);
            }, delay);
            delay += autoplayConfig.matchInterval;
          });
        });
      }
    },
    undefined,
    true,
  );

  return null;
}

function clickNode(node: ChildNode) {
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
