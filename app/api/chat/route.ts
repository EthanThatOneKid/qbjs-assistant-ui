import { google } from "@ai-sdk/google";
import { convertToModelMessages, stepCountIs, streamText, UIMessage } from "ai";
import { basicCodeTool } from "@/tools/basic-code-tool";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const result = streamText({
    model: google("models/gemini-2.5-flash"),
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(5), // Allow up to 5 steps for multi-step tool calls
    tools: {
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
    },
  });

  return result.toUIMessageStreamResponse({
    onError: (error) => {
      console.error("Stream error:", error);
      return "An error occurred while processing your request. Please try again.";
    },
  });
}
