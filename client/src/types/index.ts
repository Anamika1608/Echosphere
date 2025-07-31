export type UserRole = 'PG_OWNER' | 'RESIDENT';

export interface PgCommunity {
  id: string;
  name: string;
  location: string;
}

export interface RaisedIssue {
  id: string;
  title: string;
  description: string;
}

export interface RequestedService {
  id: string;
  serviceName: string;
  description: string;
}

export interface User {
  id: string;
  name: string;
  profilePicture: string | null;
  email: string;
  role: UserRole;

  ownedPgCommunities?: PgCommunity[];
  pgCommunity?: PgCommunity | null;
  pgCommunityId?: string | null;

  raisedIssues?: RaisedIssue[];
  requestedServices?: RequestedService[];
}

