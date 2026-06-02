import { useState } from 'react'
import { Button, Popover } from 'antd'
import EmojiPicker, { Theme, type EmojiClickData } from 'emoji-picker-react'
import { SmilePlus } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { normalizeEmojiIcon } from '@/lib/icons'

type EmojiFieldProps = {
  value?: string | null
  onChange?: (value: string | null) => void
  fallback?: string
}

const EmojiField = ({ value, onChange, fallback = '✨' }: EmojiFieldProps) => {
  const [open, setOpen] = useState(false)
  const { isDark } = useTheme()
  const icon = normalizeEmojiIcon(value) ?? fallback

  const handleEmojiClick = (emoji: EmojiClickData) => {
    onChange?.(emoji.emoji)
    setOpen(false)
  }

  return (
    <Popover
      trigger="click"
      open={open}
      onOpenChange={setOpen}
      content={
        <EmojiPicker
          lazyLoadEmojis
          height={360}
          width={310}
          theme={isDark ? Theme.DARK : Theme.LIGHT}
          onEmojiClick={handleEmojiClick}
        />
      }
    >
      <Button className="h-11 w-full justify-start border-(--border) bg-[color-mix(in_srgb,var(--surface)_72%,transparent)]" icon={<SmilePlus size={16} />}>
        <span className="text-lg">{icon}</span>
        <span className="ml-2 text-sm">Choose icon</span>
      </Button>
    </Popover>
  )
}

export default EmojiField
