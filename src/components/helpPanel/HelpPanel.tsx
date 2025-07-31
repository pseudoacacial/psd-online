import { useState } from "react"
import { TbArrowsLeft, TbArrowsRight } from "react-icons/tb"

export const HelpPanel = () => {
  const [open, setOpen] = useState(true)
  const handleCloseClick = () => {
    setOpen(!open)
  }
  return (
    <div className="flex flex-col w-auto transition-[width]">
      <div
        className="bg-bg-2 flex size-5 justify-center items-center cursor-pointer rounded"
        onClick={handleCloseClick}
        title={open ? "hide" : "tips"}
      >
        {open ? <TbArrowsRight /> : <TbArrowsLeft />}
      </div>
      <div className={`max-w-56 ${open ? "block" : "hidden"}`}>
        <h2>tips:</h2>
        <ul>
          <li>- left click to add a query for the hovered layer</li>
          <li>- click on the query on the list (left) to show more options</li>
          <li>
            - css name needs to be filled in for the query to show up in
            resulting SCSS
          </li>
          <li>- ctrl click to dig through layers</li>
          <li>- shift click to undig</li>
        </ul>
      </div>
    </div>
  )
}
