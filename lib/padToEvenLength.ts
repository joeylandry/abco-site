export function padToEvenLength<T>(items: T[]): Array<T | null> {
  if (items.length % 2 === 0) {
    return items as Array<T | null>
  }

  return [...items, null]
}
