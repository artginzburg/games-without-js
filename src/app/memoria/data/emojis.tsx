export const emojis = [
  '🦊',
  '🎃',

  '😀',
  '😃',
  '😂',
  '🤣',
  '😊',
  '😌',
  '😍',
  '😘',
  '😎',
  '😏',
  '😔',
  '😢',
  '😭',
  '🤔',
  '🤨',
  '😡',
  '🤬',
  '🥺',
  '😷',
  '🤒',
  '🤕',
  '🤗',
  '👍',
  '👎',
  '👏',
  '🤝',
  '👊',
  '✌️',
  '🤟',
  '🤘',
  '👌',
  '👋',
  '🤚',
  '✋',
  '👐',
  '🙌',
  '🤲',
  '🙏',
  '🦶',
  '🦷',
  '👀',
  '👃',
  '👂',
  '👅',
  '🧠',
  '💔',
  '❤️',
  '💤',
  '🔥',
  '💧',
  '💫',
  '🌈',
  '🌞',
  '🌛',
  '☔',
  '🎉',
  '🎈',
  '🎁',
  '📚',
  '✏️',
  '🖍️',
  '🖌️',
  '📝',
  '📅',
  '⏰',
  '💡',
  '🔒',
  '🔓',
  '💻',
  '📱',
  '🖥️',
  '📷',
  '🎥',
  '🔍',
];

function findDuplicates<A>(arr: A[]) {
  const arrSet = new Set(arr);
  const duplicates: A[] = [];
  arr.forEach((el) => {
    arrSet.has(el) ? arrSet.delete(el) : duplicates.push(el);
  });
  return duplicates;
}

function validateEmojis() {
  const dupes = findDuplicates(emojis);
  if (dupes.length) {
    const withIndexes = dupes.map((dupe) => {
      const index = emojis.lastIndexOf(dupe);
      const path = `emojis.tsx:${index + 3}`;
      return {
        emoji: dupe,
        path,
        index,
      };
    });
    console.error('Found duplicates in "emojis.tsx"', withIndexes);
  }
}
if (process.env.NODE_ENV !== 'production') {
  validateEmojis();
}
