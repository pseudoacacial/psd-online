import { useAppDispatch, useAppSelector } from "../../app/hooks"

import { useState, useEffect } from "react"

import {
  add,
  remove,
  modify,
  selectQueries,
  Query,
} from "../../slices/querySlice"

export const QueryList = () => {
  const dispatch = useAppDispatch()
  const selectors = useAppSelector(selectQueries)

  const [input, setInput] = useState("")

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value)
  }
  const handleAddClick = () => {
    dispatch(
      add({
        id: self.crypto.randomUUID(),
        psdSelector: input,
      }),
    )
    setInput("")
  }
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleAddClick()
    }
  }
  const handleRemoveClick = (e: React.BaseSyntheticEvent) => {
    dispatch(remove(e.target.dataset.key))
  }
  return (
    <div className="queryList flex-column w-60">
      {selectors.map(element => (
        <div className="flex border justify-between" key={element.id}>
          <div className="">{element.psdSelector}</div>
          <button data-key={element.id} onClick={handleRemoveClick}>
            remove
          </button>
        </div>
      ))}

      <div className="flex border justify-between" onKeyDown={handleKeyPress}>
        <input
          type="text"
          className="grow shrink min-w-0"
          role="form"
          onChange={handleInputChange}
          value={input}
        ></input>
        <button
          onClick={handleAddClick}
          className="whitespace-nowrap border rounded"
        >
          add new
        </button>
      </div>
    </div>
  )
}
