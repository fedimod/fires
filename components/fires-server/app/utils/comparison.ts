export function arraysEqual(a: string[], b: string[]) {
  if (a.length !== b.length) return false
  return a.every((el) => b.includes(el))
}
