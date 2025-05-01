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

  const groupNameRegex = /(\d+x\d+)/

  const getMatchCss = (match: Match) => {
    const query = queries.find(query => query.id === match.selectorId)
    const psdElement = elements.find(element => element.id === match.documentId)
    if (psdElement === undefined)
      throw new Error(
        "the psd element for the match doesn't exist in store. Matches and document out of sync?",
      )
    const artboard = artboards.find(
      artboard => artboard.id === psdElement?.artboardId,
    )

    let style: React.CSSProperties = {}

    //only add styles if CSS name is specified
    if (query?.cssSelector) {
      if (query.showPosition && psdElement.rect.left && psdElement.rect.top) {
        if (artboard !== undefined && artboard.rect.left && artboard.rect.top) {
          style.left = psdElement.rect.left - artboard.rect.left
          style.top = psdElement.rect.top - artboard.rect.top
        } else {
          style.left = psdElement.rect.left
          style.top = psdElement.rect.top
        }
      }
      if (
        query.showSize &&
        psdElement.rect.right &&
        psdElement.rect.left &&
        psdElement.rect.bottom &&
        psdElement.rect.top
      ) {
        style.width = psdElement.rect.right - psdElement.rect.left
        style.height = psdElement.rect.bottom - psdElement.rect.top
      }
    }

    const regex = new RegExp(/[A-Z]/g)
    const kebabCase = (str: string) =>
      str.replace(regex, v => `-${v.toLowerCase()}`)

    const matchCss =
      `\u0020\u0020${query?.cssSelector}` +
      " {\n" +
      Object.keys(style).reduce((accumulator, key) => {
        const cssKey = kebabCase(key)
        const cssValue = style[key as keyof typeof style]
        return `${accumulator}\u0020\u0020\u0020\u0020${cssKey}:${cssValue};\n`
      }, "") +
      "\u0020\u0020}\n"
    return matchCss
  }

  const groupMatchesByArtboard = () => {
    const matchesByArtboard: { [key: string]: Match[] } = {}
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
      artboardMatch && matchesByArtboard[artboardMatch[1]].push(match)
    })
    return matchesByArtboard
  }
  useEffect(() => {
    // setCssResult()
    let cssResult = ""
    for (const [key, value] of Object.entries(groupMatchesByArtboard())) {
      cssResult +=
        `${key} {\n` + value.map(match => getMatchCss(match)).join("") + "}\n"
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
