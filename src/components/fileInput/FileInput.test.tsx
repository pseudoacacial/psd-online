import { renderWithProviders } from "../../utils/test-utils"
import { FileInput } from "./FileInput"
import userEvent from "@testing-library/user-event"
import { screen } from "@testing-library/dom"

describe(FileInput, () => {
  it("allows upload", async () => {
    const user = userEvent.setup()

    renderWithProviders(<FileInput></FileInput>)

    const file = new File(["hello"], "hello.png", { type: "image/png" })

    const input = screen.getByLabelText(/file/i) as HTMLInputElement
    await user.upload(input, file)

    expect(input.files?.[0]).toBe(file)
    expect(input.files?.item(0)).toBe(file)
    expect(input.files).toHaveLength(1)
  })
})
