import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Token Test",
  description: "Design token verification page for ABCo.",
};

export default function TokenTestPage() {
    return (
      <div className="min-h-screen bg-background p-8">
        <h1 className="font-display text-4xl uppercase">
          Great Community Deserves Great Beer
        </h1>
  
        <p className="mt-4 max-w-xl font-sans">
          If this background, text color, and fonts look right,
          your design tokens are wired correctly.
        </p>
  
        <button className="mt-6 rounded-md bg-brand px-6 py-3 font-ui">
          Shop Now →
        </button>
  
        <div className="mt-8 rounded-lg bg-surface p-6">
          <h2 className="font-heading text-2xl">Section Header</h2>
          <p className="mt-2 text-sm opacity-80">
            This card uses surface + spacing tokens.
          </p>
        </div>
      </div>
    );
  }
