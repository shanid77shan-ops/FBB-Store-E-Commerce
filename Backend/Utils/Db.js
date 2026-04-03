import mongoose from 'mongoose';

const databaseConnection = async () => {
    try {
        // We removed the old useNewUrlParser and useUnifiedTopology options
        // because they are no longer needed in newer Node versions.
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected Successfully");
        return true;
    } catch (error) {
        console.error("❌ MongoDB Connection Error:");
        console.error(error.message);
        
        // If it's a DNS/ISP issue, this helps identify it
        if (error.message.includes('ECONNREFUSED')) {
            console.log("👉 Tip: Your ISP might be blocking MongoDB. Try the long-form MONGO_URI in your .env file.");
        }

        // Keep API process alive so the app doesn't crash in dev when DB/network is temporarily unavailable.
        return false;
    }
};

export default databaseConnection;