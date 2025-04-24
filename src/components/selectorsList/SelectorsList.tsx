import { useAppDispatch, useAppSelector } from "../../app/hooks"

import { useState, useEffect } from "react"

import {
  add,
  remove,
  modify,
  selectSelectors,
  Selector,
} from "./selectorsSlice"

export const SelectorsList = () => {
  const dispatch = useAppDispatch()
  const selectors = useAppSelector(selectSelectors)

  const [input, setInput] = useState("")
  const [selectorSList, setSelectorsList] = useState<Selector[]>([])

  const handleInputChange = event => {
    setInput(event.target.value)
  }
  const handleAddClick = () => {
    dispatch(
      add({
        id: self.crypto.randomUUID(),
        cssSelector: input,
      }),
    )
  }
  const handleRemoveClick = e => {
    dispatch(remove(e.target.dataset.key))
  }
  return (
    <div className="selectorsList flex-column w-60">
      {selectors.selectors.map(element => (
        <div className="flex border justify-between" key={element.id}>
          <div className="">{element.cssSelector}</div>
          <button data-key={element.id} onClick={handleRemoveClick}>
            remove
          </button>
        </div>
      ))}
      <div className="flex border justify-between">
        <input
          type="text"
          className="grow shrink min-w-0"
          role="form"
          onChange={handleInputChange}
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
