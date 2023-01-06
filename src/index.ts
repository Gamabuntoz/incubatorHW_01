import express, {Request, Response} from'express'
import bodyParser from 'body-parser'
import {videosRouter} from "./routes/videosRouter";
import {testingRouter} from "./routes/testingRouter";
const app = express()
const port = process.env.PORT || 3000
const parserMiddleware = bodyParser({})
app.use(parserMiddleware)

app.use('/videos', videosRouter)
app.use('/testing', testingRouter )

app.listen(port)

