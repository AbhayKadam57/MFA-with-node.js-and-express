import { connect } from "mongoose";

const dbConnect = async () => {
  const mongoDBConnection = await connect(`${process.env.MONGOURI}`);

  console.log("Database connected:" + `${mongoDBConnection.connection.host}`);

  try {
  } catch (e) {
    console.log(`Database connect failed ${e}`);
    process.exit(1);
  }
};

export default dbConnect;
