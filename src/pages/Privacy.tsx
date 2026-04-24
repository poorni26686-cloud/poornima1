import StaticPage from "./StaticPage";

const Privacy = () => (
  <StaticPage title="Privacy Policy" subtitle="Last updated: 2026">
    <p>We collect only the information needed to provide our services: account details, booking data, and usage analytics.</p>
    <p>We never sell your personal data. Information is shared with guides only as required to fulfill bookings.</p>
    <p>You may request deletion of your account and data at any time by contacting <a className="text-primary underline" href="mailto:hello@wanderlust.com">hello@wanderlust.com</a>.</p>
  </StaticPage>
);

export default Privacy;
