const express = require('express');
const dotenv = require('dotenv');
const JobModel = require("../models/job.schema");

dotenv.config();

//      Get all the jobs
const allJobData = async (req, res) => {
    try {
        const {offset, limit, name, monthlySalary, skillsRequired} = req.query;
        const query = {}
        if(name) {
            query.companyName = {$regex: name, $options: "i"}
        }
        if(monthlySalary) {
            query.monthlySalary = {$gte: monthlySalary, $lte: monthlySalary};
        }
        if (skillsRequired) {
            // all skills must be in the skills array
            // query.skills = { $all: skills.split(",") };     // works likes and operator
            // at least one skill must be in the skills array
            query.skillsRequired = { $in: skillsRequired.split(",") };   // works like or operator
        }
        const jobs = await JobModel.find(query).skip(offset || 0).limit(limit || 20);
        const count = await JobModel.countDocuments(query);                   //provide the total count of jobs matching the criteria, useful for pagination purposes
        res.status(200).json({jobs, count});                        //res.json can only send one single object i.e., {jobs, count}

        //          get all the job data
        // const jobs = await JobModel.find();
        // res.status(200).json(jobs);

        //          PAGINATION : limit and offset ---> limit also knnown as size, pagesize, count  && offset also called as page, skip
        // const {limit, offset} = req.query;                                    //fetching the limit and offest from the request query
        // const jobs = await JobModel.find().skip(offset).limit(limit);         //applying offset and limit on the fetched job data
        // res.status(200).json(jobs);

        //          FILTERING 
        //          Get the job data with only salary filter
        // const {monthlySalary} =req.query;
        // const filteredJobs = await JobModel.find({monthlySalary});
        // res.status(200).json(filteredJobs);

        //          Filter with salary between 51000 and 110000 ===== this will not work
        // const {monthlySalary} = req.query;
        // const filterJobs = await JobModel.find({monthlySalary: {$gte: 51000, $lte: 110000}});
        // res.status(200).json(filterJobs);

        //          Pagination with filtering
        // const {offset, limit, monthlySalary} = req.query;
        // const jobs = await JobModel.find({monthlySalary: {$gte: 50000, $lte: 110000}}).skip(offset).limit(limit);
        // res.status(200).json(jobs);

        //          pagination with filtering companyName and monthlySalary 
        // const {offset, limit, companyName, monthlySalary} = req.query;
        // const filteredJobs = await JobModel.find({companyName, monthlySalary}).skip(offset).limit(limit);
        // res.status(200).json(filteredJobs);

        //          pagin + filtering on companyname & monthlysalary but with also other types of string or case insensitive or sub strings
        //          we have to use regular expressions (regex) in this such cases - applicable not on number
        // const {offset, limit, name, monthlySalary} = req.query;
        // const filteredJobs = await JobModel.find({companyName: {$regex : name, $options: 'i'}, monthlySalary}).skip(offset).limit(limit);
        // res.status(200).json(filteredJobs);
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//      Get a job by its Id
const getJobById = async (req, res) => {
    const {id} = req.params;
    const job = await JobModel.findById(id);
    if(!job) {
        return res.status(400).json({message: "Job not found"});
    }
    res.status(200).json(job);
};

//      Post a job
const createJob = async (req, res) => {
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
};

//      Update a job by its Id
const updateJob = async (req, res) => {
    const {id} = req.params;
    const {companyName, addLogoUrl, jobPosition, monthlySalary, jobType, jobNature, location, jobDescription, aboutCompany, skillsRequired, information} = req.body;
    const job = await JobModel.findById(id);                //search the job posted by its id 
    //      check if the job post is present or not
    if(!job) {
        return res.status(404).json({message: "Job not found"});
    };
    //      check if the user is the actual owner of the job posted or not
    if(job.user.toString() !== req.user.id) {               //user.toString() -> converts the objectId of user who created the job into string and req.user.id(user associated with the request)
        res.status(401).json({message: "You are not authorized to modify the data"});
        return;
    };
    try {
        await JobModel.findByIdAndUpdate(id, {
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
            information
        });
        res.status(200).json({ message: "Job updated" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error in updating job" });
    }
};

//      Delete a job by its Id
const deleteJob = async (req, res) => {
    const { id } = req.params;                          //retreive the id from the req params 
    const userId = req.user.id;                         //assigning the req user id to the userId 
    try {
        const job = await JobModel.findById(id);            //search the job from the db by its id
        //                  check if the job is present or not
        if (!job.user) {
            return res.status(404).json({ message: "Job not found" });
        };
        //                  check if the user is the job post owner or not
        if (userId !== job.user.toString()) {
            return res.status(401).json({ message: "You are not authorized to delete this job" });
        }; 
        await JobModel.deleteOne({ _id: id });
        return res.status(200).json({ message: "Job deleted" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error in deleting the job", error});
    }  
};

module.exports = { allJobData, getJobById, createJob, updateJob, deleteJob };

