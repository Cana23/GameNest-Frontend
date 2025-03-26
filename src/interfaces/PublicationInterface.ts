export interface Publication {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  publicationDate?: string;
  userId?: string;
  userName?: string;
  user?: any;
  likes?: any[];
  comments?: any[];
  hasLiked?:any[];
}
