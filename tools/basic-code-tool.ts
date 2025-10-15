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

// Normalize and sanitize code to avoid Unicode artifacts in QBJS/QB64
function sanitizeBasicCode(input: string): string {
  // Normalize to NFC to keep characters consistent
  let sanitized = input.normalize("NFC");

  // Replace curly quotes and dashes with ASCII equivalents
  sanitized = sanitized
    .replace(/[\u2018\u2019\u2032]/g, "'") // single quotes / primes
    .replace(/[\u201C\u201D\u2033]/g, '"') // double quotes
    .replace(/[\u2013\u2014]/g, "-"); // en/em dashes

  // Replace non-breaking spaces with regular spaces
  sanitized = sanitized.replace(/\u00A0/g, " ");

  // Remove zero-width and BOM characters that can corrupt editors
  sanitized = sanitized.replace(/[\u200B-\u200D\uFEFF]/g, "");

  // Standardize line endings to \n
  sanitized = sanitized.replace(/\r\n?|\n/g, "\n");

  // Finally, coerce to printable ASCII (allow tab, newline)
  sanitized = sanitized.replace(/[^\t\n\r\x20-\x7E]/g, "?");

  return sanitized;
}

// Base64 encoding function for QBJS compatibility
function encodeUnicodeBase64(str: string): string {
  // Convert Unicode string to UTF-8 bytes, then encode as base64
  const utf8Bytes = new TextEncoder().encode(str);
  const binaryString = Array.from(utf8Bytes, (byte) =>
    String.fromCharCode(byte),
  ).join("");
  return btoa(binaryString);
}

// Base64 decoding function for QBJS compatibility
function decodeUnicodeBase64(str: string): string {
  // Decode base64 to binary and convert UTF-8 bytes back to Unicode
  const binaryString = atob(str);
  const utf8Bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    utf8Bytes[i] = binaryString.charCodeAt(i);
  }
  return new TextDecoder().decode(utf8Bytes);
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
      const code = sanitizeBasicCode(String(data.code || ""));
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
