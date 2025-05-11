import { useAppDispatch, useAppSelector } from "../../app/hooks"

import { useState, useEffect } from "react"

import {
  addQuery,
  remove,
  modify,
  reset,
  selectQueries,
  Query,
  QueryClass,
} from "../../slices/querySlice"
import { QueryListItem } from "../queryListItem/QueryListItem"

export const QueryList = () => {
  const selectors = useAppSelector(selectQueries)
  const dispatch = useAppDispatch()

  const handleExportQueriesToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(selectors))
  }
  const handleImportQueriesFromClipboard = () => {
    dispatch(reset())
    navigator.clipboard
      .readText()
      .then(res => JSON.parse(res))
      .then((res: Query[]) => {
        res.forEach(query => {
          dispatch(addQuery(query))
        })
      })
  }

  return (
    <div>
      <div className="flex justify-center">
        <button
          className="border hover:bg-bg1 transition-colors border-main rounded mx-1 px-1 max-w-28 leading-tight"
          onClick={handleImportQueriesFromClipboard}
        >
          import from clipboard
        </button>
        <button
          className="border hover:bg-bg1 transition-colors border-main rounded mx- px-1 max-w-28 leading-tight"
          onClick={handleExportQueriesToClipboard}
        >
          export to clipboard
        </button>
      </div>
      <div className="queryList flex-column w-full">
        {selectors.map(element => (
          <QueryListItem key={element.id} query={element}></QueryListItem>
        ))}

        <QueryListItem
          query={new QueryClass().query}
          freeze={true}
        ></QueryListItem>
      </div>
    </div>
  )
}
