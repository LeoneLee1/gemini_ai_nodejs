const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("YOUR_API_KEY");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const fs = require("fs");

function fileToGenerativePart(path, mimeType) {
  if (fs.existsSync(path)) {
    return {
      inlineData: {
        data: Buffer.from(fs.readFileSync(path)).toString("base64"),
        mimeType,
      },
    };
  }
  return null;
}

async function run() {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = "apa perbedaan diantara kedua gambar tersebut?";

  const imagePaths = ["assets/img/ayam-goreng.jpg", "assets/img/beef-teriyaki.jpg"];
  const imageParts = imagePaths.map((path) => fileToGenerativePart(path, path.endsWith(".png") ? "image/png" : "image/jpeg")).filter((part) => part !== null);

  const inputs = [prompt, ...imageParts];

  try {
    const result = await model.generateContent(inputs);
    const response = await result.response;
    const text = response.text();
    console.log(text);
  } catch (error) {
    console.error("Error generating content:", error);
  }
}

run();
