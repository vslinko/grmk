module.exports = {
  posts: [
    { id: 1, title: 'Test1' },
    { id: 2, title: 'Test2' },
    { id: 3, title: 'Test3' },
    { id: 4, title: 'Test4' },
    { id: 5, title: 'Test5' },
  ],
  
  likes: [
    { postId: 1, weight: 1 },
    { postId: 2, weight: 1 },
    { postId: 3, weight: 1 },
    { postId: 4, weight: -1 },
  ],

  getPostById(id) {
    return this.posts.find(post => post.id === id);
  },
  
  like(postId) {
    this.likes.push({ postId, weight: 1 });
  },
  
  dislike(postId) {
    this.likes.push({ postId, weight: -1 });
  },
  
  getPosts() {
    return this.posts;
  },
  
  getUserPosts(userId) {
    return this.posts;
  },
  
  getPostLikes(postId) {
    return this.likes.filter(like => like.postId === postId);
  }
}