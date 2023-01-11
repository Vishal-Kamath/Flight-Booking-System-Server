import mongoose from 'mongoose';

async function connectToDb() {
  const database_uri = process.env.DATABASE_URI;
  mongoose.set('strictQuery', false);
  try {
    if (!database_uri) throw Error('Datebase Uri not defined');
    await mongoose.connect(database_uri);
    console.log('connected to DB');
  } catch (error: any) {
    console.log(`Could not connect to Db \n${(error as Error).stack}`);
    process.exit(1);
  }
}

export default connectToDb;
