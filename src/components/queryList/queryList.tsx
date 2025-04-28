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

  const [cssName, setCssName] = useState("")
  const [psdName, setPsdName] = useState("")

  const handlePsdNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPsdName(event.target.value)
  }
  const handleCssNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCssName(event.target.value)
  }
  const handleAddClick = () => {
    dispatch(
      add({
        id: self.crypto.randomUUID(),
        psdSelector: psdName,
        cssSelector: cssName,
      }),
    )
    setCssName("")
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
    <div className="queryList flex-column w-80">
      {selectors.map(element => (
        <div className="flex border justify-between" key={element.id}>
          <div className="">{element.psdSelector}</div>
          <button data-key={element.id} onClick={handleRemoveClick}>
            remove
          </button>
        </div>
      ))}

      <div
        className="flex border justify-between gap-2"
        onKeyDown={handleKeyPress}
      >
        <input
          type="text"
          className="grow shrink min-w-0"
          role="form"
          onChange={handleCssNameChange}
          value={cssName}
          placeholder="css name"
          aria-label="css name"
        ></input>
        <input
          type="text"
          className="grow shrink min-w-0"
          role="form"
          onChange={handlePsdNameChange}
          value={psdName}
          placeholder="psd name"
          aria-label="psd name"
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
