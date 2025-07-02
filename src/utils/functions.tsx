import type { PsdObject } from "../slices/documentSlice"

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

// Compose all descendant layer canvases of a group into a single base64 image
export const composeGroupCanvas = async (group: PsdObject): Promise<string> => {
  // Helper to recursively collect all descendant layers
  const collectLayers = (obj: PsdObject): PsdObject[] => {
    if (obj.type === "layer" && obj.canvas) {
      return [obj]
    }
    let layers: PsdObject[] = []
    for (const child of obj.children) {
      layers = layers.concat(collectLayers(child))
    }
    return layers
  }

  const layers = collectLayers(group)
  if (layers.length === 0)
    throw new Error("No descendant layers with canvases found.")

  // Compute the bounding box of all layers
  let minLeft = Infinity,
    minTop = Infinity,
    maxRight = -Infinity,
    maxBottom = -Infinity
  for (const layer of layers) {
    const { left, top, right, bottom } = layer.rect
    if (
      left === undefined ||
      top === undefined ||
      right === undefined ||
      bottom === undefined
    )
      continue
    if (left < minLeft) minLeft = left
    if (top < minTop) minTop = top
    if (right > maxRight) maxRight = right
    if (bottom > maxBottom) maxBottom = bottom
  }
  if (
    !isFinite(minLeft) ||
    !isFinite(minTop) ||
    !isFinite(maxRight) ||
    !isFinite(maxBottom)
  )
    throw new Error("Invalid bounding box for group composition.")

  const width = Math.ceil(maxRight - minLeft)
  const height = Math.ceil(maxBottom - minTop)
  if (width <= 0 || height <= 0)
    throw new Error("Invalid composed canvas size.")

  // Create a canvas and draw all layers
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Failed to get 2D context for group composition.")

  // Draw each layer at its relative position
  for (const layer of layers) {
    const { left, top, right, bottom } = layer.rect
    if (
      left === undefined ||
      top === undefined ||
      right === undefined ||
      bottom === undefined
    )
      continue
    if (!layer.canvas) continue
    await new Promise<void>(resolve => {
      const img = new window.Image()
      img.onload = () => {
        ctx.drawImage(
          img,
          0,
          0,
          img.width,
          img.height,
          left - minLeft,
          top - minTop,
          right - left,
          bottom - top,
        )
        resolve()
      }
      img.src = layer.canvas
    })
  }
  const dataUrl = canvas.toDataURL("image/webp")
  canvas.remove()
  return dataUrl
}
