import {
  selectMatches,
  selectMatchesByArtboard,
} from "../../selectors/matchSelectors"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { objectFilter } from "../../utils/functions"
import { selectElementsFlat } from "../../slices/documentSlice"
import { selectQueries } from "../../slices/querySlice"

export const Export = () => {
  const matches = useAppSelector(selectMatchesByArtboard)

  const elements = useAppSelector(selectElementsFlat)

  const queries = useAppSelector(selectQueries)

  const exportTable = queries.map(query => {
    const matchedGroups = objectFilter(
      matches,
      group => !!group.find(match => match.selectorId === query.id),
    )

    const matchedDocumentIdsWithGroup = Object.keys(matchedGroups)
      .map((groupName: keyof typeof matchedGroups) => ({
        groupName: groupName,
        documentId: matchedGroups[groupName]?.find(
          match => match.selectorId === query.id,
        )?.documentId,
      }))
      .filter(x => x !== undefined)

    const matchedImagesWithName = matchedDocumentIdsWithGroup
      .map((matchedDocumentIdWithGroup, id) => ({
        image: elements.find(
          element => element.id === matchedDocumentIdWithGroup.documentId,
        )?.canvas,
        name: matchedDocumentIdWithGroup.groupName,
      }))
      .filter(x => x !== undefined)

    return matchedImagesWithName
  })

  return (
    <div>
      Exports:
      {exportTable.map(matchedImagesWithGroup => (
        <div>
          {matchedImagesWithGroup.map(data => {
            return (
              <a
                className="border rounded p-1 m-1"
                download={`${data.name}.webp`}
                href={data.image}
              >
                X
              </a>
            )
          })}
        </div>
      ))}
    </div>
  )
}
