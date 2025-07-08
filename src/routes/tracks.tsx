import { createFileRoute } from '@tanstack/react-router';
import TracksWidget from '../components/widgets/TracksWidget';
import { searchParamsSchema } from '@/interfaces/TracksFilterOptions';

export const Route = createFileRoute('/tracks')({
  validateSearch: searchParamsSchema,
  component: TracksRoute,
});

function TracksRoute() {
  return (
    <div className="tracks-page">
      <div className="tracks-container">
        <TracksWidget />
      </div>
    </div>
  );
}
