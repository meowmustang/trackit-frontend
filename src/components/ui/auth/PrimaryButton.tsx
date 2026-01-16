type Props = {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
}

export default function PrimaryButton({ children, onClick, disabled }: Props) {
  return (
    <button
    onClick={onClick}
      disabled={disabled}
      className="
        w-full
        rounded-xl
        bg-orange-500
        py-3
        text-white
        text-lg
        font-medium
        active:scale-95
        transition
      "
    >
      {children}
    </button>
  )
}
