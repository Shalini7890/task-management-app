import express from 'express';
import Task from '../models/Task';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

router.use(authenticateToken);

//get all tasks for current user
router.get('/', async(req: AuthRequest, res: any) => {
    try{
        // const {user} = req.body;
        const tasks = await Task.find({userId: req.user!._id}).sort({createdAt: -1});
        res.json({message: 'tasks retrieved for the given user',tasks});
    }
    catch(error: any) {
        console.error('Error in getting tasks', error);
        res.status(500).json({message: 'Error getting tasks'});        
    }
});

//create new task
router.post('/', async(req: AuthRequest, res: any) => {
    try {
        const {title, description, priority, dueDate} = req.body;
        if(!title || !description || !priority || !dueDate) {
            res.status(400).json({message:'Provide required parameters'});
        }
        const task = new Task({
            title:title.trim(),
            description:description.trim(),
            priority:priority || 'medium',
            dueDate: dueDate && dueDate.trim() ? new Date(dueDate) : undefined,
            userId:req.user!._id,
            status:'to-do'
        });
        await task.save();
        res.status(201).json({message:'Task created successfully',task});
        
    } catch (error: any) {
        console.error(error);
        res.status(500).json({message:'Error in creating task'})
    }
});

//update existing task
router.put('/:id', async(req:AuthRequest,res:any) => {
    try {
        const {title, description, status, priority, dueDate} = req.body;
        const task = await Task.findOneAndUpdate({
            _id: req.params.id,
            userId: req.user!._id
        },{
            title: title?.trim(),
            description: description?.trim(),
            status: status,
            priority,
            dueDate: dueDate && dueDate.trim() ? new Date(dueDate) : undefined
        },
        {
            new: true,
            runValidators: true
        }
    );
    if (!task) {
        return res.status(404).json({message:'Task not found'})
    }
    res.json({message:'task updated successfully', task});
    } catch (error) {
        console.error(error);
        res.status(500).json({message:'Updation failed'});
        
        
    }
})

//updateTask status only
router.patch('/:id/status', async(req:AuthRequest, res:any) => {
    try {
        const {status} = req.body;
        if(!['to-do', 'in-progress', 'done'].includes(status)){
            return res.status(400).json({message:'Include only a status from this list : to-do, in-progress or done'});
        }
        const task = await Task.findOneAndUpdate({
            _id: req.params.id,
            userId: req.user!._id
        },{ status },
        { new: true }
    );
    if(!task) {
        return res.status(400).json({message:'task not found'})
    }
    res.json({message:'Task status updated successfully', task});
        
    } catch (error: any) {
        console.error(error);
        res.status(500).json({message:'Updation failed'});
        
    }
})

//DeleteTask
router.delete('/:id', async(req:AuthRequest, res: any) => {
    try {
        const task = await Task.findOneAndDelete({
            _id:req.params.id,
            userId:req.user!._id
        });

        if(!task) {
            res.status(400).json({message:'task not found'});
        }
        res.json({message:'task deleted successfully', deletedtask:{
            id:task?._id,
            title:task?.title

        }});
    } catch (error: any) {
        console.error(error);
        res.status(500).json({message:'Updation failed'});       
    }
})


export default router;