"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button"; // Placeholder, assuming standard button
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function JobTrigger({ onTrigger }: { onTrigger: () => void }) {
  const [loading, setLoading] = useState(false);

  const runTest = async (type: "Playwright" | "Selenium" | "Cypress") => {
    setLoading(true);
    try {
      await fetch("http://localhost:8080/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          test_type: type,
          config_payload: `Run ${type} Suite #A1`,
        }),
      });
      onTrigger();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trigger Unified Test</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-4">
        <button
          onClick={() => runTest("Playwright")}
          disabled={loading}
          className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50"
        >
          Run Playwright
        </button>
        <button
          onClick={() => runTest("Selenium")}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          Run Selenium
        </button>
        <button
          onClick={() => runTest("Cypress")}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Run Cypress
        </button>
      </CardContent>
    </Card>
  );
}
