import express, {Request,Response} from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors());

const port = process.env.PORT || 3001;

mongoose.connect(process.env.MONGO_URI || '')
.then(()=>console.log('Connected to MongoDB'))
.catch((err)=>console.error('Failed to connect to MongoDB',err));

app.use(express.json());

interface Student{
    fullName: String;
    age: String;
}

const studentSchema = new mongoose.Schema<Student>({
    fullName:{type:String,required:true},
    age:{type: String,required:true}
})

const StudentModel = mongoose.model<Student>('Student',studentSchema);

app.get('/students', async(req:Request, res:Response)=>{
    try{
        const students = await StudentModel.find();
        res.status(200).json(students);
        console.log("in get method of backend");
    }
    catch(error){
        res.status(500).json({message:'failed to fetch student data',error});
    }
})

app.post('/submit', async(req:Request,res:Response)=>{
    try{
        console.log("in post method "+req);
        const{fullName,age} = req.body;
        const student = new StudentModel({fullName,age});
        console.log(student.fullName+" "+student.age);
        await student.save();
        res.status(201).json({message:'Student data saved successfully',student})
    }
    catch(error){
        console.log("in catch of server.ts");
        res.status(500).json({mesage:'Failed to save student data',error})
    }
});


app.listen(port,()=>{
    console.log(`Server is running on part ${port}`)
})