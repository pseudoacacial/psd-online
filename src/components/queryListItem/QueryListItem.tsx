import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { objectFilter } from "../../utils/functions";

import { useState } from "react";

import {
  selectMatchesByArtboard
} from "../../selectors/matchSelectors";
import { selectElementsFlat } from "../../slices/documentSlice";
import type {
  Query
} from "../../slices/querySlice";
import {
  addQuery,
  modify,
  QueryClass,
  remove,
} from "../../slices/querySlice";
import { QueryListItemInput } from "../queryListItemInput/QueryListItemInput";
import { QueryListItemToggle } from "../queryListItemToggle/QueryListItemToggle";

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

  const [open, setOpen] = useState(false)

  const changeQueryValue = (key: keyof Query, value: Query[keyof Query]) => {
    const escapeRegex = (query: Query[keyof Query]) => {
      const REGEXP_SPECIAL_CHAR = /[\(\)]/g

      return typeof query === "string"
        ? query.replace(REGEXP_SPECIAL_CHAR, String.fromCharCode(92) + "$&")
        : value
    }

    if (freeze) {
      setNewQuery({ ...newQuery, [key]: escapeRegex(value) })
    } else {
      dispatch(modify({ ...query, [key]: escapeRegex(value) }))
    }
  }

  const readQuery = freeze ? newQuery : query

  // const readQuery = (key: keyof Query) => {
  const unescapeRegex = (value: string): any => {
    const REGEXP_SPECIAL_CHAR = /\\([\(\)])/g
    return typeof value === "string"
      ? value.replace(REGEXP_SPECIAL_CHAR, "$1")
      : value
  }

  // }

  const handleAddClick = () => {
    if (newQuery === null) throw new Error("trying to a null query")
    dispatch(addQuery(newQuery))
    setNewQuery(new QueryClass().query)
  }
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (freeze && event.key === "Enter") {
      handleAddClick()
    }
  }
  const handleRemoveClick = (e: React.BaseSyntheticEvent) => {
    dispatch(remove(query.id))
  }
  const handleFocus = () => {
    setOpen(true)
  }
  const handleBlur = (event: React.FocusEvent) => {
    //only blur if focus goes to somewhere outside of the element
    if (
      event.currentTarget.contains(event.relatedTarget) ||
      event.currentTarget === event.relatedTarget
    )
      return
    setOpen(false)
  }

  const matchedGroups = objectFilter(
    matches,
    group => !!group.find(match => match.selectorId === query.id),
  )
  const matchedElementIds = Object.keys(matchedGroups).flatMap(key => {
    const matchedElements = matchedGroups[key]?.filter(
      match => match.selectorId === readQuery.id,
    )
    if (matchedElements === undefined) return
    if (
      readQuery.matchIndex > 0 &&
      matchedElements.length > readQuery.matchIndex
    )
      return matchedElements[readQuery.matchIndex].documentId
    return matchedElements[0].documentId
  })
  return (
    <div
      className="flex flex-col border border-main rounded justify-between my-1"
      key={query.id}
      data-key={query.id}
      onKeyDown={handleKeyPress}
      onFocus={handleFocus}
      onBlur={handleBlur}
      data-testid="queryListItem"
    >
      <div className="flex justify-between">
        <QueryListItemInput
          readQuery={readQuery}
          changeQueryValue={changeQueryValue}
          queryKey="cssSelector"
          placeholder="css name"
          className="grow shrink min-w-0 rounded-l pl-1"
        />
        <QueryListItemInput
          readQuery={readQuery}
          changeQueryValue={changeQueryValue}
          queryKey="psdSelector"
          placeholder="psd name"
          transform={unescapeRegex}
        />
        {freeze ? (
          <button
            onClick={handleAddClick}
            className="whitespace-nowrap px-1 hover:bg-bg1 transition-colors rounded-r"
          >
            add new
          </button>
        ) : (
          <button onClick={handleRemoveClick}>remove</button>
        )}
      </div>
      {open ? (
        <div className="justify-evenly flex flex-col ">
          {freeze ?? (
            <style>
              {matchedElementIds.map(
                id =>
                  `.element[data-id="${id}"] {outline: 2px solid rebeccapurple; background: rgba(0,0,0,0.5)}`,
              )}
            </style>
          )}
          <div className="flex justify-start w-full flex-wrap">
            <QueryListItemToggle readQuery={readQuery} changeQueryValue={changeQueryValue} label="Size" queryKey="showSize" />
            <QueryListItemToggle readQuery={readQuery} changeQueryValue={changeQueryValue} label="Position" queryKey="showPosition" />
            <QueryListItemToggle readQuery={readQuery} changeQueryValue={changeQueryValue} label="font-size" queryKey="showFontSize" />
            <QueryListItemToggle readQuery={readQuery} changeQueryValue={changeQueryValue} label="export" queryKey="export" />
            <QueryListItemToggle readQuery={readQuery} changeQueryValue={changeQueryValue} label="frame" queryKey="frame" />
            <div className="mx-1">
              <QueryListItemInput
                readQuery={readQuery}
                changeQueryValue={changeQueryValue}
                queryKey="matchIndex"
                placeholder="match index"
                type="number"
                className="grow shrink min-w-0 w-8 rounded-l pl-1"
              />
            </div>
            {freeze || (
              <div className="mx-1 text-right">
                <label htmlFor="match-number">found:</label>
                <span data-testid="match number" id="match-number">
                  {Object.keys(matchedGroups).length}
                </span>
                <div className="flex flex-wrap justify-end">
                  {Object.keys(matches).map(groupName => (
                    <div className="flex basis-1/3 justify-end" key={groupName}>
                      <div>{groupName}</div>
                      {matchedGroups[groupName] ? "✅" : "❌"}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {readQuery.frame && (
              <div className="flex justify-between">
                <QueryListItemInput
                  readQuery={readQuery}
                  changeQueryValue={changeQueryValue}
                  queryKey="framePsdSelector"
                  placeholder="frame psd name"
                  className="grow shrink min-w-0 rounded-l pl-1"
                />
              </div>
            )}
            {readQuery.export && (
              <div className="flex justify-between">
                <input
                  type="text"
                  className="grow shrink min-w-0 rounded-l pl-1"
                  role="form"
                  onChange={event => {
                    changeQueryValue("exportName", event?.target.value)
                  }}
                  value={readQuery.exportName}
                  placeholder="export name"
                  aria-label="export name"
                ></input>
                <div className="mx-1">
                  <input
                    type="checkbox"
                    id="exportCrop"
                    checked={readQuery.exportCrop}
                    onChange={event => {
                      changeQueryValue("exportCrop", event.target.checked)
                    }}
                  ></input>
                  <label htmlFor="exportCrop">crop</label>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  )
}
