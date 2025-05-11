import { useState, useEffect } from "react"
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi2"

export const DarkModeButton = () => {
  // const [browserDarkMode, setBrowserDarkMode] = useState(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
  const [darkMode, setDarkMode] = useState(
    window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches,
  )

  //listen for changes of preferred light/dark mode
  // useEffect(()=>{
  //   window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) { setBrowserDarkMode(e.matches)})
  // }, [])

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark")
    } else {
      document.body.classList.remove("dark")
    }
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <button
      onMouseDown={toggleDarkMode}
      className="cursor-pointer border-main border-2 rounded-full w-12 h-6 relative
    flex justify-between items-center p-[3px] "
    >
      <div className="rounded-full bg-main h-4/5 aspect-square border-slate-80 top-1/2 absolute transition-all duration-500  -translate-y-1/2 left-[2px] dark:left-[calc(100%-2px)] dark:-translate-x-full"></div>
      <HiOutlineMoon className="transition-all text-rose-100 mt-px" />
      <HiOutlineSun className="transition-all text-slate-800" />
    </button>
  )
}
