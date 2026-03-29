/**
 * Complete structured data for all Indian States and Union Territories
 * organized region-wise with famous tourist places and image URLs.
 */

export interface StateInfo {
  name: string;
  places: string[];
  image: string;
}

export interface RegionData {
  region: string;
  emoji: string;
  states: StateInfo[];
}

const indianRegions: RegionData[] = [
  {
    region: "North India",
    emoji: "🏔️",
    states: [
      { name: "Chandigarh", places: ["Rock Garden", "Sukhna Lake", "Rose Garden"], image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=120&h=80&fit=crop" },
      { name: "Delhi", places: ["Red Fort", "India Gate", "Qutub Minar"], image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=120&h=80&fit=crop" },
      { name: "Haryana", places: ["Kurukshetra", "Sultanpur Bird Sanctuary", "Pinjore Gardens"], image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=120&h=80&fit=crop" },
      { name: "Himachal Pradesh", places: ["Shimla", "Manali", "Dharamshala"], image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=120&h=80&fit=crop" },
      { name: "Jammu & Kashmir", places: ["Dal Lake", "Gulmarg", "Pahalgam"], image: "https://images.unsplash.com/photo-1597074866923-dc0589150458?w=120&h=80&fit=crop" },
      { name: "Ladakh", places: ["Pangong Lake", "Nubra Valley", "Leh Palace"], image: "https://images.unsplash.com/photo-1626015365107-78a4e1db2e60?w=120&h=80&fit=crop" },
      { name: "Punjab", places: ["Golden Temple", "Jallianwala Bagh", "Wagah Border"], image: "https://images.unsplash.com/photo-1609947017136-9daf32a15c8d?w=120&h=80&fit=crop" },
      { name: "Rajasthan", places: ["Jaipur", "Udaipur", "Jaisalmer"], image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=120&h=80&fit=crop" },
      { name: "Uttar Pradesh", places: ["Taj Mahal", "Varanasi Ghats", "Lucknow"], image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=120&h=80&fit=crop" },
      { name: "Uttarakhand", places: ["Rishikesh", "Nainital", "Mussoorie"], image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=120&h=80&fit=crop" },
    ],
  },
  {
    region: "South India",
    emoji: "🌴",
    states: [
      { name: "Andhra Pradesh", places: ["Tirupati", "Visakhapatnam", "Araku Valley"], image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=120&h=80&fit=crop" },
      { name: "Karnataka", places: ["Mysore", "Coorg", "Hampi"], image: "https://images.unsplash.com/photo-1600100397608-e4b1c5c35f2a?w=120&h=80&fit=crop" },
      { name: "Kerala", places: ["Munnar", "Alleppey", "Kochi"], image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=120&h=80&fit=crop" },
      { name: "Puducherry", places: ["Promenade Beach", "Auroville", "Paradise Beach"], image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=120&h=80&fit=crop" },
      { name: "Tamil Nadu", places: ["Chennai", "Madurai", "Ooty"], image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=120&h=80&fit=crop" },
      { name: "Telangana", places: ["Charminar", "Golconda Fort", "Ramoji Film City"], image: "https://images.unsplash.com/photo-1600100397608-e4b1c5c35f2a?w=120&h=80&fit=crop" },
      { name: "Lakshadweep", places: ["Agatti Island", "Bangaram Atoll", "Kavaratti"], image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=120&h=80&fit=crop" },
    ],
  },
  {
    region: "East India",
    emoji: "🌿",
    states: [
      { name: "Arunachal Pradesh", places: ["Tawang", "Ziro Valley", "Bomdila"], image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=120&h=80&fit=crop" },
      { name: "Assam", places: ["Kaziranga", "Majuli Island", "Kamakhya Temple"], image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=120&h=80&fit=crop" },
      { name: "Bihar", places: ["Bodh Gaya", "Nalanda", "Rajgir"], image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=120&h=80&fit=crop" },
      { name: "Chhattisgarh", places: ["Chitrakote Falls", "Barnawapara", "Sirpur"], image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=120&h=80&fit=crop" },
      { name: "Jharkhand", places: ["Ranchi Falls", "Betla National Park", "Deoghar"], image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=120&h=80&fit=crop" },
      { name: "Manipur", places: ["Loktak Lake", "Kangla Fort", "Imphal"], image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=120&h=80&fit=crop" },
      { name: "Meghalaya", places: ["Cherrapunji", "Living Root Bridges", "Shillong"], image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=120&h=80&fit=crop" },
      { name: "Mizoram", places: ["Aizawl", "Phawngpui Peak", "Tam Dil Lake"], image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=120&h=80&fit=crop" },
      { name: "Nagaland", places: ["Kohima", "Dzukou Valley", "Hornbill Festival"], image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=120&h=80&fit=crop" },
      { name: "Odisha", places: ["Konark Sun Temple", "Puri Beach", "Chilika Lake"], image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=120&h=80&fit=crop" },
      { name: "Sikkim", places: ["Gangtok", "Tsomgo Lake", "Pelling"], image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=120&h=80&fit=crop" },
      { name: "Tripura", places: ["Ujjayanta Palace", "Neermahal", "Unakoti"], image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=120&h=80&fit=crop" },
      { name: "West Bengal", places: ["Darjeeling", "Sundarbans", "Kolkata Victoria Memorial"], image: "https://images.unsplash.com/photo-1558431382-27e303142255?w=120&h=80&fit=crop" },
      { name: "Andaman and Nicobar Islands", places: ["Radhanagar Beach", "Cellular Jail", "Havelock Island"], image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=120&h=80&fit=crop" },
    ],
  },
  {
    region: "West India",
    emoji: "🏖️",
    states: [
      { name: "Dadra and Nagar Haveli and Daman and Diu", places: ["Diu Fort", "Nagoa Beach", "Silvassa"], image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=120&h=80&fit=crop" },
      { name: "Goa", places: ["Baga Beach", "Old Goa Churches", "Dudhsagar Falls"], image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=120&h=80&fit=crop" },
      { name: "Gujarat", places: ["Rann of Kutch", "Gir Forest", "Dwarka"], image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=120&h=80&fit=crop" },
      { name: "Madhya Pradesh", places: ["Khajuraho", "Sanchi Stupa", "Bandhavgarh"], image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=120&h=80&fit=crop" },
      { name: "Maharashtra", places: ["Gateway of India", "Ajanta Caves", "Lonavala"], image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=120&h=80&fit=crop" },
    ],
  },
];

export default indianRegions;
