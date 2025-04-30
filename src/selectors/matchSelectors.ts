import { createSelector } from "@reduxjs/toolkit"

import { selectDocument, selectElementsFlat } from "../slices/documentSlice"
import { selectQueries, Query } from "../slices/querySlice"

export interface Match {
  selectorId: string
  documentId: number
}

export const selectMatches = createSelector(
  [selectElementsFlat, selectQueries],
  (elements, selectors) => {
    const getMatches = (selector: Query) => {
      let matches: Match[] = []

      elements.forEach(element => {
        //if query is a path, search in path
        if (selector.psdSelector.includes(">")) {
          console.log(element.namePath.join(">"))
          if (element.namePath.join(">").match(selector.psdSelector)) {
            matches.push({
              selectorId: selector.id,
              documentId: element.id,
            })
          }
        } else {
          //search in name
          if (element.name.match(selector.psdSelector)) {
            matches.push({
              selectorId: selector.id,
              documentId: element.id,
            })
          }
        }
      })

      return matches
    }
    // Example logic: filter queries that match the current document ID

    return selectors.flatMap(selector => getMatches(selector))
  },
)
