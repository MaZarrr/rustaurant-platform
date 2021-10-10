export function getRandomArbitrary(min: number, max: number): number {
  return Math.ceil(Math.random() * (max - min) + min);
}
// "testRegex": ".*\\.spec\\.ts$",
// "testRegex": ".spec.ts$",
// "coveragePathIgnorePatterns": [
//   "node_modules",
//   ".entity.ts",
//   ".constants.ts"
// ]