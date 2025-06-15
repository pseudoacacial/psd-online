export interface SettingsEditorInputProps {
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void
  label: string
  className?: string
  type?: "text" | "number"
}

export const SettingsEditorInput = ({
  value,
  onChange,
  onBlur,
  label,
  className = "grow shrink min-w-0 pl-1",
  type = "text",
}: SettingsEditorInputProps) => {
  return (
    <div
      className="flex border border-main rounded justify-start"
      onBlur={onBlur}
    >
      <input
        type={type}
        className="rounded-l pl-1"
        id="groupNameRegex"
        value={value}
        onChange={onChange}
        {...(type === "number" && { min: 0, step: 0.1 })}
      />
      <label
        className="whitespace-nowrap px-1 rounded-r text-left"
        htmlFor="groupNameRegex"
      >
        {label}
      </label>
    </div>
  )
}
