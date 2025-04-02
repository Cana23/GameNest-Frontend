export interface CommentCreate {
  publicacionId: number;
  contenido: string;
}

export interface CommentUpdate {
  contenido: string;
}

export interface CommentResponse {
  id: number;
  nombreUsuario: string;
  contenido: string;
  fechaComentario: string;
}