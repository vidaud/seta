/* eslint-disable @typescript-eslint/ban-types */

type ApiResultOne<T> = { success: true; data: T }
type ApiResultMany<T> = ApiResultOne<T> & { count: number }

type ApiResult<T> = ApiResultOne<T> | ApiResultMany<T>

export type ApiError<E = string> = { success: false; error: E }

export type ApiResponse<T = {}, E = string> = ApiResult<T> | ApiError<E>

export type ApiResponseOne<T = {}, E = string> = ApiResultOne<T> | ApiError<E>
export type ApiResponseMany<T = {}, E = string> = ApiResultMany<T> | ApiError<E>
