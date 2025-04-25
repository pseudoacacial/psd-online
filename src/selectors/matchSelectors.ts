import { createSelector } from "@reduxjs/toolkit"

import { selectDocument } from "../slices/documentSlice"
import { selectQueries, Query } from "../slices/querySlice"

interface Match {
  selectorId: string
  documentId: number
}

export const selectMatches = createSelector(
  [selectDocument, selectQueries],
  (document, selectors) => {
    const getMatches = (selector: Query) => {
      let matches: Match[] = []

      document.elements.forEach(element => {
        if (element.name.match(selector.psdSelector)) {
          matches.push({
            selectorId: selector.id,
            documentId: element.id,
          })
        }
      })

      return matches
    }
    // Example logic: filter queries that match the current document ID

    return selectors.flatMap(selector => getMatches(selector))
  },
)
