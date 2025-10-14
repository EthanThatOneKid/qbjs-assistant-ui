import { tool } from "ai";
import { z } from "zod";

// Sample BASIC code templates for different program types
const basicTemplates = {
  hello_world: {
    name: "Hello World",
    description: "A simple program that prints 'Hello, World!'",
    code: `10 PRINT "Hello, World!"
20 END`,
  },
  calculator: {
    name: "Simple Calculator",
    description: "A basic calculator that adds two numbers",
    code: `10 INPUT "Enter first number: ", A
20 INPUT "Enter second number: ", B
30 LET C = A + B
40 PRINT "The sum is: "; C
50 END`,
  },
  countdown: {
    name: "Countdown Timer",
    description: "Counts down from 10 to 1",
    code: `10 FOR I = 10 TO 1 STEP -1
20   PRINT I
30 NEXT I
40 PRINT "Blast off!"
50 END`,
  },
  fibonacci: {
    name: "Fibonacci Sequence",
    description: "Generates the first 10 Fibonacci numbers",
    code: `10 LET A = 0
20 LET B = 1
30 PRINT A
40 PRINT B
50 FOR I = 1 TO 8
60   LET C = A + B
70   PRINT C
80   LET A = B
90   LET B = C
100 NEXT I
110 END`,
  },
  guess_game: {
    name: "Number Guessing Game",
    description: "A simple number guessing game",
    code: `10 RANDOMIZE TIMER
20 LET SECRET = INT(RND * 100) + 1
30 PRINT "I'm thinking of a number between 1 and 100"
40 INPUT "Your guess: ", GUESS
50 IF GUESS = SECRET THEN GOTO 80
60 IF GUESS < SECRET THEN PRINT "Too low!"
70 IF GUESS > SECRET THEN PRINT "Too high!"
75 GOTO 40
80 PRINT "You got it!"
90 END`,
  },
};

export const basicCodeTool = tool({
  description:
    "Generate BASIC programming code for various program types and scenarios",
  inputSchema: z.object({
    programType: z
      .enum([
        "hello_world",
        "calculator",
        "countdown",
        "fibonacci",
        "guess_game",
        "custom",
      ])
      .describe("The type of BASIC program to generate"),
    customDescription: z
      .string()
      .optional()
      .describe(
        'Custom description for what the program should do (only used when programType is "custom")',
      ),
    includeComments: z
      .boolean()
      .default(true)
      .describe("Whether to include comments in the generated code"),
  }),
  execute: async ({ programType, customDescription, includeComments }) => {
    let code: string;
    let programName: string;
    let description: string;

    if (programType === "custom" && customDescription) {
      // Generate a simple custom program based on description
      programName = "Custom Program";
      description = customDescription;

      // Simple keyword-based code generation
      const lowerDesc = customDescription.toLowerCase();

      if (lowerDesc.includes("loop") || lowerDesc.includes("repeat")) {
        code = `10 FOR I = 1 TO 5
20   PRINT "Iteration: "; I
30 NEXT I
40 END`;
      } else if (lowerDesc.includes("input") || lowerDesc.includes("ask")) {
        code = `10 INPUT "Enter your name: ", NAME$
20 PRINT "Hello, "; NAME$; "!"
30 END`;
      } else if (
        lowerDesc.includes("math") ||
        lowerDesc.includes("calculate")
      ) {
        code = `10 INPUT "Enter a number: ", X
20 LET Y = X * 2
30 PRINT "Double of "; X; " is "; Y
40 END`;
      } else {
        // Default custom program
        code = `10 PRINT "Custom BASIC Program"
20 PRINT "Description: ${customDescription}"
30 END`;
      }
    } else {
      // Use predefined template
      const template = basicTemplates[programType];
      programName = template.name;
      description = template.description;
      code = template.code;
    }

    // Add comments if requested
    if (includeComments) {
      const commentedCode = code
        .split("\n")
        .map((line, index) => {
          if (
            line.trim() &&
            !line.includes("PRINT") &&
            !line.includes("INPUT") &&
            !line.includes("END")
          ) {
            return `${line}  ' ${getLineComment(line)}`;
          }
          return line;
        })
        .join("\n");
      code = commentedCode;
    }

    return {
      programName,
      description,
      code,
      programType,
      lineCount: code.split("\n").length,
      language: "BASIC",
    };
  },
});

// Helper function to generate line comments
function getLineComment(line: string): string {
  const trimmed = line.trim();

  if (trimmed.includes("LET")) {
    return "Variable assignment";
  } else if (trimmed.includes("FOR")) {
    return "Start of loop";
  } else if (trimmed.includes("NEXT")) {
    return "End of loop";
  } else if (trimmed.includes("IF")) {
    return "Conditional statement";
  } else if (trimmed.includes("GOTO")) {
    return "Jump to line";
  } else if (trimmed.includes("RANDOMIZE")) {
    return "Initialize random number generator";
  } else if (trimmed.includes("RND")) {
    return "Generate random number";
  } else if (trimmed.includes("INT")) {
    return "Convert to integer";
  } else {
    return "Program logic";
  }
}
