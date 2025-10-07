import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import { Provider } from "@/provider";

export const Route = createRootRoute({
  component: () => (
    <Provider>
      <Outlet />
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </Provider>
  ),
});
