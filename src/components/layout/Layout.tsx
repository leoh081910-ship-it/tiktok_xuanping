import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { DeepSeekAssistant } from "../ai/DeepSeekAssistant";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-muted/30">
          {children}
        </main>
      </div>
      {/* DeepSeek AI 助手 */}
      <DeepSeekAssistant />
    </div>
  );
}
