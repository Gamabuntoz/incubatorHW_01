import express, {Request, Response} from'express'
import bodyParser from 'body-parser'
import {testingRouter, videosRouter} from "./routes/videosRouter";
export const app = express()
const port = process.env.PORT || 3000
const parserMiddleware = bodyParser({})
app.use(parserMiddleware)

app.use('/videos', videosRouter)
app.use('/testing', testingRouter )
app.listen(port, () => {
    console.log(`Server start on port ${port}`)
})

