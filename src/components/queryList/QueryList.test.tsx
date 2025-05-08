import { renderWithProviders } from "../../utils/test-utils"
import userEvent from "@testing-library/user-event"
import { screen } from "@testing-library/dom"
import { QueryList } from "./QueryList"

describe(QueryList, () => {
  it("allows adding new query", async () => {
    const { user } = renderWithProviders(<QueryList></QueryList>)
    await user.click(screen.getByRole("button", { name: /add/i }))
    expect(screen.getAllByTestId("queryListItem")).toHaveLength(2)
  })

  it("allows removing query", async () => {
    const { user } = renderWithProviders(<QueryList></QueryList>)
    await user.click(screen.getByRole("button", { name: /add/i }))
    await user.click(screen.getByRole("button", { name: /remove/i }))
    expect(screen.getAllByTestId("queryListItem")).toHaveLength(1)
  })

  it("allows exporting", async () => {
    const { user } = renderWithProviders(<QueryList></QueryList>)
    let cssNameInput = screen.getByPlaceholderText(
      /css name/i,
    ) as HTMLInputElement
    let psdNameInput = screen.getByPlaceholderText(
      /psd name/i,
    ) as HTMLInputElement
    const rand1 = self.crypto.randomUUID()
    const rand2 = self.crypto.randomUUID()
    await user.type(cssNameInput, rand1)
    await user.type(psdNameInput, rand2)
    await user.click(screen.getByRole("button", { name: /add/i }))
    await user.click(screen.getByRole("button", { name: /export/i }))

    expect((await navigator.clipboard.readText()).toString()).toMatch(
      new RegExp(rand1),
    )
    expect((await navigator.clipboard.readText()).toString()).toMatch(
      new RegExp(rand2),
    )
  })

  it("allows importing", async () => {
    const { user } = renderWithProviders(<QueryList></QueryList>)
    const importedString =
      '[{"id":"c5eeebe7-83b0-49e5-8695-35603fd60c59","cssSelector":".logo","psdSelector":"logo","showPosition":true,"showSize":true,"showFontSize":true},{"id":"28fbc628-7c22-4396-af2d-6a492362bee0","cssSelector":".offer","psdSelector":"offer","showPosition":false,"showSize":true,"showFontSize":false}]'
    await navigator.clipboard.writeText(importedString)
    await user.click(screen.getByRole("button", { name: /import/i }))
    expect(screen.getAllByTestId("queryListItem")).toHaveLength(3)
    expect(screen.getAllByDisplayValue(/offer/i)).toHaveLength(2)
  })
})
