import { Outlet, useNavigate } from "react-router-dom";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { PUBLISHABLE_KEY } from "./main";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { dark } from "@clerk/themes";
import { ThemeProvider } from "./components/theme-provider";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

function App() {
  const navigate = useNavigate();

  return (
    <ClerkProvider
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/sign-in"
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      appearance={{
        // elements: {
        //   card: "bg-primary text-primary-content",
        //   headerSubtitle: "text-primary-content",
        //   dividerLine: "border border-black",
        //   dividerText: "text-primary-content",
        //   socialButtonsBlockButton: "bg-primary text-primary-content",
        //   formFieldInput: "bg-slate-400 text-white",
        //   footer: "bg-primary text-primary-content",
        // },
        baseTheme: dark,
      }}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <Outlet />
        </ThemeProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}

export default App;
