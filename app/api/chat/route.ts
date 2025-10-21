import { createGoogleGenerativeAI } from "@ai-sdk/google";
import type { ModelMessage } from "ai";
import { convertToModelMessages, streamText, UIMessage } from "ai";
import { frontendTools } from "@assistant-ui/react-ai-sdk";
import { basicCodeTool } from "@/tools/basic-code-tool";
import samples from "./samples.json";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Examples are imported from examples.json

export async function POST(req: Request) {
  const {
    messages,
    system,
    tools,
  }: {
    messages: UIMessage[];
    system?: string; // System message forwarded from AssistantChatTransport
    tools?: Record<string, unknown>; // Frontend tools forwarded from AssistantChatTransport
  } = await req.json();

  // Get API key from environment variable or authorization header
  const envApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  const authHeader = req.headers.get("authorization");
  const userApiKey = authHeader?.replace("Bearer ", "");

  // Use environment key if available, otherwise use user-provided key
  const apiKey = userApiKey || envApiKey;

  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error:
          "API key required. Please set GOOGLE_GENERATIVE_AI_API_KEY environment variable or provide API key via the sidebar.",
      }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  // Use system message from frontend if provided, otherwise use default
  const systemMessage =
    system ||
    `You are a BASIC programming assistant. Use the generateBasicCode tool when users ask for complete programs. 

The tool generates BASIC code and displays it as an interactive iframe that runs in QBJS, allowing users to immediately see and interact with their programs.

The tool takes a single parameter called "programData" which should be a JSON string containing:
- title: Program name
- description: What the program does  
- code: The BASIC code (without line numbers)

Generate modern BASIC code without line numbers, following these guidelines:
- Use structured programming constructs (DO...LOOP, FOR...NEXT, IF...THEN...END IF)
- Avoid GOTO statements in favor of structured loops
- Use proper indentation for readability
- Include educational comments where helpful
- Make code compatible with QB64/QBJS
- For graphics programs, use SCREEN 12 (640x480) for consistent display sizing
- Avoid using _NEWIMAGE with custom dimensions to ensure consistent iframe sizing

IMPORTANT: The programData must be a valid JSON string. Use proper JSON formatting.`;

  const googleAI = createGoogleGenerativeAI({
    apiKey: apiKey,
  });

  const result = streamText({
    model: googleAI("models/gemini-2.5-flash"),
    system: systemMessage, // Use the system message directly
    messages: [
      ...(samples as ModelMessage[]),
      ...convertToModelMessages(messages),
    ],
    tools: {
      // Wrap frontend tools with frontendTools helper if they exist
      ...(tools
        ? frontendTools(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            tools as Record<string, { description?: string; parameters: any }>,
          )
        : {}),
      // Backend tools
      generateBasicCode: basicCodeTool,
    },
    onStepFinish: ({ text, toolCalls, toolResults, finishReason, usage }) => {
      // Log step completion for debugging
      console.log("Step finished:", {
        hasText: !!text,
        toolCallsCount: toolCalls.length,
        toolResultsCount: toolResults.length,
        finishReason,
        usage,
      });

      // Log tool calls for debugging
      if (toolCalls.length > 0) {
        console.log(
          "Tool calls:",
          toolCalls.map((tc) => ({
            toolName: tc.toolName,
            toolCallId: tc.toolCallId,
            inputPreview: tc.input
              ? JSON.stringify(tc.input).substring(0, 200) + "..."
              : "No input",
          })),
        );
      }

      // Log tool results for debugging
      if (toolResults.length > 0) {
        console.log("Tool results count:", toolResults.length);
      }

      // Handle errors according to AI SDK best practices
      if (finishReason === "error") {
        console.error("Stream finished with error");
      }
    },
  });

  return result.toUIMessageStreamResponse({
    onError: (error) => {
      console.error("Stream error:", error);
      return "An error occurred while processing your request. Please try again.";
    },
  });
}
