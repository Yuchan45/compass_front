import type { PublicUser } from './auth';

export type FriendshipStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'BLOCKED';

export type FriendshipUser = Pick<
  PublicUser,
  'avatarUrl' | 'displayName' | 'email' | 'id' | 'username'
>;

export type Friendship = {
  id: string;
  requesterId: string;
  addresseeId: string;
  status: FriendshipStatus;
  acceptedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  requester: FriendshipUser;
  addressee: FriendshipUser;
};

export type AcceptedFriendship = {
  id: string;
  status: 'ACCEPTED';
  acceptedAt: string | null;
  createdAt: string;
  updatedAt: string;
  friend: FriendshipUser & {
    lastSeenAt: string | null;
  };
};

export type AcceptedFriendsResponse = {
  data: AcceptedFriendship[];
  pagination: {
    hasNextPage: boolean;
    limit: number;
    nextCursor: string | null;
  };
};
