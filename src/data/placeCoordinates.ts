/**
 * Approximate coordinates for tourist places across India.
 * Used for map visualization in the trip planner.
 */

export interface PlaceCoord {
  lat: number;
  lng: number;
}

const placeCoordinates: Record<string, PlaceCoord> = {
  // Chandigarh
  "chd-1": { lat: 30.7525, lng: 76.8083 },
  "chd-2": { lat: 30.7421, lng: 76.8186 },
  "chd-3": { lat: 30.7485, lng: 76.7842 },
  // Delhi
  "del-1": { lat: 28.6562, lng: 77.241 },
  "del-2": { lat: 28.6129, lng: 77.2295 },
  "del-3": { lat: 28.5245, lng: 77.1855 },
  // Haryana
  "har-1": { lat: 29.9695, lng: 76.8783 },
  "har-2": { lat: 28.4689, lng: 76.8972 },
  "har-3": { lat: 30.7984, lng: 76.9185 },
  // Himachal Pradesh
  "hp-1": { lat: 31.1048, lng: 77.1734 },
  "hp-2": { lat: 32.2396, lng: 77.1887 },
  "hp-3": { lat: 32.219, lng: 76.3234 },
  // Jammu & Kashmir
  "jk-1": { lat: 34.084, lng: 74.797 },
  "jk-2": { lat: 34.0484, lng: 74.3805 },
  "jk-3": { lat: 34.0161, lng: 75.3145 },
  // Ladakh
  "lad-1": { lat: 33.759, lng: 78.6589 },
  "lad-2": { lat: 34.686, lng: 77.5719 },
  "lad-3": { lat: 34.1637, lng: 77.5854 },
  // Punjab
  "pnj-1": { lat: 31.62, lng: 74.8765 },
  "pnj-2": { lat: 31.6206, lng: 74.8799 },
  "pnj-3": { lat: 31.6047, lng: 74.5735 },
  // Rajasthan
  "raj-1": { lat: 26.9124, lng: 75.7873 },
  "raj-2": { lat: 24.5854, lng: 73.7125 },
  "raj-3": { lat: 26.9157, lng: 70.9083 },
  // Uttarakhand
  "uk-1": { lat: 30.4358, lng: 78.0322 },
  "uk-2": { lat: 30.3165, lng: 78.0322 },
  "uk-3": { lat: 29.9457, lng: 78.1642 },
  // Uttar Pradesh
  "up-1": { lat: 27.1751, lng: 78.0421 },
  "up-2": { lat: 25.3176, lng: 82.9739 },
  "up-3": { lat: 26.8467, lng: 80.9462 },
  // Andhra Pradesh
  "ap-1": { lat: 13.7236, lng: 79.3835 },
  "ap-2": { lat: 17.686, lng: 83.2185 },
  "ap-3": { lat: 14.6819, lng: 77.6006 },
  // Karnataka
  "ka-1": { lat: 12.3052, lng: 76.6552 },
  "ka-2": { lat: 12.4244, lng: 75.7382 },
  "ka-3": { lat: 15.335, lng: 76.462 },
  // Kerala
  "kl-1": { lat: 10.1772, lng: 76.5114 },
  "kl-2": { lat: 10.0889, lng: 77.0595 },
  "kl-3": { lat: 9.4981, lng: 76.3388 },
  // Tamil Nadu
  "tn-1": { lat: 13.0827, lng: 80.2707 },
  "tn-2": { lat: 10.785, lng: 79.1378 },
  "tn-3": { lat: 10.0261, lng: 77.4775 },
  // Telangana
  "ts-1": { lat: 17.3616, lng: 78.4747 },
  "ts-2": { lat: 17.3604, lng: 78.4736 },
  "ts-3": { lat: 18.1124, lng: 79.0193 },
  // Goa
  "ga-1": { lat: 15.5004, lng: 73.7621 },
  "ga-2": { lat: 15.4909, lng: 73.8278 },
  "ga-3": { lat: 15.401, lng: 73.878 },
  // Gujarat
  "gj-1": { lat: 23.0225, lng: 72.5714 },
  "gj-2": { lat: 21.8381, lng: 73.7191 },
  "gj-3": { lat: 23.8591, lng: 72.1371 },
  // Maharashtra
  "mh-1": { lat: 19.0176, lng: 72.8562 },
  "mh-2": { lat: 20.5519, lng: 75.703 },
  "mh-3": { lat: 18.9217, lng: 73.0833 },
  // Bihar
  "br-1": { lat: 24.6959, lng: 84.9914 },
  "br-2": { lat: 25.611, lng: 85.1376 },
  "br-3": { lat: 25.2425, lng: 86.9842 },
  // Jharkhand
  "jh-1": { lat: 23.6693, lng: 86.1511 },
  "jh-2": { lat: 23.7957, lng: 86.4304 },
  "jh-3": { lat: 24.0961, lng: 84.0393 },
  // Odisha
  "od-1": { lat: 19.8135, lng: 85.8312 },
  "od-2": { lat: 19.8876, lng: 86.0945 },
  "od-3": { lat: 20.2961, lng: 85.8245 },
  // West Bengal
  "wb-1": { lat: 22.5726, lng: 88.3639 },
  "wb-2": { lat: 27.0369, lng: 88.2625 },
  "wb-3": { lat: 21.4272, lng: 87.0849 },
  // Assam
  "as-1": { lat: 26.7509, lng: 93.8714 },
  "as-2": { lat: 26.5775, lng: 93.1711 },
  "as-3": { lat: 26.1445, lng: 91.7362 },
  // Meghalaya
  "ml-1": { lat: 25.5788, lng: 91.8933 },
  "ml-2": { lat: 25.2723, lng: 91.7195 },
  "ml-3": { lat: 25.3049, lng: 91.5936 },
  // Arunachal Pradesh
  "ar-1": { lat: 27.5882, lng: 93.6103 },
  "ar-2": { lat: 27.1004, lng: 93.6162 },
  "ar-3": { lat: 28.6437, lng: 96.2013 },
  // Nagaland
  "nl-1": { lat: 25.6751, lng: 94.1086 },
  "nl-2": { lat: 25.6586, lng: 94.0959 },
  "nl-3": { lat: 26.161, lng: 94.5624 },
  // Manipur
  "mn-1": { lat: 24.8069, lng: 93.9439 },
  "mn-2": { lat: 24.5301, lng: 93.7751 },
  "mn-3": { lat: 25.1326, lng: 94.2006 },
  // Mizoram
  "mz-1": { lat: 23.7271, lng: 92.7176 },
  "mz-2": { lat: 23.3604, lng: 92.8379 },
  "mz-3": { lat: 23.0823, lng: 92.4719 },
  // Tripura
  "tr-1": { lat: 23.8315, lng: 91.2868 },
  "tr-2": { lat: 23.5204, lng: 91.3499 },
  "tr-3": { lat: 23.5133, lng: 91.2581 },
  // Sikkim
  "sk-1": { lat: 27.3389, lng: 88.6065 },
  "sk-2": { lat: 27.3848, lng: 88.6138 },
  "sk-3": { lat: 27.5948, lng: 88.6421 },
  // Madhya Pradesh
  "mp-1": { lat: 24.529, lng: 81.5678 },
  "mp-2": { lat: 22.7196, lng: 75.8577 },
  "mp-3": { lat: 23.479, lng: 77.7375 },
  // Chhattisgarh
  "cg-1": { lat: 21.2514, lng: 81.6296 },
  "cg-2": { lat: 18.8723, lng: 81.6943 },
  "cg-3": { lat: 22.0797, lng: 82.1409 },
  // Andaman
  "an-1": { lat: 11.6683, lng: 92.7378 },
  "an-2": { lat: 11.8237, lng: 92.7527 },
  "an-3": { lat: 11.9817, lng: 92.9618 },
  // Dadra
  "dd-1": { lat: 20.2669, lng: 73.0169 },
  "dd-2": { lat: 20.3974, lng: 72.8328 },
  "dd-3": { lat: 20.4118, lng: 72.8411 },
  // Lakshadweep
  "lk-1": { lat: 10.5669, lng: 72.6369 },
  "lk-2": { lat: 11.0011, lng: 72.1875 },
  "lk-3": { lat: 11.107, lng: 72.7329 },
  // Puducherry
  "py-1": { lat: 11.9416, lng: 79.8083 },
  "py-2": { lat: 11.934, lng: 79.8343 },
  "py-3": { lat: 11.9596, lng: 79.7877 },
};

export default placeCoordinates;
