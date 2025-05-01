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

  const changeQueryValue = (key: keyof Query, value: Query[keyof Query]) => {
    if (freeze) {
      setNewQuery({ ...newQuery, [key]: value })
    } else {
      dispatch(modify({ ...query, [key]: value }))
    }
  }

  const readQuery = freeze ? newQuery : query

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
          onChange={event => {
            changeQueryValue("cssSelector", event?.target.value)
          }}
          value={readQuery.cssSelector}
          placeholder="css name"
          aria-label="css name"
        ></input>
        <input
          type="text"
          className="grow shrink min-w-0"
          role="form"
          onChange={event => {
            changeQueryValue("psdSelector", event?.target.value)
          }}
          value={readQuery.psdSelector}
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
        <div className="flex justify-start">
          <div>
            <input
              type="checkbox"
              id="size"
              checked={readQuery.showSize}
              onChange={event => {
                changeQueryValue("showSize", event.target.checked)
              }}
            ></input>
            <label htmlFor="size">Size</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="position"
              checked={readQuery.showPosition}
              onChange={event => {
                changeQueryValue("showPosition", event.target.checked)
              }}
            ></input>
            <label htmlFor="position">Position</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="size"
              checked={readQuery.showFontSize}
              onChange={event => {
                changeQueryValue("showFontSize", event.target.checked)
              }}
            ></input>
            <label htmlFor="size">font-size</label>
          </div>
        </div>
      </div>
    </div>
  )
}
