const http = require("http"); 
const express = require("express")
const morgan = require('morgan')

const app = express()

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


app.get("/", morgan("tiny"), (req, res) => {
    res.send("<h1>Hello World!</h1>")
})

app.get("/api/persons", morgan("tiny"), (req, res) => {
    res.json(persons)
})
app.get("/api/persons/:id", morgan("tiny"), (req, res) => {
    let id = req.params.id
    let person = persons.find(p => p.id == id)
    if(person){
        res.json(person)
    } else{
        res.status(404).end()
    }
})
app.get("/info", morgan("tiny"), (req, res) => {
    res.json(`Phonebook has info for ${persons.length} people ${new Date()}`)
})

app.delete("/api/persons/:id", morgan("tiny"), (req, res) => {
    let {id} = req.params
    let person = persons.filter(p => p.id != id)
    res.send(person)
})

app.use(express.urlencoded({extended: true}))
app.use(express.json())
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :body'))

app.post("/api/persons", (req, res) => {
    let id = Math.ceil(Math.random()* 99999)
    newPerson = 
        {
            "id": id, 
            name: "Simone", 
            number:""
        }
    let names = []
    persons.map(p => names.push(p.name))
    if(names.find(n => n == newPerson.name)){
        req.body = `That person already exists`
        res.status(409).json(`That person already exists`)
    } else if(newPerson.name || newPerson.number){
        persons.push(newPerson)
        req.body = persons
        res.json(persons)
    } 
    else {
        req.body = `Please enter both a name and number`
        res.status(400).json(`Please enter both a name and number`)
    }
})


const port = 3001; 
app.listen(port, () => {
    console.log(`server running on port ${port}`)
})
app.use(morgan("dev"))