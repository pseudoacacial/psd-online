import { useEffect, useState } from "react"
import { useAppSelector } from "../../app/hooks"
import { selectMatchesByArtboard } from "../../selectors/matchSelectors"
import { selectArtboards, selectElementsFlat } from "../../slices/documentSlice"
import { selectQueries } from "../../slices/querySlice"
import {
  composeGroupCanvas,
  cropBase64Image,
  objectFilter,
} from "../../utils/functions"

export const Export = () => {
  const matches = useAppSelector(selectMatchesByArtboard)
  const elements = useAppSelector(selectElementsFlat)
  const queries = useAppSelector(selectQueries)
  const artboards = useAppSelector(selectArtboards)

  const [exportTable, setExportTable] = useState<
    { image: string; name: string }[][]
  >([])

  useEffect(() => {
    const processExports = async () => {
      const allExports = await Promise.all(
        queries
          .filter(query => query.export)
          .map(async query => {
            const matchedGroups = objectFilter(
              matches,
              group => !!group.find(match => match.selectorId === query.id),
            )

            const matchedDocumentIdsWithGroup = Object.keys(matchedGroups)
              .map(groupName => ({
                groupName,
                documentId: matchedGroups[groupName]?.filter(
                  match => match.selectorId === query.id,
                )[query.matchIndex]?.documentId,
              }))
              .filter(x => x?.documentId)

            const processedImages = await Promise.all(
              matchedDocumentIdsWithGroup.map(
                async ({ documentId, groupName }) => {
                  const element = elements.find(e => e.id === documentId)
                  const artboard = artboards.find(
                    ab => ab.id === element?.artboardId,
                  )

                  // if (!element?.canvas || !artboard) return undefined

                  let image: string | undefined = undefined
                  if (element?.type === "layer" && element.canvas) {
                    image = element.canvas
                  } else if (element?.type === "group") {
                    try {
                      image = await composeGroupCanvas(element, elements)
                    } catch (e) {
                      image = undefined
                    }
                  }
                  if (!image || !artboard) return undefined

                  if (query.exportCrop === true && artboard.rect) {
                    const { top, left, right, bottom } = artboard.rect
                    if (
                      top !== undefined &&
                      left !== undefined &&
                      right !== undefined &&
                      bottom !== undefined &&
                      element.rect.top !== undefined &&
                      element.rect.left !== undefined
                    ) {
                      const cropped = await cropBase64Image(image, {
                        top: top - element.rect.top,
                        left: left - element.rect.left,
                        width: right - left,
                        height: bottom - top,
                      })
                      image = cropped
                    }
                  }

                  return {
                    image,
                    name: `${query.exportName ? query.exportName + "_" : ""}${groupName}`,
                  }
                },
              ),
            )

            return processedImages.filter(Boolean) as {
              image: string
              name: string
            }[]
          }),
      )
      setExportTable(allExports)
    }

    processExports()
  }, [queries, matches, elements, artboards])

  return (
    <div>
      Exports:
      {exportTable.map((matchedImagesWithGroup, i) => (
        <div className="flex flex-wrap" key={i}>
          {matchedImagesWithGroup.map((data, j) => (
            <a
              key={j}
              className="border border-main rounded p-1 m-1"
              download={`${data.name}.webp`}
              href={data.image}
            >
              {data.name}
            </a>
          ))}
        </div>
      ))}
    </div>
  )
}
