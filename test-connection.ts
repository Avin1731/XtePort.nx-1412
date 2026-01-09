// Jalankan dengan: npx tsx test-connection.ts
import dotenv from "dotenv";
dotenv.config();

async function testConnection() {
  const secret = process.env.UPLOADTHING_SECRET;
  console.log("🔑 Testing Key:", secret ? secret.slice(0, 10) + "..." : "MISSING");

  try {
    const response = await fetch("https://api.uploadthing.com/api/serverCallback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-uploadthing-api-key": secret || "",
        "x-uploadthing-version": "6.4.0", // Versi protokol
      },
      body: JSON.stringify({}),
    });

    console.log("📡 Status:", response.status);
    const text = await response.text();
    console.log("📄 Response:", text);
  } catch (error) {
    console.error("❌ Network Error:", error);
  }
}

testConnection();