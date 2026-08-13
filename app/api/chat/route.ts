import { NextResponse } from "next/server";

const AGENTROUTER_API_KEY = "sk-XLaOabU1V4FYpeI2nqwntq1hZKyS1zMWMNEVII3WcucUQUS7";
const AGENTROUTER_BASE_URL = "https://agentrouter.org/v1";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, model = "gpt-4o", stream = true, temperature = 0.7, top_p = 1, max_tokens, system_prompt } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid messages format. 'messages' array is required." },
        { status: 400 }
      );
    }

    // Prepend system message if present
    const formattedMessages = [...messages];
    if (system_prompt && system_prompt.trim().length > 0) {
      // Check if system prompt is already first message
      if (formattedMessages[0]?.role !== "system") {
        formattedMessages.unshift({
          role: "system",
          content: system_prompt.trim(),
        });
      }
    }

    const payload: Record<string, any> = {
      model,
      messages: formattedMessages,
      temperature,
      top_p,
      stream,
    };

    if (max_tokens) {
      payload.max_tokens = max_tokens;
    }

    const response = await fetch(`${AGENTROUTER_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AGENTROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `AgentRouter API Error (${response.status})`, details: errorText },
        { status: response.status }
      );
    }

    if (stream && response.body) {
      // Forward stream to client
      return new Response(response.body, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Chat completion error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
