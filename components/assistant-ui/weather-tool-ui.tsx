import { makeAssistantToolUI } from "@assistant-ui/react";
import { CloudIcon, DropletsIcon, WindIcon, SunIcon, CloudRainIcon, CloudSnowIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type WeatherArgs = {
  location: string;
  unit: "celsius" | "fahrenheit";
};

type WeatherResult = {
  location: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  condition: string;
  unit: "celsius" | "fahrenheit";
};

const getWeatherIcon = (condition: string) => {
  switch (condition) {
    case "sunny":
    case "clear":
      return <SunIcon className="h-8 w-8 text-yellow-500" />;
    case "partly_cloudy":
      return <CloudIcon className="h-8 w-8 text-gray-500" />;
    case "rainy":
      return <CloudRainIcon className="h-8 w-8 text-blue-500" />;
    case "snowy":
      return <CloudSnowIcon className="h-8 w-8 text-blue-200" />;
    default:
      return <CloudIcon className="h-8 w-8 text-gray-400" />;
  }
};

const getTemperatureColor = (temperature: number, unit: string) => {
  const temp = unit === "fahrenheit" ? temperature : (temperature * 9/5) + 32;
  if (temp < 32) return "text-blue-600";
  if (temp < 50) return "text-blue-500";
  if (temp < 68) return "text-green-500";
  if (temp < 86) return "text-yellow-500";
  return "text-red-500";
};

export const WeatherToolUI = makeAssistantToolUI<WeatherArgs, WeatherResult>({
  toolName: "getWeather",
  render: ({ args, status, result }) => {
    if (status.type === "running") {
      return (
        <div className="flex items-center gap-3 rounded-lg border bg-blue-50 p-4">
          <div className="animate-spin">
            <CloudIcon className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <p className="font-medium text-blue-900">Checking weather...</p>
            <p className="text-sm text-blue-700">Getting current conditions for {args.location}</p>
          </div>
        </div>
      );
    }

    if (status.type === "incomplete" && status.reason === "error") {
      return (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-2">
            <CloudIcon className="h-5 w-5 text-red-500" />
            <p className="font-medium text-red-900">Weather Error</p>
          </div>
          <p className="text-sm text-red-700 mt-1">
            Failed to get weather data for {args.location}
          </p>
        </div>
      );
    }

    if (!result) return null;

    return (
      <div className="rounded-lg border bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {getWeatherIcon(result.condition)}
            <div>
              <h3 className="text-xl font-bold text-gray-900">{result.location}</h3>
              <p className="text-gray-600">{result.description}</p>
            </div>
          </div>
          <div className="text-right">
            <div className={cn(
              "text-4xl font-bold",
              getTemperatureColor(result.temperature, result.unit)
            )}>
              {result.temperature}°
            </div>
            <p className="text-sm text-gray-500 uppercase">
              {result.unit === "celsius" ? "C" : "F"}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 rounded-lg bg-white/60 p-3">
            <DropletsIcon className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Humidity</p>
              <p className="font-semibold text-gray-900">{result.humidity}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white/60 p-3">
            <WindIcon className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Wind Speed</p>
              <p className="font-semibold text-gray-900">{result.windSpeed} km/h</p>
            </div>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
    );
  },
});
