import {Request, Response, Router} from "express";

enum availableResolutionsEnum {P144, P240, P360, P480, P720, P1080, P1440, P2160}

type videosCatalogType = Array<videosTypes>
type videosTypes = {
    id: number
    title: string
    author: string
    canBeDownloaded: boolean
    minAgeRestriction: number | null
    createdAt: string
    publicationDate: string
    availableResolutions: availableResolutionsEnum[]
}
const availableResolutionsArray: Array<string> = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160']
let videosCatalog: videosCatalogType = [
    {
        id: 1,
        title: 'coolVideo',
        author: 'Pushkin',
        // default (by tests) false
        canBeDownloaded: false,
        // default (by tests) nul
        minAgeRestriction: null,
        createdAt: new Date().toISOString(),
        publicationDate: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
        availableResolutions: [availableResolutionsEnum.P144]
    }
]

export const videosRouter = Router()

const createVideoValidation = (title: string, author: string, availableResolutions: Array<string>) => {
    const errorsMessages = []
    if (title.length > 40
        || !title
        || typeof title !== 'string'
    ) {
        errorsMessages.push({
            "message": "Incorrect title",
            "field": "title"
        })
    }
    if (author.length > 20
        || !author
        || typeof author !== 'string'
    ) {
        errorsMessages.push({
            "message": "Incorrect author",
            "field": "author"
        })
    }
    if (availableResolutions.length > availableResolutionsArray.length
        || availableResolutions.filter(resol => availableResolutionsArray.indexOf(resol) < 0).length > 0) {
        errorsMessages.push({
            "message": "Incorrect availableResolutions",
            "field": "availableResolutions"
        })

    }
    return errorsMessages
}
const updateVideValidation = (
    title: string,
    author: string,
    availableResolutions: Array<string>,
    canBeDownloaded: boolean,
    minAgeRestriction: number | null,
    publicationDate: string
) => {
    const errorsMessages = []
    if (title.length > 40
        || !title
        || typeof title !== 'string'
    ) {
        errorsMessages.push({
            "message": "Incorrect title",
            "field": "title"
        })
    }
    if (author.length > 20
        || !author
        || typeof author !== 'string'
    ) {
        errorsMessages.push({
            "message": "Incorrect author",
            "field": "author"
        })
    }
    if (availableResolutions.length > availableResolutionsArray.length
        || availableResolutions.filter(resol => availableResolutionsArray.indexOf(resol) < 0).length > 0) {
        errorsMessages.push({
            "message": "Incorrect availableResolutions",
            "field": "availableResolutions"
        })

    }
    if (typeof canBeDownloaded !== 'boolean') {
        errorsMessages.push({
            "message": "Incorrect canBeDownloaded",
            "field": "canBeDownloaded"
        })
    }
    if (typeof minAgeRestriction !== 'number'
        || minAgeRestriction < 1
        || minAgeRestriction > 18) {
        errorsMessages.push({
            "message": "Incorrect minAgeRestriction",
            "field": "minAgeRestriction"
        })
    }
    if (typeof publicationDate !== 'string') {
        errorsMessages.push({
            "message": "Incorrect publicationDate",
            "field": "publicationDate"
        })
    }
    return errorsMessages
}

    videosRouter.get('/', (req: Request, res: Response) => {
        res.status(200).send(videosCatalog)
    })
    videosRouter.post('/', (req: Request, res: Response) => {
        const title = req.body.title
        if (title === null) {
            return res.status(400).send({
                errorsMessages: [
                    {
                        "message": "Incorrect",
                        "field": "title"
                    }
                ]
            })
        }

        const author = req.body.author
        const availableResolutions = req.body.availableResolutions
        const errors = createVideoValidation(title, author, availableResolutions)
        if (errors.length > 0) {
            return res.status(400).send({errorsMessages: errors})
        }
        const newVideo = {
            id: videosCatalog.length + 1,
            title: title,
            author: author,
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: new Date().toISOString(),
            publicationDate: new Date(Date.now() + 86400000).toISOString(),
            availableResolutions: availableResolutions
        }
        videosCatalog.push(newVideo)
        res.status(201).send(newVideo)
    })
    videosRouter.get('/:id', (req: Request<{ id: string }>, res: Response) => {
        let video = videosCatalog.find(v => v.id === +req.params.id)
        if (video) {
            res.status(200).send(video)
        } else {
            res.sendStatus(404)
        }
    })
    videosRouter.put('/:id', (req: Request, res: Response) => {
        const title = req.body.title
        if (title === null) {
            return res.status(400).send({
                errorsMessages: [
                    {
                        "message": "Incorrect",
                        "field": "title"
                    }
                ]
            })
        }
        const author = req.body.author
        const availableResolutions = req.body.availableResolutions
        const canBeDownloaded = req.body.canBeDownloaded
        const minAgeRestriction = req.body.minAgeRestriction
        const publicationDate = req.body.publicationDate
        const errors = updateVideValidation(title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate)
        if (errors.length > 0) {
            return res.status(400).send({errorsMessages: errors})
        }
        let video = videosCatalog.find(v => v.id === +req.params.id)
        if (video) {
            video.title = req.body.title
            video.author = req.body.author
            if (canBeDownloaded) {
                video.canBeDownloaded = req.body.canBeDownloaded
            }
            if (minAgeRestriction) {
                video.minAgeRestriction = req.body.minAgeRestriction
            }
            if (publicationDate) {
                video.publicationDate = req.body.publicationDate
            }
            if (availableResolutions) {
                video.availableResolutions = req.body.availableResolutions
            }
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })
    videosRouter.delete('/:id', (req: Request, res: Response) => {
        let video = videosCatalog.find(v => v.id === +req.params.id)
        if (video) {
            videosCatalog = videosCatalog.filter(f => f.id !== +req.params.id)
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })


    export const testingRouter = Router()

    testingRouter.delete('/all-data', (req: Request, res: Response) => {
        videosCatalog = []
        res.sendStatus(204)
    })