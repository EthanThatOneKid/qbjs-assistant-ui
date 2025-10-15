import { tool } from "ai";
import { z } from "zod";

export const basicCodeTool = tool({
  description:
    "Generate BASIC programming code with interactive iframe. Use when user asks for code generation or programming examples. The result will be displayed as an interactive iframe that runs the code in QBJS.",
  inputSchema: z.object({
    programData: z
      .string()
      .describe(
        "JSON string containing the program data with title, description, code, and features",
      ),
  }),
  execute: async ({ programData }) => {
    try {
      // Validate input
      if (!programData || typeof programData !== "string") {
        throw new Error("Invalid programData: must be a non-empty string");
      }

      // Parse JSON with better error handling
      let data;
      try {
        data = JSON.parse(programData);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        console.error("Program data received:", programData);
        throw new Error(
          `Invalid JSON format: ${parseError instanceof Error ? parseError.message : "Unknown error"}`,
        );
      }

      // Validate required fields
      if (!data || typeof data !== "object") {
        throw new Error("Program data must be an object");
      }

      // Encode the code for QBJS URL.
      const code = String(data.code || "");
      const encodedCode = Buffer.from(code).toString("base64");

      // Create URL for external link (mode=code)
      const qbjsUrl = new URL("https://qbjs.org/index.html");
      qbjsUrl.searchParams.set("mode", "code");
      qbjsUrl.searchParams.set("code", encodedCode);

      // Create URL for iframe (mode=auto)
      const qbjsIframeUrl = new URL("https://qbjs.org/index.html");
      qbjsIframeUrl.searchParams.set("mode", "auto");
      qbjsIframeUrl.searchParams.set("code", encodedCode);

      // Ensure consistent parameter order and format.
      const result = {
        title: String(data.title || "BASIC Program"),
        description: String(data.description || "A BASIC program"),
        code: code,
        features: Array.isArray(data.features) ? data.features : [],
        lineCount: code.split("\n").length,
        language: "BASIC",
        timestamp: new Date().toISOString(),
        qbjsUrl: qbjsUrl.toString(),
        qbjsIframeUrl: qbjsIframeUrl.toString(),
      };

      console.log("Tool executed with result:", result);
      return result;
    } catch (error) {
      console.error("Error in basicCodeTool:", error);
      console.error("Program data that caused error:", programData);

      // Create fallback URLs
      const fallbackUrl = "https://qbjs.org";
      const fallbackIframeUrl = "https://qbjs.org/index.html?mode=auto";

      return {
        title: "Error",
        description: `Failed to parse program data: ${error instanceof Error ? error.message : "Unknown error"}`,
        code: "ERROR: Invalid program data",
        features: [],
        lineCount: 1,
        language: "BASIC",
        timestamp: new Date().toISOString(),
        qbjsUrl: fallbackUrl,
        qbjsIframeUrl: fallbackIframeUrl,
      };
    }
  },
});
