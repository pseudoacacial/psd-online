import { readPsd } from "ag-psd"
import { useEffect } from "react"

export const FileInput = ({ handleFile }: FileInputProps) => {
  useEffect(() => {
    document
      .querySelector(".input")
      ?.addEventListener("change", function (event) {
        const file = event.target.files[0] // Get the selected file
        if (file) {
          const reader = new FileReader()

          reader.onload = function (e) {
            const arrayBuffer = e.target.result // This is the ArrayBuffer
            const psd = readPsd(arrayBuffer) // Output the ArrayBuffer
            // You can now use the arrayBuffer as needed
            handleFile(psd)
          }

          reader.onerror = function (e) {
            console.error("Error reading file", e)
          }

          reader.readAsArrayBuffer(file) // Read the file as an ArrayBuffer
        } else {
          console.log("No file selected")
        }
      })
  }, [])

  return <input className="input" type="file"></input>
}
