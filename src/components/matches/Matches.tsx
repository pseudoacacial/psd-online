import { selectSelectors, Selector } from "../../slices/selectorsSlice"
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
        <div className="">{element.documentId}</div>
      ))}
    </div>
  )
}
