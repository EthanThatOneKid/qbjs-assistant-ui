import { google } from "@ai-sdk/google";
import { convertToModelMessages, streamText, UIMessage } from "ai";
import { basicCodeTool } from "@/tools/basic-code-tool";

// Few-shot learning examples inspired by QB64.com samples.
// https://qb64.com/samples.html
// https://github.com/boxgaming/qbjs/wiki/Samples
const examples = [
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
            code: `RANDOMIZE TIMER
PRINT "Welcome to the Dice Game!"
DO
    INPUT "Roll dice? (Y/N): ", ANSWER$
    IF UCASE$(ANSWER$) = "N" THEN EXIT DO
    DICE1 = INT(RND * 6) + 1
    DICE2 = INT(RND * 6) + 1
    PRINT "Dice 1: "; DICE1; " Dice 2: "; DICE2; " Total: "; DICE1 + DICE2
LOOP
END`,
          }),
        },
      },
    ],
  },
  {
    role: "user" as const,
    content: "Show me binary numbers from 0 to 15",
  },
  {
    role: "assistant" as const,
    content: "I'll create a program that displays binary numbers!",
    toolCalls: [
      {
        toolCallId: "binary-counter-1",
        toolName: "generateBasicCode",
        input: {
          programData: JSON.stringify({
            title: "Binary Counter",
            description:
              "Displays decimal numbers and their binary equivalents from 0 to 15",
            code: `PRINT "Decimal to Binary Conversion"
PRINT "========================"
FOR I = 0 TO 15
    PRINT I; " = "; BIN$(I)
NEXT I
END`,
          }),
        },
      },
    ],
  },
  {
    role: "user" as const,
    content: "Draw some colorful circles",
  },
  {
    role: "assistant" as const,
    content: "I'll create a graphics program with colorful circles!",
    toolCalls: [
      {
        toolCallId: "graphics-circles-1",
        toolName: "generateBasicCode",
        input: {
          programData: JSON.stringify({
            title: "Colorful Circles",
            description:
              "Draws concentric circles in different colors using graphics mode",
            code: `SCREEN 12
PRINT "Drawing colorful circles..."
CIRCLE (320, 240), 100, 15
CIRCLE (320, 240), 80, 14
CIRCLE (320, 240), 60, 13
CIRCLE (320, 240), 40, 12
CIRCLE (320, 240), 20, 10
SLEEP
END`,
          }),
        },
      },
    ],
  },
  {
    role: "user" as const,
    content: "Calculate the Fibonacci sequence",
  },
  {
    role: "assistant" as const,
    content:
      "I'll create a program that calculates and displays the Fibonacci sequence!",
    toolCalls: [
      {
        toolCallId: "fibonacci-1",
        toolName: "generateBasicCode",
        input: {
          programData: JSON.stringify({
            title: "Fibonacci Sequence",
            description:
              "Calculates and displays the first 15 numbers in the Fibonacci sequence",
            code: `PRINT "Fibonacci Sequence"
PRINT "=================="
A = 0: B = 1
PRINT A; B;
FOR I = 1 TO 13
    C = A + B
    PRINT C;
    A = B: B = C
NEXT I
PRINT
END`,
          }),
        },
      },
    ],
  },
  {
    role: "user" as const,
    content: "Create an interactive drawing program",
  },
  {
    role: "assistant" as const,
    content:
      "I'll create an interactive drawing program where you can draw with the mouse!",
    toolCalls: [
      {
        toolCallId: "drawing-program-1",
        toolName: "generateBasicCode",
        input: {
          programData: JSON.stringify({
            title: "Interactive Drawing Program",
            description:
              "An interactive drawing program that lets you draw by clicking and dragging the mouse",
            code: `SCREEN 12
PRINT "Interactive Drawing Program"
PRINT "Click and drag to draw!"
PRINT "Press any key to clear screen"
DO
    IF _MOUSEBUTTON(1) THEN
        PSET (_MOUSEX, _MOUSEY), 15
    END IF
    IF INKEY$ <> "" THEN CLS: PRINT "Screen cleared!"
LOOP`,
          }),
        },
      },
    ],
  },
  {
    role: "user" as const,
    content: "Make a particle effect",
  },
  {
    role: "assistant" as const,
    content:
      "I'll create a particle system that generates a fountain of particles!",
    toolCalls: [
      {
        toolCallId: "particle-system-1",
        toolName: "generateBasicCode",
        input: {
          programData: JSON.stringify({
            title: "Particle Fountain",
            description:
              "Creates a particle fountain effect with randomly positioned circles",
            code: `SCREEN 12
PRINT "Particle Fountain Effect"
FOR FRAME = 1 TO 50
    CLS
    FOR I = 1 TO 30
        X = 320 + (RND - 0.5) * 100
        Y = 200 + (RND - 0.5) * 100
        COLOR = INT(RND * 15) + 1
        CIRCLE (X, Y), 3, COLOR
    NEXT I
    SLEEP 0.1
NEXT FRAME
END`,
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
- code: The BASIC code (without line numbers)

Generate modern BASIC code without line numbers, following these guidelines:
- Use structured programming constructs (DO...LOOP, FOR...NEXT, IF...THEN...END IF)
- Avoid GOTO statements in favor of structured loops
- Use proper indentation for readability
- Include educational comments where helpful
- Make code compatible with QB64/QBJS

IMPORTANT: The programData must be a valid JSON string. Use proper JSON formatting.`,
  };

  const result = streamText({
    model: google("models/gemini-2.5-flash"),
    messages: [systemMessage, ...examples, ...convertToModelMessages(messages)],
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
