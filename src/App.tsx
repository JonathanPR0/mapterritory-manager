import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Main from "./components/pages/Main";

const queryClient = new QueryClient();
export default function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Main />
      </QueryClientProvider>
    </>
  );
}
