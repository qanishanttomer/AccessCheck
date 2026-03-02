import { urlSchema } from "@/schemas/url.schema";
import { NextRequest } from "next/server";
import { crawlAndAuditGenerator } from "@/lib/audit/crawlAndAudit";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsedBody = urlSchema.safeParse(body);

    if (!parsedBody.success) {
      return Response.json(
        { error: parsedBody.error.flatten() },
        { status: 400 }
      );
    }

    const { url } = parsedBody.data;

    // We use a ReadableStream for NDJSON streaming
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of crawlAndAuditGenerator(url)) {
            controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));
          }
          controller.enqueue(encoder.encode(JSON.stringify({ type: "done" }) + "\n"));
        } catch (err) {
          controller.enqueue(
            encoder.encode(JSON.stringify({ type: "error", error: String(err) }) + "\n")
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "application/x-ndjson",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return Response.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
