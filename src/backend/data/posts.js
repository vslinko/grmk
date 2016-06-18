module.exports = {
  posts: [
    { id: 1, title: 'q' },
  ],
  getUserPosts(userId) {
    return this.posts;
  }
}