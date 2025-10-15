import { tool } from "ai";
import { z } from "zod";

// Tool input schema - using single parameter to avoid streaming issues
export const BasicCodeInputSchema = z.object({
  programData: z
    .string()
    .describe(
      "JSON string containing the program data with title, description, and code",
    ),
});

// Type definition for the tool input
export type BasicCodeInput = z.infer<typeof BasicCodeInputSchema>;

// Zod schema for the tool response
export const BasicCodeResponseSchema = z.object({
  title: z.string(),
  description: z.string(),
  code: z.string(),
  features: z.array(z.string()),
  lineCount: z.number(),
  language: z.string(),
  timestamp: z.string(),
  qbjsUrl: z.string().url(),
  qbjsIframeUrl: z.string().url(),
});

// Type definition for the response using satisfies
export type BasicCodeResponse = z.infer<typeof BasicCodeResponseSchema>;

// Base64 encoding function for QBJS compatibility
function encodeUnicodeBase64(str: string): string {
  // QBJS expects direct base64 encoding without URI encoding
  return btoa(str);
}

// Base64 decoding function for QBJS compatibility
function decodeUnicodeBase64(str: string): string {
  // QBJS uses direct base64 encoding without URI encoding
  return atob(str);
}

export const basicCodeTool = tool({
  description:
    "Generate BASIC programming code with interactive iframe. Use when user asks for code generation or programming examples. The result will be displayed as an interactive iframe that runs the code in QBJS.",
  inputSchema: BasicCodeInputSchema,
  execute: async ({ programData }, { abortSignal }) => {
    try {
      // Check if operation was aborted
      if (abortSignal?.aborted) {
        throw new Error("Operation was aborted");
      }

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

      // Extract and validate code
      const code = String(data.code || "");
      const title = String(data.title || "BASIC Program");
      const description = String(data.description || "A BASIC program");

      // Validate code is not empty
      if (!code.trim()) {
        throw new Error("Code cannot be empty");
      }

      // Use Unicode-safe base64 encoding that handles all characters properly
      let encodedCode;
      try {
        // Check for abort before encoding
        if (abortSignal?.aborted) {
          throw new Error("Operation was aborted");
        }

        encodedCode = encodeUnicodeBase64(code);

        // Validate the encoding worked
        if (!encodedCode || encodedCode.length === 0) {
          throw new Error("Base64 encoding resulted in empty string");
        }

        // Test that we can decode it back to verify integrity
        const testDecoded = decodeUnicodeBase64(encodedCode);
        if (testDecoded !== code) {
          throw new Error(
            "Encoding/decoding round-trip failed - data integrity issue",
          );
        }
      } catch (encodingError) {
        console.error("Unicode-safe base64 encoding failed:", encodingError);
        throw new Error(
          `Failed to encode code: ${encodingError instanceof Error ? encodingError.message : "Unknown encoding error"}`,
        );
      }

      // Create URL for external link (mode=code)
      const qbjsUrl = new URL("https://qbjs.org/index.html");
      qbjsUrl.searchParams.set("mode", "code");
      qbjsUrl.searchParams.set("code", encodedCode);

      // Create URL for iframe (mode=auto)
      const qbjsIframeUrl = new URL("https://qbjs.org/index.html");
      qbjsIframeUrl.searchParams.set("mode", "auto");
      qbjsIframeUrl.searchParams.set("code", encodedCode);

      // Ensure consistent parameter order and format.
      const resultData = {
        title: title,
        description: description,
        code: code,
        features: [], // No features for now, keeping it simple
        lineCount: code.split("\n").length,
        language: "BASIC",
        timestamp: new Date().toISOString(),
        qbjsUrl: qbjsUrl.toString(),
        qbjsIframeUrl: qbjsIframeUrl.toString(),
      } satisfies BasicCodeResponse;

      // Validate the result against the schema
      const result: BasicCodeResponse =
        BasicCodeResponseSchema.parse(resultData);

      console.log("Tool executed with result:", result);
      return result;
    } catch (error) {
      console.error("Error in basicCodeTool:", error);

      // Check if operation was aborted
      if (abortSignal?.aborted) {
        throw new Error("Operation was aborted");
      }

      // Create fallback URLs
      const fallbackUrl = "https://qbjs.org";
      const fallbackIframeUrl = "https://qbjs.org/index.html?mode=auto";

      const errorResultData = {
        title: "Error",
        description: `Failed to generate program: ${error instanceof Error ? error.message : "Unknown error"}`,
        code: "ERROR: Program generation failed",
        features: [],
        lineCount: 1,
        language: "BASIC",
        timestamp: new Date().toISOString(),
        qbjsUrl: fallbackUrl,
        qbjsIframeUrl: fallbackIframeUrl,
      } satisfies BasicCodeResponse;

      // Validate the error result against the schema
      return BasicCodeResponseSchema.parse(errorResultData);
    }
  },
});
