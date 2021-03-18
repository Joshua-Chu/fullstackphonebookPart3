const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(`:method :url :status :req[header] :response-time ms :body`))


let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
]

//homepage
app.get('/', (req,res)=>{
    res.send('Hello World')
})

//displaying all persons
app.get('/api/persons', (req,res)=>{
    res.json(persons)
})

//displaying about the proj
app.get('/info', (req,res)=>{
    const date = new Date()
    const infoLength = persons.length
    res.send(`<p>Phonebook has infor for ${infoLength} people</p>
    <p>${date}</p>
    `)
})

//displaying one person 
app.get('/api/persons/:id',(req,res)=>{
    const id = Number(req.params.id)
    const person = persons.find(p=> p.id === id)


    res.json(person)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint)

//Deleting a person
app.delete('/api/persons/:id', (req,res)=>{
    const id = Number(req.params.id)

    if(!persons.find(p => p.id === id)){
        return res.status(404).json({
            error: "Person does not exist"
        })
    }

    persons = persons.filter(p=> p.id !== id)
    res.status(204).end()
    
})


//adding person 

const genId = ()=>{
    const maxId = persons.length > 0? Math.max(...persons.map(p => p.id)) : 0
    return maxId + 1

}

app.post('/api/persons', (req, res)=>{
    const body = req.body

    if (!body.name || !body.number){
        return res.status(400).json({
            error: "name missing"
        })
    }else if(persons.find(p => p.name === body.name)){
        return res.status(400).json({
            error: "name must be unique"
        })
    }


    const person = {
        id : genId(),
        name : body.name,
        number: body.number,
    }


    persons.concat(person)

    res.json(person)
})










const PORT = process.env.PORT || 3001
app.listen(PORT, ()=>{
    console.log(`Server listening to port ${PORT}`)
})