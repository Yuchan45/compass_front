import type { PublicUser } from './auth';

export type SearchUserRelationship = {
  direction: 'received' | 'sent';
  id: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'BLOCKED';
};

export type SearchUserProfile = Pick<
  PublicUser,
  'avatarUrl' | 'displayName' | 'email' | 'id' | 'lastSeenAt' | 'username'
>;

export type SearchUserResult = {
  mutualFriendsCount: number;
  profile: SearchUserProfile;
  relationship: SearchUserRelationship | null;
};

export type SearchUsersResponse = {
  data: SearchUserResult[];
  meta: {
    limit: number;
    query: string | null;
  };
};
