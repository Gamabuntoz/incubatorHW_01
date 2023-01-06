import {Request, Response, Router} from "express";
import {videosRouter} from "./videosRouter";
export const testingRouter = Router()

testingRouter.delete('/:all-data', (req: Request, res: Response) => {
    res.status(204)
})