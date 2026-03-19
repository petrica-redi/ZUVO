import { LogoWordmark } from "./Logo";
import { LanguagePicker } from "./LanguagePicker";

/**
 * Fixed top header with glassmorphism backdrop — Apple-style.
 * Header is a Server Component; LanguagePicker is a Client Component.
 */
export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-40">
      {/* Glass strip */}
      <div className="border-b border-black/[0.06] bg-white/80 px-4 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between">
          <LogoWordmark iconSize={30} />
          <LanguagePicker />
        </div>
      </div>
    </header>
  );
}
