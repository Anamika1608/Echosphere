import { Request, Response, NextFunction } from 'express';
import config from '../config/index';
import { prisma } from '../lib/prisma';
import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = config.jwtSecret as string;

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.community_auth_token;

    if (!token) {
      console.log('No token found in cookies');
      return res.status(401).json({ message: 'No token provided' });
    }


    const decoded = jwt.verify(token, JWT_SECRET);

        console.log("token here", decoded)

    if (typeof decoded !== 'object' || !('userId' in decoded)) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId as string },
      include: {
        pgCommunity: true,
        ownedPgCommunities: true,
      },
    });

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user;
    console.log('Request received');

    next();
  } catch (error: any) {
    console.log('Authentication error:', error);
    return res.status(403).json({
      message: 'Authentication failed',
      error: error.message,
    });
  }
};
