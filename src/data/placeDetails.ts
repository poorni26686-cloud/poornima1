/**
 * Enriched place data for all Indian states with descriptions, images, and ratings.
 * Each place has a unique, relevant image.
 */

export interface PlaceDetail {
  id: string;
  name: string;
  state: string;
  description: string;
  image: string;
  rating: number;
}

/** Place details keyed by state name */
const placeDetails: Record<string, PlaceDetail[]> = {
  "Chandigarh": [
    { id: "chd-1", name: "Rock Garden", state: "Chandigarh", description: "A unique sculpture garden built from industrial & home waste by Nek Chand.", image: "https://images.unsplash.com/photo-1623753018968-721e038ccd46?w=400&h=260&fit=crop", rating: 4.5 },
    { id: "chd-2", name: "Sukhna Lake", state: "Chandigarh", description: "A serene man-made reservoir at the foothills of the Shivalik range.", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=260&fit=crop", rating: 4.3 },
    { id: "chd-3", name: "Rose Garden", state: "Chandigarh", description: "Asia's largest rose garden with over 1,600 rose species.", image: "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=400&h=260&fit=crop", rating: 4.2 },
  ],
  "Delhi": [
    { id: "del-1", name: "Red Fort", state: "Delhi", description: "UNESCO World Heritage Site, the iconic Mughal-era red sandstone fort.", image: "https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?w=400&h=260&fit=crop", rating: 4.6 },
    { id: "del-2", name: "India Gate", state: "Delhi", description: "A war memorial and iconic landmark of India, illuminated beautifully at night.", image: "https://images.unsplash.com/photo-1597040663342-45b6af3d7489?w=400&h=260&fit=crop", rating: 4.7 },
    { id: "del-3", name: "Qutub Minar", state: "Delhi", description: "A 73-meter tall minaret, the tallest brick minaret in the world.", image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=260&fit=crop", rating: 4.5 },
  ],
  "Haryana": [
    { id: "har-1", name: "Kurukshetra", state: "Haryana", description: "The holy land of Mahabharata war with historical temples and museums.", image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=400&h=260&fit=crop", rating: 4.1 },
    { id: "har-2", name: "Sultanpur Bird Sanctuary", state: "Haryana", description: "A haven for birdwatchers with migratory birds from Siberia & Europe.", image: "https://images.unsplash.com/photo-1555629151-5882cf4f9c24?w=400&h=260&fit=crop", rating: 4.0 },
    { id: "har-3", name: "Pinjore Gardens", state: "Haryana", description: "Mughal-style terraced gardens with fountains and heritage architecture.", image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&h=260&fit=crop", rating: 4.2 },
  ],
  "Himachal Pradesh": [
    { id: "hp-1", name: "Shimla", state: "Himachal Pradesh", description: "The Queen of Hill Stations with colonial architecture and Mall Road.", image: "https://images.unsplash.com/photo-1597074866923-dc0589150458?w=400&h=260&fit=crop", rating: 4.6 },
    { id: "hp-2", name: "Manali", state: "Himachal Pradesh", description: "Adventure hub with snow-capped peaks, Solang Valley, and Rohtang Pass.", image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400&h=260&fit=crop", rating: 4.7 },
    { id: "hp-3", name: "Dharamshala", state: "Himachal Pradesh", description: "Home of the Dalai Lama, known for Buddhist monasteries and cricket stadium.", image: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=260&fit=crop", rating: 4.5 },
  ],
  "Jammu & Kashmir": [
    { id: "jk-1", name: "Dal Lake", state: "Jammu & Kashmir", description: "The jewel of Srinagar — iconic houseboats, shikaras, and floating markets.", image: "https://images.unsplash.com/photo-1597074866923-dc0589150458?w=400&h=260&fit=crop", rating: 4.8 },
    { id: "jk-2", name: "Gulmarg", state: "Jammu & Kashmir", description: "A meadow of flowers and Asia's highest cable car with world-class skiing.", image: "https://images.unsplash.com/photo-1545652985-5edd365b12eb?w=400&h=260&fit=crop", rating: 4.7 },
    { id: "jk-3", name: "Pahalgam", state: "Jammu & Kashmir", description: "Valley of Shepherds with stunning landscapes, ideal for trekking.", image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=400&h=260&fit=crop", rating: 4.6 },
  ],
  "Ladakh": [
    { id: "lad-1", name: "Pangong Lake", state: "Ladakh", description: "A mesmerizing high-altitude lake famous for its ever-changing blue hues.", image: "https://images.unsplash.com/photo-1626015365107-78a4e1db2e60?w=400&h=260&fit=crop", rating: 4.9 },
    { id: "lad-2", name: "Nubra Valley", state: "Ladakh", description: "A desert oasis with double-humped camels and Diskit Monastery.", image: "https://images.unsplash.com/photo-1602867741746-6df80f40b3f6?w=400&h=260&fit=crop", rating: 4.7 },
    { id: "lad-3", name: "Leh Palace", state: "Ladakh", description: "A 17th-century royal palace offering panoramic views of the Stok range.", image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400&h=260&fit=crop", rating: 4.5 },
  ],
  "Punjab": [
    { id: "pnj-1", name: "Golden Temple", state: "Punjab", description: "The holiest shrine in Sikhism, a stunning gold-plated spiritual sanctuary.", image: "https://images.unsplash.com/photo-1609947017136-9daf32a15c8d?w=400&h=260&fit=crop", rating: 4.9 },
    { id: "pnj-2", name: "Jallianwala Bagh", state: "Punjab", description: "Historic memorial garden commemorating the 1919 massacre.", image: "https://images.unsplash.com/photo-1614797787026-e3ff1231e3bc?w=400&h=260&fit=crop", rating: 4.4 },
    { id: "pnj-3", name: "Wagah Border", state: "Punjab", description: "Witness the dramatic flag-lowering ceremony at the India-Pakistan border.", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=260&fit=crop", rating: 4.6 },
  ],
  "Rajasthan": [
    { id: "raj-1", name: "Jaipur", state: "Rajasthan", description: "The Pink City — Hawa Mahal, Amber Fort, and vibrant bazaars.", image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400&h=260&fit=crop", rating: 4.7 },
    { id: "raj-2", name: "Udaipur", state: "Rajasthan", description: "City of Lakes with the romantic Lake Palace and City Palace.", image: "https://images.unsplash.com/photo-1602301167990-831c61652485?w=400&h=260&fit=crop", rating: 4.8 },
    { id: "raj-3", name: "Jaisalmer", state: "Rajasthan", description: "The Golden City with its stunning fort, sand dunes, and desert safaris.", image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&h=260&fit=crop", rating: 4.6 },
  ],
  "Uttar Pradesh": [
    { id: "up-1", name: "Taj Mahal", state: "Uttar Pradesh", description: "One of the Seven Wonders of the World — an eternal symbol of love.", image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=260&fit=crop", rating: 4.9 },
    { id: "up-2", name: "Varanasi Ghats", state: "Uttar Pradesh", description: "The spiritual capital of India with mesmerizing Ganga Aarti ceremonies.", image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=400&h=260&fit=crop", rating: 4.7 },
    { id: "up-3", name: "Lucknow", state: "Uttar Pradesh", description: "City of Nawabs, famous for Bara Imambara and legendary street food.", image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=400&h=260&fit=crop", rating: 4.4 },
  ],
  "Uttarakhand": [
    { id: "uk-1", name: "Rishikesh", state: "Uttarakhand", description: "Yoga capital of the world with thrilling river rafting on the Ganges.", image: "https://images.unsplash.com/photo-1588083949404-c4f1ed1323b3?w=400&h=260&fit=crop", rating: 4.6 },
    { id: "uk-2", name: "Nainital", state: "Uttarakhand", description: "A charming lake town surrounded by mountains, perfect for boating.", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=260&fit=crop", rating: 4.5 },
    { id: "uk-3", name: "Mussoorie", state: "Uttarakhand", description: "Queen of the Hills with scenic Kempty Falls and Gun Hill views.", image: "https://images.unsplash.com/photo-1455156218388-5e61b526818b?w=400&h=260&fit=crop", rating: 4.4 },
  ],
  "Andhra Pradesh": [
    { id: "ap-1", name: "Tirupati", state: "Andhra Pradesh", description: "Home to the richest temple in the world — Sri Venkateswara Temple.", image: "https://images.unsplash.com/photo-1621621695852-a0cf42e31a32?w=400&h=260&fit=crop", rating: 4.7 },
    { id: "ap-2", name: "Visakhapatnam", state: "Andhra Pradesh", description: "A coastal gem with beautiful beaches, submarine museum, and Araku coffee.", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=260&fit=crop", rating: 4.5 },
    { id: "ap-3", name: "Araku Valley", state: "Andhra Pradesh", description: "A scenic hill station known for coffee plantations and tribal culture.", image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=260&fit=crop", rating: 4.4 },
  ],
  "Karnataka": [
    { id: "ka-1", name: "Mysore", state: "Karnataka", description: "City of Palaces with the magnificent Mysore Palace and Chamundi Hills.", image: "https://images.unsplash.com/photo-1600100397608-e4b1c5c35f2a?w=400&h=260&fit=crop", rating: 4.7 },
    { id: "ka-2", name: "Coorg", state: "Karnataka", description: "Scotland of India — lush coffee estates, waterfalls, and misty hills.", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=260&fit=crop", rating: 4.6 },
    { id: "ka-3", name: "Hampi", state: "Karnataka", description: "UNESCO World Heritage Site with ancient Vijayanagara Empire ruins.", image: "https://images.unsplash.com/photo-1590077428593-a55bb07c4665?w=400&h=260&fit=crop", rating: 4.8 },
  ],
  "Kerala": [
    { id: "ke-1", name: "Munnar", state: "Kerala", description: "Rolling tea plantations, misty mountains, and exotic wildlife.", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&h=260&fit=crop", rating: 4.7 },
    { id: "ke-2", name: "Alleppey", state: "Kerala", description: "Venice of the East — cruise on houseboats through serene backwaters.", image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=400&h=260&fit=crop", rating: 4.8 },
    { id: "ke-3", name: "Kochi", state: "Kerala", description: "Queen of the Arabian Sea with Chinese fishing nets and Fort Kochi.", image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=400&h=260&fit=crop", rating: 4.5 },
  ],
  "Puducherry": [
    { id: "py-1", name: "Promenade Beach", state: "Puducherry", description: "A scenic 1.2 km stretch along the Bay of Bengal with French architecture.", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=260&fit=crop", rating: 4.4 },
    { id: "py-2", name: "Auroville", state: "Puducherry", description: "An experimental township dedicated to human unity with the Matrimandir.", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=260&fit=crop", rating: 4.5 },
    { id: "py-3", name: "Paradise Beach", state: "Puducherry", description: "A secluded beach accessible by boat, perfect for relaxation.", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=260&fit=crop", rating: 4.3 },
  ],
  "Tamil Nadu": [
    { id: "tn-1", name: "Chennai", state: "Tamil Nadu", description: "Gateway to South India with Marina Beach and ancient Kapaleeshwarar Temple.", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&h=260&fit=crop", rating: 4.3 },
    { id: "tn-2", name: "Madurai", state: "Tamil Nadu", description: "Temple city with the awe-inspiring Meenakshi Amman Temple.", image: "https://images.unsplash.com/photo-1621621695852-a0cf42e31a32?w=400&h=260&fit=crop", rating: 4.6 },
    { id: "tn-3", name: "Ooty", state: "Tamil Nadu", description: "Queen of hill stations with botanical gardens and the Nilgiri toy train.", image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&h=260&fit=crop", rating: 4.5 },
  ],
  "Telangana": [
    { id: "ts-1", name: "Charminar", state: "Telangana", description: "Hyderabad's iconic 16th-century monument with bustling bazaars.", image: "https://images.unsplash.com/photo-1572704297498-45944ddd9a8c?w=400&h=260&fit=crop", rating: 4.5 },
    { id: "ts-2", name: "Golconda Fort", state: "Telangana", description: "A grand fort known for its acoustic architecture and diamond history.", image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=400&h=260&fit=crop", rating: 4.4 },
    { id: "ts-3", name: "Ramoji Film City", state: "Telangana", description: "World's largest film studio complex with entertainment and tours.", image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=260&fit=crop", rating: 4.3 },
  ],
  "Lakshadweep": [
    { id: "lk-1", name: "Agatti Island", state: "Lakshadweep", description: "A coral paradise with pristine lagoons and vibrant marine life.", image: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=400&h=260&fit=crop", rating: 4.7 },
    { id: "lk-2", name: "Bangaram Atoll", state: "Lakshadweep", description: "An uninhabited island perfect for scuba diving and snorkeling.", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=260&fit=crop", rating: 4.8 },
    { id: "lk-3", name: "Kavaratti", state: "Lakshadweep", description: "The capital island with beautiful mosques and a marine aquarium.", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=260&fit=crop", rating: 4.4 },
  ],
  "Arunachal Pradesh": [
    { id: "ar-1", name: "Tawang", state: "Arunachal Pradesh", description: "Home to India's largest Buddhist monastery at 10,000 feet.", image: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=260&fit=crop", rating: 4.7 },
    { id: "ar-2", name: "Ziro Valley", state: "Arunachal Pradesh", description: "UNESCO World Heritage tentative site with Apatani tribal culture.", image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=260&fit=crop", rating: 4.6 },
    { id: "ar-3", name: "Bomdila", state: "Arunachal Pradesh", description: "A scenic hill town with apple orchards and Buddhist monasteries.", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=260&fit=crop", rating: 4.3 },
  ],
  "Assam": [
    { id: "as-1", name: "Kaziranga", state: "Assam", description: "UNESCO World Heritage Site, home to the one-horned rhinoceros.", image: "https://images.unsplash.com/photo-1549366021-9f761d450615?w=400&h=260&fit=crop", rating: 4.8 },
    { id: "as-2", name: "Majuli Island", state: "Assam", description: "The world's largest river island with Vaishnavite monasteries.", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=260&fit=crop", rating: 4.5 },
    { id: "as-3", name: "Kamakhya Temple", state: "Assam", description: "One of the oldest Shakti Peethas, atop Nilachal Hill in Guwahati.", image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=400&h=260&fit=crop", rating: 4.4 },
  ],
  "Bihar": [
    { id: "br-1", name: "Bodh Gaya", state: "Bihar", description: "The place where Buddha attained enlightenment under the Bodhi Tree.", image: "https://images.unsplash.com/photo-1591018653367-4e4e0e1a8b5e?w=400&h=260&fit=crop", rating: 4.7 },
    { id: "br-2", name: "Nalanda", state: "Bihar", description: "Ruins of the ancient Nalanda University, a UNESCO World Heritage Site.", image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=400&h=260&fit=crop", rating: 4.5 },
    { id: "br-3", name: "Rajgir", state: "Bihar", description: "An ancient city with hot springs, Griddhakuta Hill, and Jain temples.", image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=260&fit=crop", rating: 4.3 },
  ],
  "Chhattisgarh": [
    { id: "cg-1", name: "Chitrakote Falls", state: "Chhattisgarh", description: "The Niagara of India — a stunning horseshoe-shaped waterfall.", image: "https://images.unsplash.com/photo-1432405972618-c6b0cfba8b9c?w=400&h=260&fit=crop", rating: 4.5 },
    { id: "cg-2", name: "Barnawapara", state: "Chhattisgarh", description: "A wildlife sanctuary with diverse flora, fauna, and tribal heritage.", image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=260&fit=crop", rating: 4.2 },
    { id: "cg-3", name: "Sirpur", state: "Chhattisgarh", description: "An archaeological treasure with ancient Buddhist and Hindu ruins.", image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=400&h=260&fit=crop", rating: 4.1 },
  ],
  "Jharkhand": [
    { id: "jh-1", name: "Ranchi Falls", state: "Jharkhand", description: "A beautiful cascade surrounded by lush greenery near the capital.", image: "https://images.unsplash.com/photo-1432405972618-c6b0cfba8b9c?w=400&h=260&fit=crop", rating: 4.1 },
    { id: "jh-2", name: "Betla National Park", state: "Jharkhand", description: "A tiger reserve with elephants, leopards, and ancient forts.", image: "https://images.unsplash.com/photo-1549366021-9f761d450615?w=400&h=260&fit=crop", rating: 4.3 },
    { id: "jh-3", name: "Deoghar", state: "Jharkhand", description: "One of 12 Jyotirlingas at Baidyanath Temple, a major pilgrimage site.", image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=400&h=260&fit=crop", rating: 4.4 },
  ],
  "Manipur": [
    { id: "mn-1", name: "Loktak Lake", state: "Manipur", description: "The only floating lake in the world with the unique phumdis.", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=260&fit=crop", rating: 4.6 },
    { id: "mn-2", name: "Kangla Fort", state: "Manipur", description: "Ancient seat of Manipuri kings with historical significance.", image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=400&h=260&fit=crop", rating: 4.2 },
    { id: "mn-3", name: "Imphal", state: "Manipur", description: "Capital city with Ima Keithel, the world's largest all-women market.", image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=260&fit=crop", rating: 4.1 },
  ],
  "Meghalaya": [
    { id: "ml-1", name: "Cherrapunji", state: "Meghalaya", description: "One of the wettest places on earth with stunning waterfalls.", image: "https://images.unsplash.com/photo-1432405972618-c6b0cfba8b9c?w=400&h=260&fit=crop", rating: 4.7 },
    { id: "ml-2", name: "Living Root Bridges", state: "Meghalaya", description: "Unique bio-engineering marvel — bridges grown from tree roots over centuries.", image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=260&fit=crop", rating: 4.8 },
    { id: "ml-3", name: "Shillong", state: "Meghalaya", description: "Scotland of the East with live music culture, lakes, and waterfalls.", image: "https://images.unsplash.com/photo-1455156218388-5e61b526818b?w=400&h=260&fit=crop", rating: 4.5 },
  ],
  "Mizoram": [
    { id: "mz-1", name: "Aizawl", state: "Mizoram", description: "A picturesque hillside capital with vibrant Mizo culture.", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=260&fit=crop", rating: 4.2 },
    { id: "mz-2", name: "Phawngpui Peak", state: "Mizoram", description: "The Blue Mountain — highest peak of Mizoram with orchid-rich forests.", image: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=400&h=260&fit=crop", rating: 4.4 },
    { id: "mz-3", name: "Tam Dil Lake", state: "Mizoram", description: "A serene natural lake perfect for boating amidst bamboo groves.", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=260&fit=crop", rating: 4.1 },
  ],
  "Nagaland": [
    { id: "nl-1", name: "Kohima", state: "Nagaland", description: "WWII memorial site and gateway to Naga tribal heritage.", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=260&fit=crop", rating: 4.3 },
    { id: "nl-2", name: "Dzukou Valley", state: "Nagaland", description: "A hidden valley of lilies and wildflowers between Nagaland and Manipur.", image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=260&fit=crop", rating: 4.7 },
    { id: "nl-3", name: "Hornbill Festival", state: "Nagaland", description: "Festival of festivals showcasing all 17 Naga tribes and their culture.", image: "https://images.unsplash.com/photo-1533669955142-6a73332af4db?w=400&h=260&fit=crop", rating: 4.6 },
  ],
  "Odisha": [
    { id: "od-1", name: "Konark Sun Temple", state: "Odisha", description: "A UNESCO masterpiece shaped like a giant chariot dedicated to Sun God.", image: "https://images.unsplash.com/photo-1621621695852-a0cf42e31a32?w=400&h=260&fit=crop", rating: 4.7 },
    { id: "od-2", name: "Puri Beach", state: "Odisha", description: "Famous for the Jagannath Temple and golden sand beach.", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=260&fit=crop", rating: 4.5 },
    { id: "od-3", name: "Chilika Lake", state: "Odisha", description: "Asia's largest brackish water lagoon, a paradise for birdwatchers.", image: "https://images.unsplash.com/photo-1555629151-5882cf4f9c24?w=400&h=260&fit=crop", rating: 4.4 },
  ],
  "Sikkim": [
    { id: "sk-1", name: "Gangtok", state: "Sikkim", description: "A clean hill town with monasteries, cable cars, and Kanchenjunga views.", image: "https://images.unsplash.com/photo-1626015365107-78a4e1db2e60?w=400&h=260&fit=crop", rating: 4.6 },
    { id: "sk-2", name: "Tsomgo Lake", state: "Sikkim", description: "A glacial lake at 12,310 feet, frozen in winter and vibrant in summer.", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=260&fit=crop", rating: 4.5 },
    { id: "sk-3", name: "Pelling", state: "Sikkim", description: "A tranquil town with stunning views of Kanchenjunga and monasteries.", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=260&fit=crop", rating: 4.4 },
  ],
  "Tripura": [
    { id: "tr-1", name: "Ujjayanta Palace", state: "Tripura", description: "A grand royal palace turned museum with Mughal-style gardens.", image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=400&h=260&fit=crop", rating: 4.3 },
    { id: "tr-2", name: "Neermahal", state: "Tripura", description: "India's largest lake palace, standing elegantly on Rudrasagar Lake.", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=260&fit=crop", rating: 4.4 },
    { id: "tr-3", name: "Unakoti", state: "Tripura", description: "Ancient rock carvings and sculptures dating back to 7th century.", image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=400&h=260&fit=crop", rating: 4.2 },
  ],
  "West Bengal": [
    { id: "wb-1", name: "Darjeeling", state: "West Bengal", description: "Tea capital with the Toy Train, Tiger Hill sunrise, and Kanchenjunga.", image: "https://images.unsplash.com/photo-1558431382-27e303142255?w=400&h=260&fit=crop", rating: 4.7 },
    { id: "wb-2", name: "Sundarbans", state: "West Bengal", description: "World's largest mangrove forest, home to the Royal Bengal Tiger.", image: "https://images.unsplash.com/photo-1549366021-9f761d450615?w=400&h=260&fit=crop", rating: 4.6 },
    { id: "wb-3", name: "Kolkata Victoria Memorial", state: "West Bengal", description: "A magnificent marble monument showcasing British-era grandeur.", image: "https://images.unsplash.com/photo-1558431382-27e303142255?w=400&h=260&fit=crop", rating: 4.5 },
  ],
  "Andaman and Nicobar Islands": [
    { id: "an-1", name: "Radhanagar Beach", state: "Andaman and Nicobar Islands", description: "Asia's best beach with crystal-clear turquoise waters.", image: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=400&h=260&fit=crop", rating: 4.9 },
    { id: "an-2", name: "Cellular Jail", state: "Andaman and Nicobar Islands", description: "National memorial of India's freedom struggle with light & sound show.", image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=400&h=260&fit=crop", rating: 4.6 },
    { id: "an-3", name: "Havelock Island", state: "Andaman and Nicobar Islands", description: "A tropical paradise for scuba diving and underwater coral exploration.", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=260&fit=crop", rating: 4.8 },
  ],
  "Dadra and Nagar Haveli and Daman and Diu": [
    { id: "dd-1", name: "Diu Fort", state: "Dadra and Nagar Haveli and Daman and Diu", description: "A 16th-century Portuguese fort overlooking the Arabian Sea.", image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=400&h=260&fit=crop", rating: 4.3 },
    { id: "dd-2", name: "Nagoa Beach", state: "Dadra and Nagar Haveli and Daman and Diu", description: "A horseshoe-shaped beach ideal for water sports and relaxation.", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=260&fit=crop", rating: 4.2 },
    { id: "dd-3", name: "Silvassa", state: "Dadra and Nagar Haveli and Daman and Diu", description: "A green getaway with tribal museums, gardens, and Vanganga Lake.", image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=260&fit=crop", rating: 4.0 },
  ],
  "Goa": [
    { id: "ga-1", name: "Baga Beach", state: "Goa", description: "A lively beach famous for nightlife, water sports, and shacks.", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&h=260&fit=crop", rating: 4.5 },
    { id: "ga-2", name: "Old Goa Churches", state: "Goa", description: "UNESCO World Heritage basilicas and cathedrals from Portuguese era.", image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=400&h=260&fit=crop", rating: 4.6 },
    { id: "ga-3", name: "Dudhsagar Falls", state: "Goa", description: "A four-tiered waterfall cascading 310 meters amidst lush greenery.", image: "https://images.unsplash.com/photo-1432405972618-c6b0cfba8b9c?w=400&h=260&fit=crop", rating: 4.7 },
  ],
  "Gujarat": [
    { id: "gj-1", name: "Rann of Kutch", state: "Gujarat", description: "A vast white salt desert that transforms during the Rann Utsav festival.", image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=260&fit=crop", rating: 4.7 },
    { id: "gj-2", name: "Gir Forest", state: "Gujarat", description: "The only home of the Asiatic lion with thrilling jungle safaris.", image: "https://images.unsplash.com/photo-1549366021-9f761d450615?w=400&h=260&fit=crop", rating: 4.6 },
    { id: "gj-3", name: "Dwarka", state: "Gujarat", description: "One of the four sacred Char Dham pilgrimage sites of Hinduism.", image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=400&h=260&fit=crop", rating: 4.5 },
  ],
  "Madhya Pradesh": [
    { id: "mp-1", name: "Khajuraho", state: "Madhya Pradesh", description: "UNESCO World Heritage temples with intricate erotic sculptures.", image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=400&h=260&fit=crop", rating: 4.7 },
    { id: "mp-2", name: "Sanchi Stupa", state: "Madhya Pradesh", description: "India's oldest stone structure, a UNESCO Buddhist monument.", image: "https://images.unsplash.com/photo-1591018653367-4e4e0e1a8b5e?w=400&h=260&fit=crop", rating: 4.5 },
    { id: "mp-3", name: "Bandhavgarh", state: "Madhya Pradesh", description: "Highest density of Royal Bengal Tigers in India.", image: "https://images.unsplash.com/photo-1549366021-9f761d450615?w=400&h=260&fit=crop", rating: 4.6 },
  ],
  "Maharashtra": [
    { id: "mh-1", name: "Gateway of India", state: "Maharashtra", description: "Mumbai's iconic arch monument overlooking the Arabian Sea.", image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&h=260&fit=crop", rating: 4.6 },
    { id: "mh-2", name: "Ajanta Caves", state: "Maharashtra", description: "UNESCO rock-cut Buddhist caves with 2000-year-old paintings.", image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=400&h=260&fit=crop", rating: 4.8 },
    { id: "mh-3", name: "Lonavala", state: "Maharashtra", description: "A popular hill station with waterfalls, caves, and chikki sweets.", image: "https://images.unsplash.com/photo-1455156218388-5e61b526818b?w=400&h=260&fit=crop", rating: 4.4 },
  ],
};

export default placeDetails;
