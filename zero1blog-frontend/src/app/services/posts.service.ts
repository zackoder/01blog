import { Injectable, signal } from '@angular/core';

export interface Post {
  content: string;
  created_at: number;
  dislikes: number;
  id: number;
  image_path: string;
  likes: number;
  nickname: string;
  postOwner: boolean;
  reacted: string;
  user_id: number;
  visibility: boolean;
  avatar: string;
}

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private _posts = signal<Post[]>([]);

  public posts = this._posts.asReadonly();
  public postLen = this._posts().length;

  constructor() {}
  setPosts(newPosts: Post[]) {
    return this._posts.update((current) => [...current, ...newPosts]);
  }

  deletePost(index: number) {
    this._posts.update((current) => {
      const newPosts = [...current];
      newPosts.splice(index, 1);
      return [...newPosts];
    });
  }
  deleteAll() {
    this._posts.set([]);
  }
}
