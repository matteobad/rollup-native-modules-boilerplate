// Polyfills the browser's native `performance.timeOrigin` in
// browsers that dont' support it natively.
const timeOrigin = performance.timeOrigin || performance.timing.navigationStart;

export default timeOrigin;
