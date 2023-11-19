/** A fake `css` function to trigger syntax highlighting without doing anything */
export function css(...args: any) {
  return args;
  // return String.raw(strings, ...values); // This also turned out to not work in a [].map :(
}
