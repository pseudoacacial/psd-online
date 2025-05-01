import { useAppDispatch, useAppSelector } from "../../app/hooks"

import { useState, useEffect, useRef } from "react"

import { add, remove, modify, Query, QueryClass } from "../../slices/querySlice"

export interface QueryListItemProps {
  query: Query
  freeze?: boolean
}

export const QueryListItem = ({ query, freeze }: QueryListItemProps) => {
  const dispatch = useAppDispatch()

  //state is only used if freeze==true; Otherwise, each change dispatches a modify action
  const [newQuery, setNewQuery] = useState(query)

  const handlePsdNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (freeze) {
      setNewQuery({ ...newQuery, psdSelector: event.target.value })
    } else {
      dispatch(modify({ ...query, psdSelector: event.target.value }))
    }
  }
  const handleCssNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (freeze) {
      setNewQuery({ ...newQuery, cssSelector: event.target.value })
    } else {
      dispatch(modify({ ...query, cssSelector: event.target.value }))
    }
  }

  const handleAddClick = () => {
    if (newQuery === null) throw new Error("trying to a null query")
    dispatch(add(newQuery))
    setNewQuery(new QueryClass(self.crypto.randomUUID()))
  }
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (freeze && event.key === "Enter") {
      handleAddClick()
    }
  }
  const handleRemoveClick = (e: React.BaseSyntheticEvent) => {
    dispatch(remove(query.id))
  }
  return (
    <div
      className="group flex flex-col border justify-between"
      key={query.id}
      data-key={query.id}
      onKeyDown={handleKeyPress}
    >
      <div className="flex justify-between">
        <input
          type="text"
          className="grow shrink min-w-0"
          role="form"
          onChange={handleCssNameChange}
          value={freeze ? newQuery?.cssSelector : query.cssSelector}
          placeholder="css name"
          aria-label="css name"
        ></input>
        <input
          type="text"
          className="grow shrink min-w-0"
          role="form"
          onChange={handlePsdNameChange}
          value={freeze ? newQuery?.psdSelector : query.psdSelector}
          placeholder="psd name"
          aria-label="psd name"
        ></input>
        {freeze ? (
          <button
            onClick={handleAddClick}
            className="whitespace-nowrap border rounded"
          >
            add new
          </button>
        ) : (
          <button onClick={handleRemoveClick}>remove</button>
        )}
      </div>
      <div className="hidden justify-evenly group-focus-within:flex">
        more options
      </div>
    </div>
  )
}
