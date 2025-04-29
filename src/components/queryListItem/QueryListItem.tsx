import { useAppDispatch, useAppSelector } from "../../app/hooks"

import { useState, useEffect } from "react"

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
    <div className="flex border justify-between" key={query.id}>
      <div className="">{query.psdSelector}</div>
      <button data-key={query.id} onClick={handleRemoveClick}>
        remove
      </button>
    </div>
  )
}
