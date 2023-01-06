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
    availableResolutions: [availableResolutionsEnum]
}
let videosCatalog: videosCatalogType = [
    {
        id: -1,
        title: 'coolVideo',
        author: 'Pushkin',
        canBeDownloaded: true,
        minAgeRestriction: 18,
        createdAt: new Date().toISOString(),
        publicationDate: new Date(Date.now() + 86400000).toISOString(),
        availableResolutions: [availableResolutionsEnum.P144]
    }
]
export const videosRouter = Router()
videosRouter.get('/', (req: Request, res: Response) => {
    res.status(200).send(videosCatalog)
})
videosRouter.post('/', (req: Request, res: Response) => {
    let title = req.body.title
    let author = req.body.author
    if (title.length > 40
        || author.length > 20
        || !title
        || !author
        || typeof title !== 'string'
        || typeof author !== 'string'
    ) {
        res.status(400).send({
            errorsMessages: [
                {
                    "message": "Incorrect title or author",
                    "field": "Title or author"
                }
            ]
        })
        return
    }
    const newVideo = {
        id: videosCatalog[videosCatalog.length - 1].id + 1,
        title: req.body.title,
        author: req.body.author,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: new Date().toISOString(),
        publicationDate: new Date(Date.now() + 86400000).toISOString(),
        availableResolutions: req.body.availableResolutions
    }

    videosCatalog.push(newVideo)
    res.status(201).send(newVideo)
})
videosRouter.get('/:id', (req: Request<{ id: string }>, res: Response) => {
    let video = videosCatalog.find(v => v.id === +req.params.id)
    if (video) {
        res.status(200).send(video)
    } else {
        res.send(404)
    }
})
videosRouter.put('/:id', (req: Request, res: Response) =>  {
    if (req.body.canBeDownloaded) {
        if (typeof req.body.canBeDownloaded !== 'boolean') {
            res.status(400).send(
                {
                    "errorsMessages": [
                        {
                            "message": "Incorrect data",
                            "field": "canBeDownloaded"
                        }
                    ]
                })
            return
        }
    }
    if (req.body.minAgeRestriction) {
        if (typeof req.body.minAgeRestriction !== 'number'
            || req.body.minAgeRestriction < 1
            || req.body.minAgeRestriction > 18) {
            res.status(400).send({
                "errorsMessages": [
                    {
                        "message": "Incorrect data",
                        "field": "minAgeRestriction"
                    }
                ]
            })
            return
        }
    }
    if (req.body.publicationDate) {
        if (typeof req.body.publicationDate !== 'string') {
            res.status(400).send(
                {
                    "errorsMessages": [
                        {
                            "message": "Incorrect data",
                            "field": "publicationDate"
                        }
                    ]
                })
            return
        }
    }
    if (req.body.title.length > 40
        || req.body.author.length > 20
        || !req.body.title
        || !req.body.author
        || typeof req.body.title !== 'string'
        || typeof req.body.author !== 'string'
    ) {
        res.status(400).send({
            errorsMessages: [
                {
                    "message": "Incorrect title or author",
                    "field": "Title or author"
                }
            ]
        })
        return
    }
    let video = videosCatalog.find(v => v.id === +req.params.id)
    if (video) {
        video.title = req.body.title
        video.author = req.body.author
        if (req.body.canBeDownloaded) {
            video.canBeDownloaded = req.body.canBeDownloaded
        }
        if (req.body.minAgeRestriction) {
            video.minAgeRestriction = req.body.minAgeRestriction
        }
        if (req.body.publicationDate) {
            video.publicationDate = req.body.publicationDate
        }
        if (req.body.availableResolutions) {
            video.availableResolutions = req.body.availableResolutions
        }
        res.status(204)
    } else {
        res.send(404)
    }
})
videosRouter.delete('/:id', (req: Request, res: Response) => {
    let video = videosCatalog.find(v => v.id === +req.params.id)
    if (video) {
        videosCatalog = videosCatalog.filter(f => f.id !== +req.params.id)
        res.status(204)
    } else {
        res.send(404)
    }
})