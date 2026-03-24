import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function HeatmapMock() {
  // Visual placeholder for the "Stability Score" heatmap
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Portfolio Stability Heatmap (50k+ Tests)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-10 gap-1 h-32">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className={`rounded-sm ${
                Math.random() > 0.9
                  ? "bg-red-500 animate-pulse"
                  : Math.random() > 0.7
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
              title={`Suite ${i}: ${Math.random() > 0.9 ? 'Unstable' : 'Stable'}`}
            ></div>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted-foreground text-center">
          Real-time Risk Assessment of 50 Regions
        </p>
      </CardContent>
    </Card>
  );
}
