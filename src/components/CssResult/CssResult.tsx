import { useEffect, useState } from "react"
import { useAppSelector } from "../../app/hooks"
import { selectMatches, Match } from "../../selectors/matchSelectors"
import { selectArtboards, selectElementsFlat } from "../../slices/documentSlice"
import { selectQueries } from "../../slices/querySlice"

export const CssResult = () => {
  const matches = useAppSelector(selectMatches)
  const elements = useAppSelector(selectElementsFlat)
  const artboards = useAppSelector(selectArtboards)
  const queries = useAppSelector(selectQueries)

  const [CssResult, setCssResult] = useState("")

  const getMatchCss = (match: Match) => {
    let matchCss = ""
    const query = queries.find(query => query.id === match.selectorId)
    const psdElement = elements.find(element => element.id === match.documentId)
    //add css name
    matchCss +=
      `${query?.cssSelector}` +
      " {\n" +
      `left: ${psdElement?.rect?.left}px;\n` +
      `top: ${psdElement?.rect?.top}px;\n` +
      "}\n"

    return matchCss
  }

  const groupMatchesByArtboard = () => {
    const matchesByArtboard = {}
    artboards.forEach(artboard => {
      matchesByArtboard[artboard.id] = []
    })
    matches.forEach(match => {
      const psdElement = elements.find(
        element => element.id === match.documentId,
      )
      psdElement && matchesByArtboard[psdElement.artboardId].push(match)
    })
    return matchesByArtboard
  }
  useEffect(() => {
    // setCssResult()
    let cssResult = ""
    for (const [key, value] of Object.entries(groupMatchesByArtboard())) {
      const artboard = artboards.find(artboard => artboard.id === parseInt(key))
      cssResult +=
        `${artboard?.name} {\n` +
        value.map(match => getMatchCss(match)).join("\n") +
        "}\n"
    }
    setCssResult(cssResult)
    // artboards.map(),
    // matches.map(match => getMatchCss(match)).join("\n")
    // setCssResult(matches.map(match => getMatchCss(match)).join("\n"))
  }, [matches])
  return (
    <div className="CssResult">
      <textarea className="border" value={CssResult}></textarea>
    </div>
  )
}
