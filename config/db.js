const mongoose = require("mongoose");

const connectingToDB = async () => {
  try {
    const connecting = await mongoose.connect(`${process.env.MONGO_DB_URL}`);
    console.log(`connected to database ${connecting.connection.host}`);
  } catch (err) {
    console.log(`could not connect- ${err}`);
  }
};
module.exports = connectingToDB;