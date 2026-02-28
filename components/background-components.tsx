import { cn } from "@/lib/utils";

export const Component = () => {
  return (
    <div className={cn("relative min-h-screen w-full overflow-hidden bg-emerald-50")}>
      {/* Green hero blur */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "radial-gradient(55% 55% at 50% 40%, rgba(34, 197, 94, 0.5) 0%, rgba(34, 197, 94, 0.18) 35%, transparent 75%)",
          filter: "blur(56px)",
        }}
      />

      {/* Your Content/Components */}
    </div>
  );
};
