/** @returns the zero-based index of the passed child within its parent */
export function getElementIndex(element: Element) {
  const parent = element.parentNode;
  if (parent) {
    const children = Array.from(parent.children);
    return children.indexOf(element);
  }
  return -1; // Element has no parent or is not found within parent
}
