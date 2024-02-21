import { Router } from "express";
import { TestingRepository } from "../repositories/testing-repository";

export const testing = Router({})

testing.delete('/', async (req, res) => {
    await TestingRepository.deleteAll()
    res.sendStatus(204)
    return
})
