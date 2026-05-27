const emojiRegex = /\p{Extended_Pictographic}/u

export const normalizeEmojiIcon = (value: string | null | undefined) => {
  if (!value) return null
  const trimmed = value.trim()

  if (!trimmed || /^https?:\/\//i.test(trimmed)) return null

  const match = trimmed.match(emojiRegex)
  return match?.[0] ?? trimmed.slice(0, 2).toUpperCase()
}

export const renderEntityIcon = (value: string | null | undefined, fallback: string) =>
  normalizeEmojiIcon(value) ?? fallback
