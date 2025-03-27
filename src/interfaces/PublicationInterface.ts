export interface Comment {
  id: number;
  nombreUsuario: string;
  contenido: string;
  fechaComentario: string;
}

export interface Publication {
  id: number;
  title: string;
  content: string;
  imageUrl?: string;
  publicationDate: string;
  userId: string;
  userName: string;
  totalLikes: number;
  totalComments: number;
  comments: Comment[];
}
