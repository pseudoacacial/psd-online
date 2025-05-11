import { createSelector } from "@reduxjs/toolkit"

import {
  selectArtboards,
  selectDocument,
  selectElementsFlat,
} from "../slices/documentSlice"
import { selectQueries, Query } from "../slices/querySlice"
import { useAppSelector } from "../app/hooks"
import { selectSettings } from "../slices/settingsSlice"

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

export const selectMatchesByArtboard = createSelector(
  [selectMatches, selectArtboards, selectElementsFlat, selectSettings],
  (matches, artboards, elements, settings) => {
    const matchesByArtboard: { [key: string]: Match[] } = {}

    try {
      const groupNameRegex = new RegExp(settings.groupNameRegex)

      artboards.forEach(artboard => {
        const artboardMatch = artboard.name.match(groupNameRegex)
        if (artboardMatch) {
          // matchesByArtboard[artboard.id] = []
          matchesByArtboard[artboardMatch[1]] = []
        }
      })

      matches.forEach(match => {
        const psdElement = elements.find(
          element => element.id === match.documentId,
        )
        const artboard = artboards.find(
          artboard => artboard.id === psdElement?.artboardId,
        )

        const artboardMatch = artboard && artboard.name.match(groupNameRegex)

        artboardMatch &&
          //if match for this selector already exists in this artboard - don't add more
          !matchesByArtboard[artboardMatch[1]].find(
            e => e.selectorId === match.selectorId,
          ) &&
          matchesByArtboard[artboardMatch[1]].push(match)
      })
      return matchesByArtboard
    } catch (e) {
      if (e instanceof Error) {
        console.log("Problem with the group name regex:", e.message)
      } else {
        console.log(e)
      }
      return matchesByArtboard
    }
  },
)
