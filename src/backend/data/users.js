module.exports = {
  users: [
    { id: 1, username: 'vslinko', email: 'vslinko@yahoo.com' },
  ],
  getUsers() {
    return this.users;
  },
  getById(id) {
    return this.users.find(user => String(user.id) === id)
  }
}