import { Router } from "express";
import { TestingRepository } from "../repositories/testing-repository";

export const testing = Router({})

testing.delete('/', (req, res) => {
    TestingRepository.deleteAll()
    res.sendStatus(204)
    return
})