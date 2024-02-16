import { Router, Response, Request } from "express";
import {Pagination, RequestWithBody, RequestWithQuery } from "../common";
import { CreateUserModel } from "../models/user/input/create-user-model";
import { QueryUserInputModel } from "../models/user/input/query-user-input-model";
import { OutputUserType } from "../models/user/output/user-output-model";
import { UserQueryRepository } from "../repositories/user-query-repository";
import { UserService } from "../services/user-service";
import {ObjectId} from "mongodb";
import {createUserValidation} from "../validators/user-validators";
import {authMiddleware} from "../middlewares/auth/auth-middleware";

export const userRoute = Router({})

userRoute.get('/', authMiddleware, async (req: RequestWithQuery<QueryUserInputModel>, res: Response<Pagination<OutputUserType>>) => {
    const sortData = {
        sortBy: req.query.sortBy ?? 'createdAt',
        sortDirection: req.query.sortDirection ?? 'desc',
        pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
        pageSize: req.query.pageSize ? +req.query.pageSize : 10,
        searchLoginTerm: req.query.searchLoginTerm ?? null,
        searchEmailTerm: req.query.searchEmailTerm ?? null
    }

    const users = await UserQueryRepository.getAll(sortData)

    if(!users) return res.sendStatus(400)

    res.status(200).send(users)
    return
})

userRoute.post('/', authMiddleware, createUserValidation(), async (req: RequestWithBody<CreateUserModel>, res: Response<OutputUserType>) => {
    const createUserModel: CreateUserModel = req.body

    const user = await UserService.createUser(createUserModel)

    if(!user) return res.status(401)

    return res.status(201).send(user)
})

userRoute.delete('/:id', authMiddleware, async (req: Request, res: Response) =>{
    const id = req.params.id

    if(!ObjectId.isValid(id)) {
        return res.sendStatus(404)
    }

    const deletedUser = await UserService.deleteUser(id)

    if(!deletedUser) {
        return res.sendStatus(404)
    }

    return res.sendStatus(204)
})

