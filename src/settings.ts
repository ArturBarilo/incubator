import express, { Request, Response } from "express";

export const app = express()

app.use(express.json())

const AvailableResolutions = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160']

type VideoType = {
  id: number,
  title: string,
  author: string,
  canBeDownloaded: boolean,
  minAgeRestriction: number | null,
  createdAt: string,
  publicationDate: string,
  availableResolutions: typeof AvailableResolutions
}

const videos: VideoType[] = [{
  "id": 0,
  "title": "string",
  "author": "string",
  "canBeDownloaded": true,
  "minAgeRestriction": null,
  "createdAt": "2024-01-03T12:22:04.182Z",
  "publicationDate": "2024-01-03T12:22:04.182Z",
  "availableResolutions": [
    "P144"
  ]
}]

type RequestWithBody<B> = Request<unknown, unknown, B, unknown>

type RequestWithBodyAndParams<A, V> = Request<A, unknown, V, unknown>

type Param = {
  id: number
}

type CreateVideoType = {
  title: string,
  author: string,
  availableResolutions?: typeof AvailableResolutions,

}

type UpdateVideoType = {
  title: string,
  author: string,
  availableResolutions?: typeof AvailableResolutions
  canBeDownloaded: boolean,
  minAgeRestriction: number | null,
  publicationDate: string,
}

type ErrorMessageType = {
  field: string,
  message: string
}

type ErrorType = {
  errorsMessages: ErrorMessageType[]
}

app.get('/videos', (req: Request, res: Response) => {
  res.send(videos)
})

app.get('/videos/:id', (req: Request<Param>, res: Response) => {
  const id = +req.params.id

  const video = videos.find(v => v.id == id)

  if (!video) {
    res.sendStatus(404)
    return
  }

  res.send(video)
})

app.post('/videos', (req: RequestWithBody<CreateVideoType>, res: Response) => {
  const errors: ErrorType = {
    errorsMessages: []
  }

  let { title, author, availableResolutions } = req.body

  if (!title || typeof title != 'string' || !title.trim() || title.trim().length > 40) {
    errors.errorsMessages.push({ message: 'Incorrect title', field: 'title' })
  }

  if (!author || typeof author != 'string' || !author.trim() || author.trim().length > 20) {
    errors.errorsMessages.push({ message: 'Incorrect author', field: 'author' })
  }


  if (Array.isArray(availableResolutions)) {

    availableResolutions.forEach(r => {
      if (!AvailableResolutions.includes(r)) {
        errors.errorsMessages.push({ message: 'Incorrect availableResolutions', field: 'availableResolutions' })
        return
      }
    })
  } else {
    availableResolutions = []
  }

  if (errors.errorsMessages.length) {
    res.status(400).send(errors)
    return
  }

  const createdAt = new Date()
  const publicationDate = new Date()

  publicationDate.setDate(createdAt.getDate() + 1)

  const newVideo: VideoType = {
    id: +(new Date()),
    canBeDownloaded: false,
    minAgeRestriction: null,
    createdAt: createdAt.toISOString(),
    publicationDate: publicationDate.toISOString(),
    title,
    author,
    availableResolutions
  }

  videos.push(newVideo)

  res.status(201).send(newVideo)
})

app.put('/videos/:id', (req: RequestWithBodyAndParams<Param, UpdateVideoType>, res: Response) => {
  const errors: ErrorType = {
    errorsMessages: []
  }

  const id = +req.params.id

  let { title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate } = req.body

  if (!title || typeof title != 'string' || !title.trim() || title.trim().length > 40) {
    errors.errorsMessages.push({ message: 'Incorrect title', field: 'title' })
  }

  if (!author || typeof author != 'string' || !author.trim() || author.trim().length > 20) {
    errors.errorsMessages.push({ message: 'Incorrect author', field: 'author' })
  }

  if (Array.isArray(availableResolutions)) {

    availableResolutions.forEach(r => {
      if (!AvailableResolutions.includes(r)) {
        errors.errorsMessages.push({ message: 'Incorrect availableResolutions', field: 'availableResolutions' })
        return
      }
    })
  } else {
    availableResolutions = []
  }

  if (typeof canBeDownloaded != 'boolean') {
    errors.errorsMessages.push({ message: 'Incorrect canBeDownloaded', field: 'canBeDownloaded' })
    
  }

  if (minAgeRestriction) {
    if (minAgeRestriction > 18 || minAgeRestriction < 1) {
      errors.errorsMessages.push({ message: 'Incorrect minAgeRestriction', field: 'minAgeRestriction' })
    }
  }

  const dateCheking = new Date(publicationDate)

  if (isNaN(dateCheking.getMonth()) || isNaN(dateCheking.getDay()) || isNaN(dateCheking.getFullYear())) {
    errors.errorsMessages.push({ message: 'Incorrect publicationDate', field: 'publicationDate' })
  }

  if (errors.errorsMessages.length) {
    res.status(400).send(errors)
    return
  }

  let video = videos.find(v => v.id == id)
  if (video) {

    video.canBeDownloaded = req.body.canBeDownloaded
    video.minAgeRestriction = req.body.minAgeRestriction
    video.publicationDate = req.body.publicationDate
    video.title = req.body.title
    video.author = req.body.author
    video.availableResolutions = availableResolutions  
    
  } else {
    res.sendStatus(400)
    return
  }
  res.sendStatus(204)
  return
})

app.delete('/testing/all-data', (req: Request, res: Response) => {
  videos.length = 0
  res.sendStatus(204)
})

app.delete('/videos/:id', (req: Request<Param>, res: Response) => {
  const id = +req.params.id

  const videoIndex = videos.findIndex(v => v.id == id)

  if (videoIndex < 0) {
    res.sendStatus(404)
    return
  } else {
    videos.splice(videoIndex, 1)
  }

  res.sendStatus(204)
  return
})