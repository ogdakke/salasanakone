// biome-ignore lint/suspicious/noExplicitAny: extends generics so any is ok
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return ((...args: Parameters<T>) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => func(...args), wait)
  }) as T
}
