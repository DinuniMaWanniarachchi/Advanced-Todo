import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { users, User } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username, email, password } = req.body;
    const existingUser = users.find(u => u.email === email);

    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: User = { id: Date.now(), username, email, password: hashedPassword };

    users.push(newUser);
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (error) {
    next(error);
  }
};
