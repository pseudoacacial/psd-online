import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { objectFilter } from "../../utils/functions"

import { useState, useEffect, useRef } from "react"

import {
  addQuery,
  remove,
  modify,
  Query,
  QueryClass,
} from "../../slices/querySlice"
import {
  selectMatches,
  selectMatchesByArtboard,
} from "../../selectors/matchSelectors"
import { selectElementsFlat } from "../../slices/documentSlice"
export interface QueryListItemProps {
  query: Query
  freeze?: boolean
}

export const QueryListItem = ({ query, freeze }: QueryListItemProps) => {
  const dispatch = useAppDispatch()

  const matches = useAppSelector(selectMatchesByArtboard)

  const elements = useAppSelector(selectElementsFlat)

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
    dispatch(addQuery(newQuery))
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

  const objectFilter = <T extends object>(
    obj: T,
    predicate: <K extends keyof T>(value: T[K], key: K) => boolean,
  ) => {
    const result: { [K in keyof T]?: T[K] } = {}
    ;(Object.keys(obj) as Array<keyof T>).forEach(name => {
      if (predicate(obj[name], name)) {
        result[name] = obj[name]
      }
    })
    return result
  }

  const matchedGroups = objectFilter(
    matches,
    group => !!group.find(match => match.selectorId === query.id),
  )
  return (
    <div
      className="group flex flex-col border justify-between"
      key={query.id}
      data-key={query.id}
      onKeyDown={handleKeyPress}
      data-testid="queryListItem"
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
        <div className="flex justify-start w-full">
          <div className="mx-1">
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
          <div className="mx-1">
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
          <div className="mx-1">
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
          <div className="mx-1">
            <label htmlFor="match-number">found:</label>
            <span data-testid="match number" id="match-number">
              {Object.keys(matchedGroups).length}
            </span>
            {Object.keys(matches).map(groupName => (
              <div className="flex">
                <div>{groupName}</div>
                {matchedGroups[groupName] ? "✅" : "❌"}
              </div>
            ))}
          </div>

          <div className="mx-1"></div>
        </div>
      </div>
    </div>
  )
}
