export const loadWebTool = function (src: string) {
  const script = document.createElement('script')

  script.defer = true
  script.type = 'text/javascript'
  script.src = src

  document.head.appendChild(script)
}

export const createScript = function (id: string, innerHTML: string) {
  const script = document.createElement('script')

  script.id = id
  script.type = 'application/json'
  script.innerHTML = innerHTML

  document.head.appendChild(script)
}
