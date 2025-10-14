import { tool } from "ai";
import { z } from "zod";

// Mock weather data - in a real app, you'd call a weather API
const mockWeatherData = {
  "San Francisco": {
    temperature: 18,
    description: "Partly cloudy",
    humidity: 65,
    windSpeed: 12,
    condition: "partly_cloudy",
  },
  "New York": {
    temperature: 22,
    description: "Sunny",
    humidity: 45,
    windSpeed: 8,
    condition: "sunny",
  },
  London: {
    temperature: 15,
    description: "Light rain",
    humidity: 80,
    windSpeed: 15,
    condition: "rainy",
  },
  Tokyo: {
    temperature: 25,
    description: "Clear sky",
    humidity: 55,
    windSpeed: 6,
    condition: "clear",
  },
};

// The `tool` helper function ensures correct type inference:
export const weatherTool = tool({
  description: "Get current weather for a location",
  inputSchema: z.object({
    location: z
      .string()
      .describe("The city and country/state to get weather for"),
    unit: z
      .enum(["celsius", "fahrenheit"])
      .default("celsius")
      .describe("Temperature unit"),
  }),
  execute: async ({ location, unit }) => {
    // Find matching location (case-insensitive)
    const locationKey = Object.keys(mockWeatherData).find(
      (key) =>
        key.toLowerCase().includes(location.toLowerCase()) ||
        location.toLowerCase().includes(key.toLowerCase()),
    );

    const weather = locationKey
      ? mockWeatherData[locationKey as keyof typeof mockWeatherData]
      : {
          temperature: 20,
          description: "Unknown conditions",
          humidity: 50,
          windSpeed: 10,
          condition: "unknown",
        };

    // Convert temperature if needed
    let temperature = weather.temperature;
    if (unit === "fahrenheit") {
      temperature = Math.round((temperature * 9) / 5 + 32);
    }

    return {
      location: locationKey || location,
      temperature,
      description: weather.description,
      humidity: weather.humidity,
      windSpeed: weather.windSpeed,
      condition: weather.condition,
      unit,
    };
  },
});
