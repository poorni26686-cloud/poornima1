import StaticPage from "./StaticPage";

const TravelGuidelines = () => (
  <StaticPage title="Travel Guidelines" subtitle="Travel smart, travel responsibly.">
    <section>
      <h2 className="font-display text-2xl font-semibold text-foreground mb-3">Before You Go</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Check visa requirements and passport validity (6+ months).</li>
        <li>Get recommended vaccinations for the destination.</li>
        <li>Purchase travel insurance.</li>
      </ul>
    </section>
    <section>
      <h2 className="font-display text-2xl font-semibold text-foreground mb-3">Responsible Tourism</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Respect local customs, dress codes, and cultural sites.</li>
        <li>Minimize plastic use and carry waste back from natural sites.</li>
        <li>Support local businesses and artisans.</li>
      </ul>
    </section>
  </StaticPage>
);

export default TravelGuidelines;
