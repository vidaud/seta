const keysDiff = function arrayDiffs(
  prev: string[] | null | undefined,
  current: string[] | null | undefined
): { removed: string[]; added: string[] } {
  let removed: string[] = []
  let added: string[] = []

  if (!prev) {
    added = current ?? []
  }

  if (!current) {
    removed = prev ?? []
  }

  if (prev && current) {
    removed = prev.filter((x: string) => !current.includes(x))
    added = current.filter((x: string) => !prev.includes(x))
  }

  return { removed, added }
}

export default keysDiff
