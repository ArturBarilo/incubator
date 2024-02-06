import {Request} from "express"

export type ParamType = {
    id: string
}
export type RequestWithQuery<Q> = Request<{}, {}, {}, Q>
export type RequestWithParamsAndQuery<P, Q> = Request<P, {}, {}, Q>
export type RequestWithBody<B> = Request<{}, {}, B, {}>
export type RequestWithParamsAndBody<P, B> = Request<P, {}, B, {}>

export type Pagination<I> = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: I[]
}
