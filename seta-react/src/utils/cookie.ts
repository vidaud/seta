export type CookieOptions = {
  expiryDays?: number
  maxAge?: number
  domain?: string
  path?: string
  sameSite?: 'Strict' | 'Lax' | 'None'
  secure?: boolean
  httpOnly?: boolean
}

const getSameSiteValue = (o: CookieOptions): string | null => {
  const { sameSite } = o

  if (typeof sameSite === 'undefined') {
    return null
  }

  if (['none', 'lax', 'strict'].indexOf(sameSite.toLowerCase()) >= 0) {
    return sameSite
  }

  return null
}

const formatOptions = (o: CookieOptions): string => {
  const { path, domain, expiryDays, secure } = o
  const sameSiteValue = getSameSiteValue(o)
  const ex_date = new Date()

  ex_date.setHours(ex_date.getHours() + (o.expiryDays || 365) * 24)

  return [
    typeof path === 'undefined' || path === null ? '' : ';path=' + path,
    typeof domain === 'undefined' || domain === null ? '' : ';domain=' + domain,
    typeof expiryDays === 'undefined' || expiryDays === null
      ? ''
      : ';expires=' + ex_date.toUTCString(),
    typeof secure === 'undefined' || secure === false ? '' : ';secure',
    sameSiteValue === null ? '' : ';SameSite=' + sameSiteValue
  ].join('')
}

export const formatCookie = (k: string, d: string, o: CookieOptions): string => {
  return [encodeURIComponent(k), '=', encodeURIComponent(d), formatOptions(o)].join('')
}

export const getCookie = function (key: string) {
  return (
    decodeURIComponent(
      document.cookie.replace(
        new RegExp(
          '(?:(?:^|.*;)\\s*' +
            encodeURIComponent(key).replace(/[-.+*]/g, '\\$&') +
            '\\s*\\=\\s*([^;]*).*$)|^.*$'
        ),
        '$1'
      )
    ) || null
  )
}

export const hasCookie = function (sKey: string | number | boolean) {
  return new RegExp(
    '(?:^|;\\s*)' + encodeURIComponent(sKey).replace(/[-.+*]/g, '\\$&') + '\\s*\\='
  ).test(document.cookie)
}

export const removeCookie = function (
  sKey: string | number | boolean,
  sPath: string,
  sDomain: string
) {
  if (!sKey || !hasCookie(sKey)) {
    return false
  }

  document.cookie =
    encodeURIComponent(sKey) +
    '=; expires=Thu, 01 Jan 1970 00:00:00 GMT' +
    (sDomain ? '; domain=' + sDomain : '') +
    (sPath ? '; path=' + sPath : '')

  return true
}
