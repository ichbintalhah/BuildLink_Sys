// We installed this package back in Step 2.2
const { GoogleGenerativeAI } = require("@google/genai");

// Import our models to read data
const Job = require("../models/Job");
const Contractor = require("../models/Contractor");

// Initialize Google AI with your API key from the .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generateChatResponse = async (req, res) => {
  try {
    const { message } = req.body; // Get the user's message

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    // --- Database Read Access (as per your blueprint) ---
    // 1. Fetch some data to give the AI context.
    // We'll get all job titles and their prices.
    const jobs = await Job.find({}, "title adminFixedPrice");
    let jobContext = "Job List:\n";
    jobs.forEach((job) => {
      jobContext += `- ${job.title} (Price: ${job.adminFixedPrice})\n`;
    });

    // 2. Define the "personality" and rules for the AI
    const systemPrompt = `
      You are "BuildLink AI," a helpful assistant for a construction website.
      - Your tone is professional, friendly, and helpful.
      - You must answer questions based *only* on the context provided.
      - Do not make up jobs or prices.
      - If a user asks for a service not in the list, politely say you cannot find it and suggest they contact the admin.
      - Here is the list of available jobs and their prices:
      ${jobContext}
    `;

    // 3. Start the chat with the AI model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const chat = model.startChat({
      history: [{ role: "user", parts: [{ text: systemPrompt }] }],
      generationConfig: {
        maxOutputTokens: 200, // Limit the response size
      },
    });

    // 4. Send the user's message and get a response
    const result = await chat.sendMessage(message);
    const response = result.response;
    const aiText = response.text();

    // 5. Send the AI's clean text response back to the user
    res.status(200).json({ reply: aiText });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ message: "Error communicating with AI service" });
  }
};
