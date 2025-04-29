import { selectQueries, Query } from "../../slices/querySlice"
import { selectDocument, selectElements } from "../../slices/documentSlice"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { selectMatches } from "../../selectors/matchSelectors"

import { useEffect, useState } from "react"

export const Matches = () => {
  const matches = useAppSelector(selectMatches)

  return (
    <div>
      Matches:
      {matches.map(element => (
        <div className="" key={`${element.selectorId}-${element.documentId}`}>
          {element.documentId}
        </div>
      ))}
    </div>
  )
}
