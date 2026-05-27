import { Input as AntInput } from 'antd'
import type { InputProps as AntInputProps } from 'antd'
import { cn } from '@/lib/utils'

type InputProps = AntInputProps & {
    className?: string
}

const Input = ({ className, ...props }: InputProps) => {
    return (
        <AntInput
            {...props}
            className={cn(
                'h-11 rounded-xl border-neutral-200',
                'focus:border-violet-500 focus:shadow-none',
                className
            )}
        />
    )
}

export default Input