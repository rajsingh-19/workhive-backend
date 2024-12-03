const express = require('express');
const router = express.Router();
const JobModel = require('../models/job.schema');

router.post('/job', async (req, res) => {
    const {companyName, addLogoUrl, jobPosition, monthlySalary, jobType, jobNature, location, jobDescription, aboutCompany, skillsRequired, information, user } = req.body;
    const isJobExists = await JobModel.findOne({});
    if(isJobExists) {
        return res.status(400).json({message: "Job already posted"});
    }
    try {
        const newJob = await new JobModel({
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
            user
        });
        await newJob.save();
        res.status(200).json({message: "Job posted"});
    } catch(err) {
        console.log(err);
        res.status(500).json({message: "Could not post the job"});
    }
});

module.exports = router;
