export interface PgCommunity {
  id: string;
  name: string;
  address: string;
  description?: string;
  pgCode: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  residents?: Resident[];
}

export interface Resident {
  id: string;
  name: string;
  email: string;
  phone?: string;
  roomNumber?: string;
  joinedAt: string;
}

export interface PgCommunityStats {
  totalResidents: number;
  occupancyRate: number;
  totalRooms: number;
  occupiedRooms: number;
  monthlyRevenue: number;
}

export interface CreatePgCommunityData {
  name: string;
  address: string;
  description?: string;
}

export interface UpdatePgCommunityData {
  name?: string;
  address?: string;
  description?: string;
}
