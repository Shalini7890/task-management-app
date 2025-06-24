
import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = express.Router();

router.post('/register', async (req: any, res: any) => {
    const { email, name, password } = req.body;
    
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User exists' });
        }

        const user = new User({ email, name, password });
        await user.save();

        const token = jwt.sign({ userId: user._id }, 'temp-secret', { expiresIn: '7d' });
        
        return res.status(201).json({
            message: 'Success',
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        console.error(error);
        
        return res.status(500).json({ message: 'Error' });
    }
});

router.post('/login', async (req: any, res: any) => {
    const { email, password } = req.body;
    
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isValid = await user.comparePassword(password);
        if (!isValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, 'temp-secret', { expiresIn: '7d' });
        
        return res.json({
            message: 'Success',
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error' });
    }
});

export default router;