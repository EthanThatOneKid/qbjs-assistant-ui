import { AssistantCloud } from "@assistant-ui/react";
import { auth } from "@clerk/nextjs/server";

export async function POST() {
  const { userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const assistantCloud = new AssistantCloud({
    apiKey: process.env.ASSISTANT_API_KEY!,
    userId,
    workspaceId: userId, // Simple: user ID = workspace ID
  });

  const { token } = await assistantCloud.auth.tokens.create();
  return Response.json({ token });
}
