
/**
 * EPIC Intelligence Service
 * Proxies requests to internal Next.js API for security and quota handling.
 */
export const getEPICInsights = async (context: string) => {
  try {
    const response = await fetch('/api/insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context }),
    });

    if (response.status === 429) {
      const data = await response.json();
      return data.text;
    }

    const data = await response.json();
    return data.text || "SYSTEM STATUS: Node returned empty payload.";
  } catch (error) {
    console.error("SECURE PROXY Error:", error);
    return "Neural link disrupted. Attempting reconnection via secure secondary gateway...";
  }
};
