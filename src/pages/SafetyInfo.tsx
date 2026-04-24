import StaticPage from "./StaticPage";

const SafetyInfo = () => (
  <StaticPage title="Safety Information" subtitle="Your safety is our top priority.">
    <p>All Wanderlust guides are background-checked, licensed, and trained in first aid. We follow local regulations in every region we operate.</p>
    <ul className="list-disc pl-6 space-y-2">
      <li>Verified guides with multi-year experience</li>
      <li>24/7 emergency contact during active tours</li>
      <li>Insurance recommendations for international travel</li>
      <li>Real-time location sharing during guided trips</li>
    </ul>
    <p>Always share your itinerary with a friend or family member, carry copies of important documents, and follow your guide's instructions.</p>
  </StaticPage>
);

export default SafetyInfo;
