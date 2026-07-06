import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use((req, res, next) => { console.log(req.method, req.url); next(); });

  app.get("/google15107b17e9305211.html", (req, res) => { res.send("google-site-verification: google15107b17e9305211.html"); });
  app.get("/sitemap.xml", (req, res) => { res.type("application/xml"); res.sendFile(path.join(process.cwd(), "public", "sitemap.xml")); });
  // API Routes
  app.post("/api/stylist", async (req, res) => {
    try {
      const { sareeName, sareeDetails, query } = req.body;
      
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [{
              text: `You are an elite, high-end virtual stylist for a bespoke Indian heritage handloom brand called Eliswa India. 
You are advising a patron on how to style the ${sareeName}. 
Details about the saree: ${sareeDetails}
The patron is asking: "${query}"

Provide styling advice with an editorial, elegant, and refined tone. Keep it concise (3-4 sentences). Suggest specific types of jewelry (e.g., antique temple jewelry, uncut diamonds, polki, oxidized silver, minimal gold) or occasion-specific draping and accessories.`
            }]
          }
        ]
      });

      res.json({ suggestion: response.text });
    } catch (error) {
      console.error("Error generating stylist recommendation:", error);
      res.status(500).json({ error: "Failed to generate styling advice." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
