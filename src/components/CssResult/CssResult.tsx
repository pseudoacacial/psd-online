import { useEffect, useState } from "react"
import { useAppSelector } from "../../app/hooks"
import {
  selectMatches,
  selectMatchesByArtboard,
  Match,
} from "../../selectors/matchSelectors"
import { selectArtboards, selectElementsFlat } from "../../slices/documentSlice"
import { selectQueries } from "../../slices/querySlice"

export const CssResult = () => {
  const matches = useAppSelector(selectMatches)
  const matchesByArtboard = useAppSelector(selectMatchesByArtboard)
  const elements = useAppSelector(selectElementsFlat)
  const artboards = useAppSelector(selectArtboards)
  const queries = useAppSelector(selectQueries)

  const [CssResult, setCssResult] = useState("")

  const prefix = ".b"

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
      if (
        query.showPosition &&
        psdElement.rect.left !== undefined &&
        psdElement.rect.top !== undefined
      ) {
        if (
          artboard !== undefined &&
          artboard.rect.left !== undefined &&
          artboard.rect.top !== undefined
        ) {
          style.left = psdElement.rect.left - artboard.rect.left + "px"
          style.top = psdElement.rect.top - artboard.rect.top + "px"
        } else {
          style.left = psdElement.rect.left + "px"
          style.top = psdElement.rect.top + "px"
        }
      }
      if (
        query.showSize &&
        psdElement.rect.right &&
        psdElement.rect.left &&
        psdElement.rect.bottom &&
        psdElement.rect.top
      ) {
        style.width = psdElement.rect.right - psdElement.rect.left + "px"
        style.height = psdElement.rect.bottom - psdElement.rect.top + "px"
      }
      if (query.showFontSize && psdElement.text?.style?.fontSize) {
        style.fontSize = psdElement.text?.style?.fontSize + "px"
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

  useEffect(() => {
    // setCssResult()
    let cssResult = ""
    for (const [key, value] of Object.entries(matchesByArtboard)) {
      cssResult +=
        `${prefix}${key} {\n` +
        value.map(match => getMatchCss(match)).join("") +
        "}\n"
    }
    setCssResult(cssResult)
    // artboards.map(),
    // matches.map(match => getMatchCss(match)).join("\n")
    // setCssResult(matches.map(match => getMatchCss(match)).join("\n"))
  }, [matches])
  return (
    <div className="CssResult my-2">
      <textarea className="border w-full h-80" value={CssResult}></textarea>
    </div>
  )
}
