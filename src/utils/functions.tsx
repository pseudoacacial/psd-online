export const objectFilter = <T extends object>(
  obj: T,
  predicate: <K extends keyof T>(value: T[K], key: K) => boolean,
) => {
  const result: { [K in keyof T]?: T[K] } = {}
  ;(Object.keys(obj) as Array<keyof T>).forEach(name => {
    if (predicate(obj[name], name)) {
      result[name] = obj[name]
    }
  })
  return result
}

export const cropBase64Image = async (
  base64: string,
  rect: { top: number; left: number; width: number; height: number },
): Promise<string> => {
  return new Promise(resolve => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = rect.width
      canvas.height = rect.height
      const ctx = canvas.getContext("2d")
      if (ctx === null) {
        throw new Error("Failed to get 2D context")
      }
      ctx.drawImage(
        img,
        rect.left,
        rect.top,
        rect.width,
        rect.height,
        0,
        0,
        rect.width,
        rect.height,
      )
      const dataUrl = canvas.toDataURL("image/webp")      
      canvas.remove()
      resolve(dataUrl)
    }
    img.src = base64
  })
}
