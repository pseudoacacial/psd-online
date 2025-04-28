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
      "}"

    return matchCss
  }

  useEffect(() => {
    setCssResult(matches.map(match => getMatchCss(match)).join("\n"))
  }, [matches])
  return (
    <div className="CssResult">
      <textarea className="border" value={CssResult}></textarea>
    </div>
  )
}
