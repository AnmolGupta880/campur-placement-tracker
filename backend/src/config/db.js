import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("❌ ERROR: MONGO_URI is not defined in environment variables");
      console.error("💡 Please create a .env file with:");
      console.error("   MONGO_URI=mongodb://localhost:27017/campus-placement");
      console.error("   OR for MongoDB Atlas:");
      console.error("   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority");
      process.exit(1);
    }

    // Validate connection string format
    // Strip surrounding quotes that some hosting dashboards may inject
    const mongoUri = process.env.MONGO_URI.trim().replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
    
    if (!mongoUri.startsWith("mongodb://") && !mongoUri.startsWith("mongodb+srv://")) {
      console.error("❌ ERROR: Invalid MONGO_URI format");
      console.error("💡 Connection string must start with 'mongodb://' or 'mongodb+srv://'");
      process.exit(1);
    }

    console.log("🔄 Attempting to connect to MongoDB...");
    
   const conn = await mongoose.connect(mongoUri, {
  serverSelectionTimeoutMS: 10000,
  family: 4, // force IPv4 (safe + recommended)
});


    
    console.log(`✅ MongoDB connected successfully!`);
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    
    // Handle connection events
    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️  MongoDB disconnected - attempting to reconnect...");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("✅ MongoDB reconnected");
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("\n✅ MongoDB connection closed gracefully");
      process.exit(0);
    });

  } catch (error) {
    console.error("\n❌ MongoDB connection failed!");
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    if (error.message.includes("authentication failed") || error.message.includes("bad auth")) {
      console.error("🔐 Authentication Error:");
      console.error("   Your MongoDB username or password is incorrect.");
      console.error("\n💡 Solutions:");
      console.error("   1. Check your username and password in the connection string");
      console.error("   2. For MongoDB Atlas:");
      console.error("      - Verify your database user credentials");
      console.error("      - Check if your IP is whitelisted");
      console.error("      - Ensure the database user has proper permissions");
      console.error("   3. For local MongoDB:");
      console.error("      - Make sure MongoDB is running: mongod");
      console.error("      - Check if authentication is required");
      console.error("\n📝 Connection string format:");
      console.error("   mongodb://username:password@host:port/database");
      console.error("   OR");
      console.error("   mongodb+srv://username:password@cluster.mongodb.net/database");
    } else if (error.message.includes("ENOTFOUND") || error.message.includes("getaddrinfo")) {
      console.error("🌐 Network Error:");
      console.error("   Cannot reach MongoDB server.");
      console.error("\n💡 Solutions:");
      console.error("   1. Check your internet connection");
      console.error("   2. Verify the host/URL in your connection string");
      console.error("   3. For MongoDB Atlas: Check if cluster is running");
      console.error("   4. For local MongoDB: Make sure MongoDB service is running");
    } else if (error.message.includes("timeout")) {
      console.error("⏱️  Connection Timeout:");
      console.error("   Server took too long to respond.");
      console.error("\n💡 Solutions:");
      console.error("   1. Check if MongoDB server is running");
      console.error("   2. Verify firewall settings");
      console.error("   3. Check network connectivity");
    } else {
      console.error("❌ Error:", error.message);
      console.error("\n💡 Common issues:");
      console.error("   1. MongoDB server is not running");
      console.error("   2. Incorrect connection string format");
      console.error("   3. Network/firewall blocking connection");
      console.error("   4. Database credentials are incorrect");
    }
    
    console.error("\n📋 Your current MONGO_URI (first 50 chars):");
    const uriPreview = process.env.MONGO_URI.substring(0, 50);
    console.error(`   ${uriPreview}...`);
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    
    process.exit(1);
  }
};

export default connectDB;
