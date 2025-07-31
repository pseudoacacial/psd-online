import type { Query } from "../../slices/querySlice"

export interface QueryListItemInputProps {
  readQuery: Query
  changeQueryValue: (key: keyof Query, value: Query[keyof Query]) => void
  queryKey: keyof Query
  placeholder: string
  className?: string
  type?: "text" | "number"
  transform?: (value: string) => string
}

export const QueryListItemInput = ({
  readQuery,
  changeQueryValue,
  queryKey,
  placeholder,
  className = "grow shrink min-w-0 pl-1 bg-bg-2",
  type = "text",
  transform = v => v,
}: QueryListItemInputProps) => {
  return (
    <input
      type={type}
      className={className}
      role="form"
      onChange={event => changeQueryValue(queryKey, event.target.value)}
      value={transform(readQuery[queryKey] as string)}
      placeholder={placeholder}
      aria-label={placeholder}
    />
  )
}
