import {Request, Response, Router} from "express";
import {videosCatalog} from "./videosRouter";

export const testingRouter = Router()
testingRouter.delete('/all-data', (req: Request, res: Response) => {
    videosCatalog.splice(0, videosCatalog.length)
    res.sendStatus(204)
})