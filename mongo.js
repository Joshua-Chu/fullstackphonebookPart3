const mongoose = require('mongoose')

if(process.argv.length < 3){
    console.log('Pleace provide the password as an argument: node mongo.js <password>');
    process.exit(1)
}


const password = process.argv[2]
const url = `mongodb+srv://fullstack:${password}@cluster0.wapq5.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, {userNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false, useCreateIndex: true})

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)



if (process.argv.length === 3){
    Person.find({}).then(res =>{
        console.log("Phonebook: ")
        res.forEach(person =>{
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}else{
    const name = process.argv[3]
    const number = process.argv[4]


    const person = new Person({
        name,
        number,
    })


    person.save().then(res =>{
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
}