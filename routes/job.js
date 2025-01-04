const express = require('express');
const router = express.Router();
const verifyUser = require('../middleware/auth');
const { allJobData, getJobById, createJob, updateJob, deleteJob } = require("../controller/jobController");
 
//                                  --Read the data--
//      Route for all job data  
router.get('/', allJobData);
//      Route for a single job data           
router.get('/:id', getJobById); 

//                                  --Create the data--
//      Route for creating a job data
router.post('/', verifyUser, createJob);

//                                  --Update the data--
//      Route for update the job details while verifying the user
router.put('/:id', verifyUser, updateJob);

//                                  --delete the data--
//      Route for delete a job while verifying the user
router.delete('/:id', verifyUser, deleteJob);

module.exports = router;
