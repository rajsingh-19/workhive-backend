const mongoose = require('mongoose');
//          defining the schema
const JobSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    addLogoUrl: {
        type: String,
        required: true
    },
    jobPosition : {
        type: String,
        required: true
    },
    monthlySalary: {
        type: Number,
        required: true
    },
    jobType: {
        type: String,
        required: true,
        enum: ["Full-Time", "Part-Time", "Contract", "Internship", "Freelance"]
    },
    jobNature: {
        type: String,
        required: true,
        enum: ['Remote', 'Office']
    },
    location: {
        type: String,
        required: true
    },
    jobDescription: {
        type: String,
        required: true
    },
    aboutCompany: {
        type: String,
        required: true
    },
    skillsRequired: {
        type: [String],
        required: true,
        enum: ['React', 'JavaScript', 'HTML', 'CSS', 'MongoDB', 'Express']
    },
    information: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});
//          defining the model
const JobModel = mongoose.model("JobModel", JobSchema);

module.exports = JobModel;
