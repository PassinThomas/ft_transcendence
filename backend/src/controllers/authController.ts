import { FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcrypt';
import { db } from '../services/database.js';
import { AuthRequest, RegisterRequest, JWTPayload } from '../types/index.js';

class AuthController {
  async login(request: FastifyRequest<{ Body: AuthRequest }>, reply: FastifyReply) {
    try {
      const { username, password } = request.body;

      const user = await db.findUserByUsername(username);

      if (!user) {
        return reply.code(401).send({ 
          error: 'Unauthorized',
          message: 'Invalid credentials' 
        });
      }

      const isValid = await bcrypt.compare(password, user.password!);
      console.log('isValid:', isValid); // Debugging line
      if (!isValid) {
        return reply.code(401).send({ 
          error: 'Unauthorized',
          message: 'Invalid credentials' 
        });
      }

      await db.updateUser(user.id, { 
        lastLogin: new Date(),
        isOnline: true 
      });

      const token = request.server.jwt.sign({
        userId: user.id,
        username: user.username
      });

      const { password: _, ...userWithoutPassword } = user;

      return reply.send({
        user: userWithoutPassword,
        token
      });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ 
        error: 'Internal Server Error',
        message: 'Login failed' 
      });
    }
  }

  async register(request: FastifyRequest<{ Body: RegisterRequest }>, reply: FastifyReply) {
    try {
      const { username, email, password } = request.body;

      const existingUser = await db.findUserByUsername(username);
      if (existingUser) {
        return reply.code(400).send({ 
          error: 'Bad Request',
          message: 'Username already exists' 
        });
      }

      const existingEmail = await db.findUserByEmail(email);
      if (existingEmail) {
        return reply.code(400).send({ 
          error: 'Bad Request',
          message: 'Email already registered' 
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = await db.createUser({
        username,
        email,
        password: hashedPassword
      });

      const token = request.server.jwt.sign({
        userId: user.id,
        username: user.username
      });

      const { password: _, ...userWithoutPassword } = user;

      return reply.code(201).send({
        user: userWithoutPassword,
        token
      });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ 
        error: 'Internal Server Error',
        message: 'Registration failed' 
      });
    }
  }

  async getCurrentUser(request: FastifyRequest, reply: FastifyReply) {
    try {
      // request.user est maintenant correctement typé
      const userId = request.user.userId;
      const user = await db.findUserById(userId);
      
      if (!user) {
        return reply.code(404).send({ 
          error: 'Not Found',
          message: 'User not found' 
        });
      }

      const { password: _, ...userWithoutPassword } = user;
      return reply.send(userWithoutPassword);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ 
        error: 'Internal Server Error',
        message: 'Failed to get user' 
      });
    }
  }

  async logout(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user.userId;
      
      await db.updateUser(userId, { isOnline: false });
      
      return reply.send({ 
        message: 'Logged out successfully' 
      });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ 
        error: 'Internal Server Error',
        message: 'Logout failed' 
      });
    }
  }
}

export const authController = new AuthController();