import { useEffect, useState } from "react"
import { useAppSelector } from "../../app/hooks"
import type { Match } from "../../selectors/matchSelectors"
import {
  selectMatches,
  selectMatchesByArtboardAndQuery,
} from "../../selectors/matchSelectors"
import { selectArtboards, selectElementsFlat } from "../../slices/documentSlice"
import { selectQueries } from "../../slices/querySlice"
import { selectSettings } from "../../slices/settingsSlice"

export const CssResult = () => {
  const matches = useAppSelector(selectMatches)
  const matchesByArtboardAndQuery = useAppSelector(
    selectMatchesByArtboardAndQuery,
  )
  const elements = useAppSelector(selectElementsFlat)
  const artboards = useAppSelector(selectArtboards)
  const queries = useAppSelector(selectQueries)
  const settings = useAppSelector(selectSettings)

  const [CssResult, setCssResult] = useState("")

  const prefix = settings.prefix

  const getMatchCss = (match: Match, scale: number) => {
    const query = queries.find(query => query.id === match.selectorId)
    const psdElement = elements.filter(
      element => element.id === match.documentId,
    )[0]
    if (psdElement === undefined)
      throw new Error(
        "the psd element for the match doesn't exist in store. Matches and document out of sync?",
      )
    const artboard = match.frameId
      ? elements.find(
          element => element.id.toString() === match.frameId?.toString(),
        )
      : artboards.find(artboard => artboard.id === psdElement?.artboardId)

    let style: React.CSSProperties = {}

    //only add styles if CSS name is specified
    if (!query?.cssSelector) return
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
        style.left = (psdElement.rect.left - artboard.rect.left) * scale + "px"
        style.top = (psdElement.rect.top - artboard.rect.top) * scale + "px"
      } else {
        style.left = psdElement.rect.left * scale + "px"
        style.top = psdElement.rect.top * scale + "px"
      }
    }

    console.log(psdElement.rect, scale)
    if (
      query.showSize &&
      [
        psdElement.rect.right,
        psdElement.rect.left,
        psdElement.rect.bottom,
        psdElement.rect.top,
      ].every(Number.isFinite)
    ) {
      style.width =
        (psdElement.rect.right - psdElement.rect.left) * scale + "px"
      style.height =
        (psdElement.rect.bottom - psdElement.rect.top) * scale + "px"
    }
    if (query.showFontSize && psdElement.text?.style?.fontSize) {
      style.fontSize =
        (
          psdElement.text?.style?.fontSize *
          ((psdElement.text.transform && psdElement.text.transform[3]) || 1) *
          settings.scale
        ).toFixed(2) + "px"
    }
    console.log(
      style,
      query.showSize,
      psdElement.rect.right,
      psdElement.rect.left,
      psdElement.rect.bottom,
      psdElement.rect.top,
    )

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
    // for (const [key, value] of Object.entries(matchesByArtboard)) {
    //   cssResult +=
    //     `${prefix}${key} {\n` +
    //     value.map(match => getMatchCss(match)).join("") +
    //     "}\n"
    // }

    for (const [key, value] of Object.entries(matchesByArtboardAndQuery)) {
      cssResult +=
        `${prefix}${key} {\n` +
        Object.values(value)
          .map(match => match && getMatchCss(match, settings.scale))
          // .map(
          //   match =>
          //     match && String(match.documentId) + " " + String(match.frameId),
          // )
          .join("") +
        "}\n"
    }

    setCssResult(cssResult)
    // artboards.map(),
    // matches.map(match => getMatchCss(match)).join("\n")
    // setCssResult(matches.map(match => getMatchCss(match)).join("\n"))
  }, [matchesByArtboardAndQuery, settings.scale, settings.prefix])
  return (
    <div className="CssResult my-2">
      <textarea
        readOnly
        className="bg-bg-2 border border-main w-full h-80 pl-1"
        value={CssResult}
      ></textarea>
    </div>
  )
}
