export function truncateToEvenLength<T>(items: T[]): T[] {
  return items.slice(0, items.length - (items.length % 2))
}
