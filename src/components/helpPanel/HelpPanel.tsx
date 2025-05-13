import { useState } from "react"
import { TbArrowsRight, TbArrowsLeft } from "react-icons/tb"

export const HelpPanel = () => {
  const [open, setOpen] = useState(true)
  const handleCloseClick = () => {
    setOpen(!open)
  }
  return (
    <div className="flex flex-col w-auto transition-[width]">
      <div
        className="bg-bg-1 flex size-5 justify-center items-center cursor-pointer rounded"
        onClick={handleCloseClick}
        title={open ? "hide" : "tips"}
      >
        {open ? <TbArrowsRight /> : <TbArrowsLeft />}
      </div>
      <div className={`max-w-56 ${open ? "block" : "hidden"}`}>
        <h2>tips:</h2>
        <ul>
          <li>- left click to add a query for the hovered layer</li>
          <li>- ctrl click to dig through layers</li>
          <li>- shift click to undig</li>
        </ul>
      </div>
    </div>
  )
}
