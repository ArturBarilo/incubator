import { SortDirection } from "mongodb";

export type QueryCommentInputModel = {
    pageNumber?: number
    pageSize?: number
    sortBy?: string
    sortDirection?: SortDirection
}