import { useAppDispatch, useAppSelector } from "../../app/hooks"

import { useState, useEffect } from "react"

import {
  add,
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
  const handleImportQueriesfromClipboard = () => {
    dispatch(reset())
    navigator.clipboard
      .readText()
      .then(res => JSON.parse(res))
      .then((res: Query[]) => {
        res.forEach(query => {
          dispatch(add(query))
        })
      })
  }

  return (
    <div>
      <div className="flex justify-center">
        <button
          className="border rounded mx-1 mb-2 px-1 max-w-28 leading-tight"
          onClick={handleImportQueriesfromClipboard}
        >
          import from clipboard
        </button>
        <button
          className="border rounded mx-1 mb-2 px-1 max-w-28 leading-tight"
          onClick={handleExportQueriesToClipboard}
        >
          export to clipboard
        </button>
      </div>
      <div className="queryList flex-column w-80">
        {selectors.map(element => (
          <QueryListItem key={element.id} query={element}></QueryListItem>
        ))}

        <QueryListItem
          query={new QueryClass(self.crypto.randomUUID())}
          freeze={true}
        ></QueryListItem>
      </div>
    </div>
  )
}
