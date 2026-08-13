import { NextResponse } from "next/server";

export const runtime = "edge";

const AGENTROUTER_API_KEY = "sk-XLaOabU1V4FYpeI2nqwntq1hZKyS1zMWMNEVII3WcucUQUS7";
const AGENTROUTER_BASE_URL = "https://agentrouter.org/v1";

export async function GET() {
  try {
    const response = await fetch(`${AGENTROUTER_BASE_URL}/models`, {
      headers: {
        Authorization: `Bearer ${AGENTROUTER_API_KEY}`,
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: "Failed to fetch models from AgentRouter", details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
