import StaticPage from "./StaticPage";

const Cancellation = () => (
  <StaticPage title="Cancellation Options" subtitle="Flexible policies for peace of mind.">
    <ul className="list-disc pl-6 space-y-2">
      <li><strong>Free cancellation</strong> up to 7 days before the trip start date.</li>
      <li><strong>50% refund</strong> for cancellations 3–7 days prior.</li>
      <li><strong>No refund</strong> within 72 hours of trip start, except for emergencies.</li>
      <li>Weather-related cancellations are fully refundable or reschedulable.</li>
    </ul>
    <p>To cancel a booking, visit your bookings page or contact support.</p>
  </StaticPage>
);

export default Cancellation;
