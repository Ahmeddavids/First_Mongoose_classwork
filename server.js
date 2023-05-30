const express = require("express")
const mongoose = require("mongoose")
const PORT = 2020
const app = express();
app.use(express.json());

const studentSchema = new mongoose.Schema({
    name: String,
    course: String,
    designation: String,
    "score": {
        html: Number,
        css: Number,
        javaScript: Number,
        node: Number
    }
});

const student = mongoose.model("Student Database", studentSchema);

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to my Student Database"
    })
});

app.get("/allstudents", async (req, res) => {
    const allstudents = await student.find()
    if(student.length === 0){
        console.log("There are no student to display");
    } else{
        res.status(200).json({
            message: "The total number of student in the database is: "+ allstudents.length,
            data: allstudents
        }) 
    }
});

app.post("/newstudent", async (req, res) => {
    const newstudent = await new student(req.body)
    newstudent.save()
    res.status(200).json(newstudent)    
});

app.get("/onestudent/:id", async (req, res) => {
    const id = req.params.id;
    const onestudent = await student.findById(id)
    res.status(200).json({
        massage: "The selected student with information is:",
        data: onestudent
    })
});

app.put("/editstudent/:id", async (req, res) => {
    try{
        const id = req.params.id;
    const newstudent = req.body;
    const student = await student.findByIdAndUpdate(id, newstudent);
    res.status(200).json({
    message: `The student with Id:${id} has been updated successfully`,
    data: student
    })
    } catch (e){
        res.status(500).json({
            message: "This student can not be updated"
        })
    }
})

app.delete("/deletestudent/:id", async (req, res) => {
    try{
        const id = req.params.id;
        const deletedstudent = await student.findByIdAndDelete(id)
        res.status(200).json({
            message: `The student with id:${id} was deleted successfully`,
            data: deletedstudent
        })
    } catch (err){
        res.status(500).json({
            message: err.message
        })
    }

})




mongoose.connect("mongodb+srv://ahmeddavids6:MPItZaAClTDXgGUY@cluster0.nu2av5b.mongodb.net/").then(() => {
    console.log("Connection to database is successful");
})


app.listen(PORT, () => {
    console.log(`Server is listening to Port: ${PORT}`);
})