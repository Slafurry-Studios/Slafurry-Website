import { GameForm } from "@/components/admin/GameForm";

export default function NewGamePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <h1 className="font-heading text-3xl tracking-tight">New Game</h1>
      <GameForm />
    </div>
  );
}
