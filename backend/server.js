"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const port = process.env.PORT || 3001;
mongoose_1.default.connect(process.env.MONGO_URI || '')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB', err));
app.use(express_1.default.json());
const studentSchema = new mongoose_1.default.Schema({
    fullName: { type: String, required: true },
    age: { type: String, required: true }
});
const StudentModel = mongoose_1.default.model('Student', studentSchema);
app.get('/students', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const students = yield StudentModel.find();
        res.status(200).json(students);
        console.log("in get method of backend");
    }
    catch (error) {
        res.status(500).json({ message: 'failed to fetch student data', error });
    }
}));
app.post('/submit', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("in post method " + req);
        const { fullName, age } = req.body;
        const student = new StudentModel({ fullName, age });
        console.log(student.fullName + " " + student.age);
        yield student.save();
        res.status(201).json({ message: 'Student data saved successfully', student });
    }
    catch (error) {
        console.log("in catch of server.ts");
        res.status(500).json({ mesage: 'Failed to save student data', error });
    }
}));
app.listen(port, () => {
    console.log(`Server is running on part ${port}`);
});
