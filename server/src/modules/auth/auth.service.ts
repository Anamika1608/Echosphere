import { prisma } from '../../lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../config';

import { User, UserRole } from '@prisma/client';

import { AppError } from '../../utils/errors';

interface SignupData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  profilePicture?: string;
  pgCode?: string; // For residents - the PG code to join
}

interface CreatePgCommunityData {
  name: string;
  address: string;
  description?: string;
  ownerId: string;
}

const jwtSecret = config.jwtSecret

export const authService = {
  async signup(data: SignupData) {
    console.log("data", data);

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });
    if (existingUser) {
      throw new AppError('Email already in use', 409);
    }

    let pgCommunityId = null;

    // If role is RESIDENT, validate and find pgCommunity by pgCode
    if (data.role === 'RESIDENT') {
      if (!data.pgCode) {
        throw new AppError('PG Code is required for residents', 400);
      }

      // Find the PG community by pgCode
      const pgCommunity = await prisma.pgCommunity.findUnique({
        where: { pgCode: data.pgCode }
      });

      if (!pgCommunity) {
        throw new AppError('Invalid PG Code', 400);
      }

      pgCommunityId = pgCommunity.id;
    }

    // If role is PG_OWNER, pgCode should not be provided
    if (data.role === 'PG_OWNER' && data.pgCode) {
      throw new AppError('PG Owner should not provide PG Code during signup', 400);
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
        profilePicture: data.profilePicture,
        pgCommunityId: pgCommunityId,
      },
      include: {
        pgCommunity: data.role === 'RESIDENT',
        ownedPgCommunities: data.role === 'PG_OWNER',
      }
    });

    const { password, ...userWithoutPassword } = user;


    const token = jwt.sign(
      { userId: user.id, role: user.role },
      jwtSecret,
      { expiresIn: '7d' }
    );

    return { user: userWithoutPassword, token };
  },

  async login(data: Pick<User, 'email' | 'password'>) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: {
        pgCommunity: true,
        ownedPgCommunities: true,
      }
    });

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    const { password, ...userWithoutPassword } = user;


    const token = jwt.sign(
      { userId: user.id, role: user.role },
      jwtSecret,
      { expiresIn: '7d' }
    );

    return { user: userWithoutPassword, token };
  },

  // Helper method to get user by ID with role-specific data
  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        pgCommunity: {
          include: {
            owner: {
              select: { id: true, name: true, email: true }
            }
          }
        },
        ownedPgCommunities: {
          include: {
            residents: {
              select: { id: true, name: true, email: true }
            },
            _count: {
              select: {
                residents: true,
                issues: true,
                services: true
              }
            }
          }
        },
        raisedIssues: true,
        requestedServices: true,
      }
    });


    if (!user) {
      throw new AppError('User not found', 404);
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  // Method to create a new PG community (only for PG owners)
  async createPgCommunity(data: CreatePgCommunityData) {
    // Verify that the owner exists and is a PG_OWNER
    const owner = await prisma.user.findUnique({
      where: {
        id: data.ownerId,
        role: 'PG_OWNER'
      }
    });

    if (!owner) {
      throw new AppError('Invalid owner ID or user is not a PG Owner', 400);
    }

    // Generate a unique PG code
    const pgCode = await this.generateUniquePgCode();

    const pgCommunity = await prisma.pgCommunity.create({
      data: {
        name: data.name,
        address: data.address,
        description: data.description,
        pgCode: pgCode,
        ownerId: data.ownerId,
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true }
        },
        _count: {
          select: {
            residents: true,
            issues: true,
            services: true
          }
        }
      }
    });

    return pgCommunity;
  },

  // Method to generate unique PG code
  async generateUniquePgCode(): Promise<string> {
    let pgCode: string;
    let isUnique = false;

    while (!isUnique) {
      // Generate a 6-character alphanumeric code
      pgCode = Math.random().toString(36).substring(2, 8).toUpperCase();

      const existing = await prisma.pgCommunity.findUnique({
        where: { pgCode }
      });

      if (!existing) {
        isUnique = true;
      }
    }

    return pgCode!;
  },

  // Method to get PG community by pgCode (for residents to see details before joining)
  async getPgCommunityByCode(pgCode: string) {
    const pgCommunity = await prisma.pgCommunity.findUnique({
      where: { pgCode },
      include: {
        owner: {
          select: { id: true, name: true, email: true }
        },
        _count: {
          select: {
            residents: true
          }
        }
      }
    });

    if (!pgCommunity) {
      throw new AppError('PG Community not found', 404);
    }

    return pgCommunity;
  },

  // Method to get all PG communities for a specific owner
  async getPgCommunitiesByOwner(ownerId: string) {
    const pgCommunities = await prisma.pgCommunity.findMany({
      where: { ownerId },
      include: {
        _count: {
          select: {
            residents: true,
            issues: true,
            services: true,
            technicians: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return pgCommunities;
  }
};