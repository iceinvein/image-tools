import { HeroUIProvider } from "@heroui/system";
import { useNavigate } from "@tanstack/react-router";

export function Provider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <HeroUIProvider navigate={(to) => navigate({ to })} useHref={(to) => to}>
      {children}
    </HeroUIProvider>
  );
}
