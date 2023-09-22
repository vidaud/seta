export const getStrength = function getStrength(slides, currentslide) {
  return Math.max((100 / slides) * currentslide)
}
