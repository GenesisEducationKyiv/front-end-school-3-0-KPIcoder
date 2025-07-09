import { createFileRoute, Navigate } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: IndexRouteComponent,
});

function IndexRouteComponent() {
  return <Navigate to="/tracks" replace={true} />;
}
