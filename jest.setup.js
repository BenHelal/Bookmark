const { connectDB } = require('./server');

module.exports = async () => {
  await connectDB();
};