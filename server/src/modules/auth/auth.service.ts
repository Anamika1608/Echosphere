import { prisma } from '../../lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../config';

import { User } from '@prisma/client';

import { AppError } from '../../utils/errors';

export const authService = {
  async signup(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) {
    console.log("data", data)
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      throw new AppError('Email already in use', 409);
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });

    const { password, ...userWithoutPassword } = user;

    const token = jwt.sign({ userId: user.id }, config.jwtSecret, {
      expiresIn: '7d',
    });

    return { user: userWithoutPassword, token };
  },

  async login(data: Pick<User, 'email' | 'password'>) {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    const { password, ...userWithoutPassword } = user;

    const token = jwt.sign({ userId: user.id }, config.jwtSecret, {
      expiresIn: '7d',
    });

    return { user: userWithoutPassword, token };
  },
};