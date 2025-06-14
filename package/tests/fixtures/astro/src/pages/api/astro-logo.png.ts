export async function GET() {
  const response = await fetch(
    "https://docs.astro.build/assets/full-logo-light.png",
  );
  const buffer = Buffer.from(await response.arrayBuffer());

  return new Response(buffer, {
    headers: { "Content-Type": "image/png" },
  });
}
