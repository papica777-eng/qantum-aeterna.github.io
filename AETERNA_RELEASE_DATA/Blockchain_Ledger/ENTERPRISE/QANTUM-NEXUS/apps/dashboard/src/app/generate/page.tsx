import DashboardLayout from "@/components/layout/dashboard-layout";

export default function GeneratePage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col h-full space-y-4 p-4 lg:p-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">AI Asset Generator</h1>
          <p className="text-muted-foreground">
            Generate new Micro-SaaS logic nodes and autonomous agents.
          </p>
        </div>
        
        <div className="flex-1 border-2 border-dashed rounded-3xl bg-backgroundShadow/30 flex flex-col items-center justify-center p-12 text-center space-y-6">
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-purple-600 rounded-3xl rotate-12 flex items-center justify-center shadow-2xl shadow-primary/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v8"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m8 22 4-10 4 10"/><path d="M12 18H8"/><path d="M12 18h4"/></svg>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Generate Logic Nodes</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Inject new ontological intelligence into the Aeterna substrate to scale your MRR.
            </p>
          </div>
          <div className="flex gap-4">
            <input type="text" placeholder="Enter logic prompt..." className="w-80 h-14 px-6 rounded-2xl bg-background border outline-none focus:ring-2 focus:ring-primary/50" />
            <button className="h-14 px-8 bg-primary text-primary-foreground font-bold rounded-2xl hover:scale-105 transition-transform active:scale-95">
              Manifest
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
