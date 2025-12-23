const rateLimitMap = new Map<string, { count: number; lastReset: number }>()

const WINDOW_MS = 60 * 1000 // 1 minute
const MAX_REQUESTS = 5

export function rateLimit(identifier: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)

  if (!record) {
    rateLimitMap.set(identifier, { count: 1, lastReset: now })
    return true
  }

  if (now - record.lastReset > WINDOW_MS) {
    record.count = 1
    record.lastReset = now
    return true
  }

  if (record.count >= MAX_REQUESTS) {
    return false
  }

  record.count++
  return true
}
