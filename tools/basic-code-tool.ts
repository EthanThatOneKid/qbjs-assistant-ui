import { tool } from "ai";
import { z } from "zod";

export const basicCodeTool = tool({
  description:
    "Generate BASIC programming code with beautiful UI. Use when user asks for code generation or programming examples.",
  inputSchema: z.object({
    programData: z
      .string()
      .describe(
        "JSON string containing the program data with title, description, code, and features",
      ),
  }),
  execute: async ({ programData }) => {
    try {
      const data = JSON.parse(programData);

      // Encode the code for QBJS URL
      const code = String(data.code || "");
      const encodedCode = Buffer.from(code).toString("base64");
      const qbjsUrl = `https://qbjs.org/index.html?code=${encodedCode}`;

      // Ensure consistent parameter order and format
      const result = {
        title: String(data.title || "BASIC Program"),
        description: String(data.description || "A BASIC program"),
        code: code,
        features: Array.isArray(data.features) ? data.features : [],
        lineCount: code.split("\n").length,
        language: "BASIC",
        timestamp: new Date().toISOString(),
        qbjsUrl: qbjsUrl,
      };

      console.log("Tool executed with result:", result);
      return result;
    } catch (error) {
      console.error("Error parsing program data:", error);
      return {
        title: "Error",
        description: "Failed to parse program data",
        code: "ERROR: Invalid program data",
        features: [],
        lineCount: 1,
        language: "BASIC",
        timestamp: new Date().toISOString(),
        qbjsUrl: "https://qbjs.org",
      };
    }
  },
});
