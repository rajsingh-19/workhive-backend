const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
const JobModel = require('../models/job.schema');
const verifyUser = require('../middleware/auth');

dotenv.config();

//                                  --Read the data--
//                  get all the job data 
router.get('/', async (req, res) => {
    const jobs = await JobModel.find();
    res.status(200).json(jobs);
});
//                  get a single job data           
router.get('/:id', async (req, res) => {
    const {id} = req.params;
    const job = await JobModel.findById(id);
    if(!job) {
        return res.status(400).json({message: "Job not found"});
    }
    res.status(200).json(job);
}); 

//                                  --Create the data--
//                  create a job data
router.post('/', verifyUser, async (req, res) => {
    const {companyName, addLogoUrl, jobPosition, monthlySalary, jobType, jobNature, location, jobDescription, aboutCompany, skillsRequired, information} = req.body;
    // Check if all required fields are present
    if(!companyName || !addLogoUrl || !jobPosition || !monthlySalary || !jobType || !jobNature || !location || !jobDescription || !aboutCompany || !skillsRequired || !information) {
        return res.status(400).json({message: "All fields are required"});
    }
    try {
        //              retrieve user from the verified token
        const user = req.user;
        //              create a new job
        const newJob = new JobModel({
            companyName,
            addLogoUrl,
            jobPosition,
            monthlySalary,
            jobType,
            jobNature,
            location,
            jobDescription,
            aboutCompany,
            skillsRequired,
            information,
            user: user.id        // associate the job with the logged-in user
        });
        await newJob.save();
        res.status(200).json({message: "Job posted"});
    } catch(err) {
        console.log(`Error posting job ${err}`);
        res.status(500).json({message: "Could not post the job"});
    }
});

//                                          Update the data
// router.put('/:id', verifyUser, async (req, res) => {
//     const {id} = req.params;
//     const {companyName, addLogoUrl, jobPosition, monthlySalary, jobType, jobNature, location, jobDescription, aboutCompany, skillsRequired, information} = req.body;
//     const job = await JobModel.findById(id);
//     if(!job) {
//         return res.status(404).json({message: "Job not found"});
//     }
    
// });


module.exports = router;
