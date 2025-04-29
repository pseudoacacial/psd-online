import { useAppDispatch, useAppSelector } from "../../app/hooks"

import { useState, useEffect, useRef } from "react"

import {
  add,
  remove,
  modify,
  selectQueries,
  Query,
} from "../../slices/querySlice"

export interface QueryListItemProps {
  query: Query
}

export const QueryListItem = ({ query }: QueryListItemProps) => {
  const dispatch = useAppDispatch()

  const [cssName, setCssName] = useState<string | undefined>("")
  const [psdName, setPsdName] = useState("")

  useEffect(() => {
    setCssName(query.cssSelector)
    setPsdName(query.psdSelector)
  }, [])

  const handlePsdNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPsdName(event.target.value)
    dispatch(
      modify({
        id: query.id,
        psdSelector: event.target.value,
        cssSelector: cssName,
      }),
    )
  }
  const handleCssNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCssName(event.target.value)
    dispatch(
      modify({
        id: query.id,
        psdSelector: psdName,
        cssSelector: event.target.value,
      }),
    )
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
    dispatch(remove(query.id))
  }
  return (
    <div
      className="flex border justify-between"
      key={query.id}
      data-key={query.id}
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
      <button onClick={handleRemoveClick}>remove</button>
    </div>
  )
}
