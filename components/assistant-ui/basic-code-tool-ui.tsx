import { makeAssistantToolUI } from "@assistant-ui/react";
import { CodeIcon, CopyIcon, FileTextIcon, PlayIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type BasicCodeArgs = {
  programData: string;
};

type BasicCodeResult = {
  title: string;
  description: string;
  code: string;
  features: string[];
  lineCount: number;
  language: string;
  timestamp: string;
  qbjsUrl: string;
};

const getIcon = (title: string) => {
  const lower = title.toLowerCase();
  if (lower.includes("game")) return "🎮";
  if (lower.includes("fractal")) return "🌀";
  if (lower.includes("graphics") || lower.includes("circle")) return "🎨";
  if (lower.includes("calculator") || lower.includes("math")) return "🧮";
  if (lower.includes("hello")) return "👋";
  return "💻";
};

const getColor = (title: string) => {
  const lower = title.toLowerCase();
  if (lower.includes("game"))
    return "from-purple-50 to-violet-50 border-purple-200";
  if (lower.includes("fractal"))
    return "from-indigo-50 to-blue-50 border-indigo-200";
  if (lower.includes("graphics") || lower.includes("circle"))
    return "from-pink-50 to-rose-50 border-pink-200";
  if (lower.includes("calculator") || lower.includes("math"))
    return "from-orange-50 to-amber-50 border-orange-200";
  if (lower.includes("hello"))
    return "from-green-50 to-emerald-50 border-green-200";
  return "from-blue-50 to-cyan-50 border-blue-200";
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
            <p className="text-sm text-blue-700">Creating BASIC program</p>
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
            Failed to generate BASIC code
          </p>
        </div>
      );
    }

    if (!result) return null;

    const colorClasses = getColor(result.title);

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
            <span className="text-2xl">{getIcon(result.title)}</span>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {result.title}
              </h3>
              <p className="text-gray-600">{result.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FileTextIcon className="h-4 w-4" />
            <span>{result.lineCount} lines</span>
          </div>
        </div>

        {/* Features */}
        {result.features && result.features.length > 0 && (
          <div className="mb-4">
            <p className="mb-2 text-sm font-medium text-gray-700">Features:</p>
            <div className="flex flex-wrap gap-2">
              {result.features.map((feature, index) => (
                <span
                  key={index}
                  className="rounded-full bg-white/60 px-3 py-1 text-xs font-medium text-gray-700"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}

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
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors hover:bg-gray-700"
              >
                <CopyIcon className="h-3 w-3" />
                Copy
              </button>
              <button
                className="flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors hover:bg-gray-700"
                title="Run in QBJS"
              >
                <PlayIcon className="h-3 w-3" />
                Run
              </button>
            </div>
          </div>

          <pre className="overflow-x-auto rounded-b-lg bg-gray-900 p-4 text-sm leading-relaxed text-gray-100">
            <code>{result.code}</code>
          </pre>
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span>
              Generated: {new Date(result.timestamp).toLocaleTimeString()}
            </span>
          </div>
          <a
            href={result.qbjsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
          >
            Try in QBJS →
          </a>
        </div>
      </div>
    );
  },
});
