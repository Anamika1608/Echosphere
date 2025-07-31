import axios from 'axios';
import type { CreatePgCommunityData, PgCommunity, PgCommunityStats, Resident, UpdatePgCommunityData } from '@/types/pgCommunity';
import { serverUrl } from "@/utils";

const api = axios.create({
  baseURL: serverUrl,
  withCredentials: true,
});

export const pgCommunityService = {
  // Create new PG community
  createPgCommunity: async (data: CreatePgCommunityData): Promise<PgCommunity> => {
    const response = await api.post('/pg-community', data);
    return response.data.data;
  },

  // Get all communities owned by user
  getMyPgCommunities: async (): Promise<PgCommunity[]> => {
    const response = await api.get('/pg-community/my-communities');
    return response.data.data;
  },

  // Get specific community by ID
  getPgCommunityById: async (id: string): Promise<PgCommunity> => {
    const response = await api.get(`/pg-community/${id}`);
    return response.data.data;
  },

  // Update PG community
  updatePgCommunity: async (id: string, data: UpdatePgCommunityData): Promise<PgCommunity> => {
    const response = await api.put(`/pg-community/${id}`, data);
    return response.data.data;
  },

  // Delete PG community
  deletePgCommunity: async (id: string): Promise<void> => {
    await api.delete(`/pg-community/${id}`);
  },

  // Get community stats
  getPgCommunityStats: async (id: string): Promise<PgCommunityStats> => {
    const response = await api.get(`/pg-community/${id}/stats`);
    return response.data.data;
  },

  // Get community residents
  getPgCommunityResidents: async (id: string): Promise<{ pgCommunity: PgCommunity; residents: Resident[]; count: number }> => {
    const response = await api.get(`/pg-community/${id}/residents`);
    return response.data.data;
  },
};