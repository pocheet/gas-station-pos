// src/App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PumpProvider } from './context/PumpContext';
import Layout from './components/Layout/Layout';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PumpProvider>
        <Layout />
      </PumpProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
