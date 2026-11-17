import mongoose from "mongoose";
let retryTimer;
let connecting = false;
let lastFailure;

export default async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn(
      "MONGODB_URI is not set. Contact form submissions will be unavailable.",
    );
    return false;
  }
  if (/<[^>]+>|YOUR_(USERNAME|PASSWORD|CLUSTER)|REPLACE_ME/i.test(uri)) {
    console.error(
      "MONGODB_URI still contains template placeholders. Replace them with the real MongoDB connection details in server/.env.",
    );
    return false;
  }
  if (mongoose.connection.readyState === 1) return true;
  if (connecting) return false;

  connecting = true;
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    clearTimeout(retryTimer);
    lastFailure = undefined;
    console.log("MongoDB connected");
    return true;
  } catch (error) {
    const failure = `${error.name}${error.code ? `, ${error.code}` : ""}`;
    if (failure !== lastFailure) {
      console.warn(
        `MongoDB is unavailable (${failure}). Check Atlas network access, credentials, and database availability. Retrying in 30 seconds.`,
      );
      lastFailure = failure;
    }
    // An initial Mongoose connection failure is not retried automatically.
    // Retry slowly so adding the machine to Atlas Network Access can recover
    // without restarting the API process.
    retryTimer = setTimeout(() => void connectDB(), 30000);
    retryTimer.unref?.();
    return false;
  } finally {
    connecting = false;
  }
}
