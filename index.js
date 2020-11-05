
require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))


//mongo database
const Note = require('./models/note')



//find notes with mongoosee find method
app.get('/api/notes',(request,response) => {
	Note.find({}).then(notes => {
		response.json(notes)
	})
})



//mongodb post
app.post('/api/notes', (request, response) => {
  const body = request.body

  // console.log(body)

  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  })
})


//fetching individual with mongo
app.get('/api/notes/:id', (request,response,next) => {
	Note.findById(request.params.id).then(note => {
		if(note){
			response.json(note)
		}else{
			response.status(404).end()
		}
	})
	.catch(error => next(error))
	// .catch(error => {
	// 	console.log(error)
	// 	response.status(400).send({error:'malformetted id'})
	// })
})



//deleting rescource
app.delete('/api/notes/:id', (request, response, next) => {
	Note.findByIdAndRemove(request.params.id)
	.then(result => {
		response.status(204).end()
	})
	.catch(error => next(error))
})


//updating rescource
app.put('/api/notes/:id', (request, response, next) => {
	const body = request.body

	const note = {
		content:body.content,
		important:body.important,
	}

	Note.findByIdAndUpdate(request.params.id, note, {new:true})
	.then(updateNote => {
		response.json(updateNote)
	})
	.catch(error => next(error))
})



//error middleware
const errorHandler = (error, request, response, next) => {
	console.log(error.message)

	if(error.name === 'CastError') {
		return response.status(400).send({error: 'malformetted id'})
	}

	next(error)
}

app.use(errorHandler)





const PORT = process.env.PORT
app.listen(PORT,() => {
	console.log(`Server running on port ${PORT}`)
})