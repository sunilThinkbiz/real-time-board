export interface BoardUser {
  uid: string;
  displayName?: string;
  email?: string;
  photoURL?: string;
  online: boolean;
}

export interface AvatarProps {
  user: BoardUser;
  size: React.CSSProperties;
  onlineDotStyle: React.CSSProperties;
}