const mongoose = require('mongoose')

const url = 'mongodb+srv://fullstack:fullstack@cluster0.c8vvv.mongodb.net/fullstack?retryWrites=true&w=majority'

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const noteSchema = new mongoose.Schema({
	content:String,
	date:Date,
	important:Boolean,
})

const Note = mongoose.model('Note',noteSchema)

// const note = new Note({
// 	content:'HTML and CSS is !important',
// 	date: new Date(),
// 	important:false,
// })

// note.save().then(result => {
// 	console.log('Note saved')
// 	mongoose.connection.close()
// })

Note.find({important:true}).then(result => {
	result.forEach(note => {
		console.log("Results true ",note)
	})
	mongoose.connection.close()
})



