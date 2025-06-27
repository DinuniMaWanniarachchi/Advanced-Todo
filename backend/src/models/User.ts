// src/models/User.ts
export interface User {
  id: number;
  username: string;
  email: string;
  password: string; // hashed password
}

// Simulating a simple in-memory user store for now (replace with DB later)
export const users: User[] = [];
