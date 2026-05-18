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
  createdAt: string;
  updatedAt: string;
  requester: FriendshipUser;
  addressee: FriendshipUser;
};
