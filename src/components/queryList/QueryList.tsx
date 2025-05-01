import { useAppDispatch, useAppSelector } from "../../app/hooks"

import { useState, useEffect } from "react"

import {
  add,
  remove,
  modify,
  selectQueries,
  Query,
  QueryClass,
} from "../../slices/querySlice"
import { QueryListItem } from "../queryListItem/QueryListItem"

export const QueryList = () => {
  const selectors = useAppSelector(selectQueries)

  return (
    <div className="queryList flex-column w-80">
      {selectors.map(element => (
        <QueryListItem key={element.id} query={element}></QueryListItem>
      ))}

      <QueryListItem
        query={new QueryClass(self.crypto.randomUUID())}
        freeze={true}
      ></QueryListItem>
    </div>
  )
}
