module.exports = {
  posts: [
    { id: 1, title: 'Test1' },
    { id: 2, title: 'Test2' },
    { id: 3, title: 'Test3' },
    { id: 4, title: 'Test4' },
    { id: 5, title: 'Test5' },
  ],
  
  getPosts() {
    return this.posts;
  },
  
  getUserPosts(userId) {
    return this.posts;
  }
}