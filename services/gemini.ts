
export const getEPICInsights = async (context: string) => {
  try {
    const response = await fetch('/api/insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context }),
    });

    if (!response.ok) {
      throw new Error("Neural Link Failure");
    }

    const data = await response.json();
    return data.text || "SYSTEM STATUS: Null payload received.";
  } catch (error) {
    console.error("APEX_CORE_ERROR:", error);
    return "Neural link disrupted. Reconnecting via WCX CLOUD secondary gateway...";
  }
};
