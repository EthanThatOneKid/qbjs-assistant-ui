import { makeAssistantToolUI } from "@assistant-ui/react";
import { CodeIcon, ExternalLinkIcon, CopyIcon, CheckIcon } from "lucide-react";
import { BasicCodeInput, BasicCodeResponse } from "../../tools/basic-code-tool";
import { useState } from "react";

// Separate component for the code preview with copy functionality
const CodePreview = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);

  return (
    <div className="relative mt-3 rounded-md bg-gray-900 p-4">
      <button
        onClick={() => {
          navigator.clipboard.writeText(code);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
        className="absolute top-2 right-2 rounded-md bg-gray-800 p-1.5 text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
        title="Copy code to clipboard"
      >
        {copied ? (
          <CheckIcon className="h-4 w-4" />
        ) : (
          <CopyIcon className="h-4 w-4" />
        )}
      </button>
      <pre className="overflow-x-auto pr-12 text-sm text-gray-100">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export const BasicCodeToolUI = makeAssistantToolUI<
  BasicCodeInput,
  BasicCodeResponse
>({
  toolName: "generateBasicCode",
  render: ({ status, result, args }) => {
    if (status.type === "running") {
      return (
        <div className="flex items-center gap-4 rounded-lg border bg-blue-50 p-6">
          <div className="animate-spin">
            <CodeIcon className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <p className="font-medium text-blue-900">
              Generating BASIC code...
            </p>
            <p className="mt-1 text-sm text-blue-700">
              {args?.title
                ? `Creating ${args.title}`
                : "Creating BASIC program"}
            </p>
          </div>
        </div>
      );
    }

    if (status.type === "incomplete") {
      let errorMessage = "Failed to generate BASIC code";
      let errorTitle = "Code Generation Error";

      switch (status.reason) {
        case "error":
          errorMessage = "An error occurred while generating the code";
          break;
        case "cancelled":
          errorMessage = "Code generation was cancelled";
          errorTitle = "Generation Cancelled";
          break;
        default:
          errorMessage = `Generation failed: ${status.reason}`;
      }

      return (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <div className="flex items-center gap-3">
            <CodeIcon className="h-5 w-5 text-red-500" />
            <p className="font-medium text-red-900">{errorTitle}</p>
          </div>
          <p className="mt-2 text-sm text-red-700">{errorMessage}</p>
        </div>
      );
    }

    if (status.type === "requires-action") {
      return (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6">
          <div className="flex items-center gap-3">
            <CodeIcon className="h-5 w-5 text-yellow-500" />
            <p className="font-medium text-yellow-900">Action Required</p>
          </div>
          <p className="mt-2 text-sm text-yellow-700">
            {status.reason ||
              "Additional action is required to complete code generation"}
          </p>
        </div>
      );
    }

    if (!result) return null;

    return (
      <div className="rounded-lg border bg-white shadow-sm">
        {/* Header */}
        <div className="border-b bg-gray-50 px-6 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                {result.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-600">
                {result.description}
              </p>
            </div>
            <div className="flex-shrink-0">
              <a
                href={result.qbjsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
              >
                <ExternalLinkIcon className="h-4 w-4" />
                Open in QBJS
              </a>
            </div>
          </div>
        </div>

        {/* Interactive QBJS iframe */}
        <div className="relative w-full">
          <div className="relative w-full" style={{ aspectRatio: "640/480" }}>
            <iframe
              src={result.qbjsIframeUrl}
              className="absolute inset-0 h-full w-full border-0"
              title={`${result.title} - QBJS Interactive Program`}
              allow="fullscreen"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
              loading="lazy"
            />
          </div>
        </div>

        {/* Code Preview */}
        <div className="border-t bg-gray-50 px-6 py-4">
          <details className="group">
            <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
              View Source Code
            </summary>
            <CodePreview code={result.code} />
          </details>
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 px-6 py-3">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-6">
              <span className="font-medium">
                {result.lineCount} lines of BASIC code
              </span>
              <span>
                Generated: {new Date(result.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {result.features && result.features.length > 0 ? (
                <div className="flex gap-1.5">
                  {result.features.slice(0, 3).map((feature, index) => (
                    <span
                      key={index}
                      className="rounded-md bg-gray-200 px-2.5 py-1 text-xs font-medium"
                    >
                      {feature}
                    </span>
                  ))}
                  {result.features.length > 3 && (
                    <span className="text-xs font-medium text-gray-400">
                      +{result.features.length - 3} more
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-xs font-medium text-gray-400">
                  Interactive BASIC Program
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  },
});
