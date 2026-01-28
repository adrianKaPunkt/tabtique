import { getTreatmentRequests } from '@/lib/server/getTreatmentRequests';

const TreatmentRequestsPage = async () => {
  const treatmentRequests = await getTreatmentRequests();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Behandlungsanfragen</h1>
      <ul>
        {treatmentRequests.map((request) => (
          <li key={request.id} className="mb-2 p-4 border rounded">
            <p>
              <strong>Datum:</strong>{' '}
              {new Date(request.requestedAt).toLocaleString()}
            </p>
            <p>
              <strong>Name:</strong> {request.name}
            </p>
            <p>
              <strong>Email:</strong> {request.email}
            </p>
            <p>
              <strong>Telefon:</strong> {request.phone}
            </p>
            <p>
              <strong>Behandlung:</strong> {request.treatmentType} -{' '}
              {request.variant}
            </p>
            <p>
              <strong>Preis</strong> {request.priceSnapshotCents / 100} €
            </p>
            <p>
              <strong>Dauer:</strong> {request.durationSnapshotMin} Minuten
            </p>
            <p>
              <strong>Nachricht:</strong> {request.message}
            </p>
            <p>
              <strong>Erstellt am:</strong>{' '}
              {new Date(request.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default TreatmentRequestsPage;
