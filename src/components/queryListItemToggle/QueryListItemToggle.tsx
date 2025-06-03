import type { Query } from "../../slices/querySlice"

export interface QueryListItemToggleProps {
  readQuery: Query
  changeQueryValue: (key: keyof Query, value: Query[keyof Query]) => void
  label: string
  queryKey: keyof Query
}

export const QueryListItemToggle = ({ readQuery, changeQueryValue, label, queryKey }: QueryListItemToggleProps) => {
  return (
            <div className="mx-1">
              <input
                type="checkbox"
                id={label}
                checked={readQuery[queryKey] as boolean}
                onChange={(event) => changeQueryValue(queryKey, event.target.checked)}
              ></input>
              <label htmlFor={label}>{label}</label>
            </div>
  )
}