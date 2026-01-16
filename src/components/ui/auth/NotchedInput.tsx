import type { InputHTMLAttributes } from "react"

type Props = {
  label: string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
} & InputHTMLAttributes<HTMLInputElement>

export default function NotchedInput({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
}: Props) {
  return (
    <div className="relative">
      {/* Label */}
      <span
        className="
          absolute
          -top-2.5
          left-4
          bg-white
          px-2
          text-sm
          text-gray-700
        "
      >
        {label}
      </span>

      {/* Input */}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          w-full
          rounded-xl
          border
          border-orange-400
          px-4
          py-3
          text-sm
          outline-none
          focus:ring-2
          focus:ring-orange-300
        "
      />
    </div>
  )
}
