import { google } from "@ai-sdk/google";
import { convertToModelMessages, streamText, UIMessage } from "ai";
import { basicCodeTool } from "@/tools/basic-code-tool";

// Simple example to guide the AI
const example = [
  {
    role: "user" as const,
    content: "Create a dice game",
  },
  {
    role: "assistant" as const,
    content: "I'll create a fun dice game for you!",
    toolCalls: [
      {
        toolCallId: "dice-game-1",
        toolName: "generateBasicCode",
        input: {
          programData: JSON.stringify({
            title: "Dice Game",
            description:
              "A fun dice game that rolls two dice and shows special results",
            code: `10 RANDOMIZE TIMER
20 PRINT "Welcome to the Dice Game!"
30 INPUT "Roll dice? (Y/N): ", ANSWER$
40 IF UCASE$(ANSWER$) = "N" THEN GOTO 80
50 LET DICE1 = INT(RND * 6) + 1
60 LET DICE2 = INT(RND * 6) + 1
70 PRINT "Dice 1: "; DICE1; " Dice 2: "; DICE2; " Total: "; DICE1 + DICE2
75 GOTO 30
80 END`,
            features: ["Random numbers", "User input", "Conditional logic"],
          }),
        },
      },
    ],
  },
];

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const systemMessage = {
    role: "system" as const,
    content: `You are a BASIC programming assistant. Use the generateBasicCode tool when users ask for complete programs. 

The tool generates BASIC code and displays it as an interactive iframe that runs in QBJS, allowing users to immediately see and interact with their programs.

The tool takes a single parameter called "programData" which should be a JSON string containing:
- title: Program name
- description: What the program does
- code: The BASIC code
- features: Array of programming concepts (optional)

Example:
{
  "programData": "{\\"title\\": \\"Program Name\\", \\"description\\": \\"What the program does\\", \\"code\\": \\"The BASIC code here\\", \\"features\\": [\\"feature1\\", \\"feature2\\"]}"
}`,
  };

  const result = streamText({
    model: google("models/gemini-2.5-flash"),
    messages: [systemMessage, ...example, ...convertToModelMessages(messages)],
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

      // Log tool calls for debugging
      if (toolCalls.length > 0) {
        console.log(
          "Tool calls:",
          toolCalls.map((tc) => ({
            toolName: tc.toolName,
            toolCallId: tc.toolCallId,
          })),
        );
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
