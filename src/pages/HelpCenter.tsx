import StaticPage from "./StaticPage";

const HelpCenter = () => (
  <StaticPage title="Help Center" subtitle="We're here to help you travel with confidence.">
    <section>
      <h2 className="font-display text-2xl font-semibold text-foreground mb-3">Getting Started</h2>
      <p>Browse destinations, save favorites, plan a trip with our AI planner, and book a verified guide — all in one place.</p>
    </section>
    <section>
      <h2 className="font-display text-2xl font-semibold text-foreground mb-3">Account & Bookings</h2>
      <p>Manage your account from your profile page. View your guide bookings under "My Bookings". For changes, contact our support team.</p>
    </section>
    <section>
      <h2 className="font-display text-2xl font-semibold text-foreground mb-3">Need more help?</h2>
      <p>Email us at <a className="text-primary underline" href="mailto:hello@wanderlust.com">hello@wanderlust.com</a> or call +1 (234) 567-890.</p>
    </section>
  </StaticPage>
);

export default HelpCenter;
