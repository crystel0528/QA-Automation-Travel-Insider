// 1️⃣ Load environment variables first
import dotenv from "dotenv";
dotenv.config();

// 2️⃣ Import other modules
import OpenAI from "openai";
import fs from "fs";

// 3️⃣ Create OpenAI client using the API key from .env
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 4️⃣ Your script logic
async function generateTestCode(scenario) {
  const prompt = `
You are a QA engineer. Convert the following scenario into a Playwright test script in JavaScript:

Scenario: ${scenario}

Include async/await syntax, mouse overlay, and slowMo.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0
  });

  const code = response.choices[0].message.content;
  fs.writeFileSync("generated-test.spec.js", code);
  console.log("✅ Test script generated: generated-test.spec.js");
}

// Example usage
generateTestCode("Open Travel Insider homepage, click Sign In, fill email/password, submit, verify homepage appears.");
