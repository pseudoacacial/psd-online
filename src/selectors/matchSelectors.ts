import { createSelector } from "@reduxjs/toolkit"

import {
  selectArtboards,
  selectDocument,
  selectElementsFlat,
} from "../slices/documentSlice"
import { selectQueries, Query } from "../slices/querySlice"
import { useAppSelector } from "../app/hooks"
import { selectSettings } from "../slices/settingsSlice"
import { match } from "assert"
import { group } from "console"

export interface Match {
  selectorId: string
  documentId: number
  frameId?: number
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

    const matchesWithoutFrames = selectors.flatMap(selector =>
      getMatches(selector),
    )

    const matchesWithFrames = matchesWithoutFrames.map(match => {
      const query = selectors.find(query => query.id === match.selectorId)
      const element = elements.find(element => element.id === match.documentId)

      if (query && query.frame && query.framePsdSelector) {
        return {
          ...match,
          frameId: getMatches({
            ...query,
            psdSelector: query.framePsdSelector,
          }).filter(match => {
            const frameElement = elements.find(
              element => element.id === match.documentId,
            )

            return element?.artboardId === frameElement?.artboardId
          })[0].documentId,
        }
      } else {
        return match
      }
    })

    return matchesWithFrames
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
          // !matchesByArtboard[artboardMatch[1]].find(
          //   e => e.selectorId === match.selectorId,
          // ) &&
          matchesByArtboard[artboardMatch[1]].push(match)
      })
      // console.table(matchesByArtboard)
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

export const selectMatchesByArtboardAndQuery = createSelector(
  [selectMatchesByArtboard, selectQueries],
  (groups, queries) => {
    const matchesByArtboardAndQuery: {
      [artboardId: string]: { [queryId: string]: Match }
    } = {}

    const groupNames = Object.keys(groups)

    const array = Object.entries(groups)

    //make groups
    groupNames.forEach(groupName => {
      matchesByArtboardAndQuery[groupName] = {}
      queries.forEach(query => {
        const matchesForTheQuery = groups[groupName].filter(
          match => match.selectorId === query.id,
        )

        matchesByArtboardAndQuery[groupName][query.id] =
          query.matchIndex > 0 && matchesForTheQuery.length > query.matchIndex
            ? matchesForTheQuery[query.matchIndex]
            : matchesForTheQuery[0]
      })
    })
    return matchesByArtboardAndQuery
  },
)
