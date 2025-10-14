import { makeAssistantToolUI } from "@assistant-ui/react";
import { CodeIcon, CopyIcon, FileTextIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type BasicCodeArgs = {
  programType:
    | "hello_world"
    | "calculator"
    | "countdown"
    | "fibonacci"
    | "guess_game"
    | "custom";
  customDescription?: string;
  includeComments: boolean;
};

type BasicCodeResult = {
  programName: string;
  description: string;
  code: string;
  programType: string;
  lineCount: number;
  language: string;
};

const getProgramIcon = (programType: string) => {
  switch (programType) {
    case "hello_world":
      return "👋";
    case "calculator":
      return "🧮";
    case "countdown":
      return "⏰";
    case "fibonacci":
      return "🔢";
    case "guess_game":
      return "🎯";
    case "custom":
      return "⚙️";
    default:
      return "💻";
  }
};

const getProgramColor = (programType: string) => {
  switch (programType) {
    case "hello_world":
      return "from-green-50 to-emerald-50 border-green-200";
    case "calculator":
      return "from-blue-50 to-cyan-50 border-blue-200";
    case "countdown":
      return "from-orange-50 to-amber-50 border-orange-200";
    case "fibonacci":
      return "from-purple-50 to-violet-50 border-purple-200";
    case "guess_game":
      return "from-pink-50 to-rose-50 border-pink-200";
    case "custom":
      return "from-gray-50 to-slate-50 border-gray-200";
    default:
      return "from-indigo-50 to-blue-50 border-indigo-200";
  }
};

export const BasicCodeToolUI = makeAssistantToolUI<
  BasicCodeArgs,
  BasicCodeResult
>({
  toolName: "generateBasicCode",
  render: ({ args, status, result }) => {
    const handleCopy = async () => {
      if (result?.code) {
        try {
          await navigator.clipboard.writeText(result.code);
        } catch (err) {
          console.error("Failed to copy code:", err);
        }
      }
    };

    if (status.type === "running") {
      return (
        <div className="flex items-center gap-3 rounded-lg border bg-blue-50 p-4">
          <div className="animate-spin">
            <CodeIcon className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <p className="font-medium text-blue-900">
              Generating BASIC code...
            </p>
            <p className="text-sm text-blue-700">
              Creating{" "}
              {args.programType === "custom" ? "custom" : args.programType}{" "}
              program
              {args.customDescription && `: ${args.customDescription}`}
            </p>
          </div>
        </div>
      );
    }

    if (status.type === "incomplete" && status.reason === "error") {
      return (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-2">
            <CodeIcon className="h-5 w-5 text-red-500" />
            <p className="font-medium text-red-900">Code Generation Error</p>
          </div>
          <p className="mt-1 text-sm text-red-700">
            Failed to generate BASIC code for {args.programType} program
          </p>
        </div>
      );
    }

    if (!result) return null;

    const colorClasses = getProgramColor(result.programType);

    return (
      <div
        className={cn(
          "rounded-lg border bg-gradient-to-br p-6 shadow-sm",
          colorClasses,
        )}
      >
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">
              {getProgramIcon(result.programType)}
            </span>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {result.programName}
              </h3>
              <p className="text-gray-600">{result.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FileTextIcon className="h-4 w-4" />
            <span>{result.lineCount} lines</span>
          </div>
        </div>

        {/* Code Block */}
        <div className="relative">
          <div className="flex items-center justify-between rounded-t-lg bg-gray-800 px-4 py-2 text-gray-300">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <span className="ml-2 text-sm font-medium">
                {result.language}
              </span>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors hover:bg-gray-700"
            >
              <CopyIcon className="h-3 w-3" />
              Copy
            </button>
          </div>

          <pre className="overflow-x-auto rounded-b-lg bg-gray-900 p-4 text-sm leading-relaxed text-gray-100">
            <code>{result.code}</code>
          </pre>
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span>Program Type: {result.programType}</span>
            {args.includeComments && <span>• Comments included</span>}
          </div>
          <span>Generated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    );
  },
});
