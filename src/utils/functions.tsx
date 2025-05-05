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
