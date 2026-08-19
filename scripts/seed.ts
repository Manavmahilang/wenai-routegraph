import neo4j from "neo4j-driver";
import "dotenv/config";

const uri = process.env.COGNODB_URI;
const username = process.env.COGNODB_USERNAME;
const password = process.env.COGNODB_PASSWORD;

if (!uri || !username || !password) {
  throw new Error(
    "Missing COGNODB_URI, COGNODB_USERNAME or COGNODB_PASSWORD"
  );
}

const driver = neo4j.driver(
  uri,
  neo4j.auth.basic(username, password)
);

/* =========================================================
   DESTINATION IMAGES (CITIES)
   ========================================================= */

export const destinationImages: Record<string, string> = {
  delhi:
    "https://images.unsplash.com/photo-1592639296346-560c37a0f711?auto=format&fit=crop&w=1600&q=85",
  agra:
    "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1600&q=85",
  jaipur:
    "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1600&q=85",
  jodhpur:
    "https://images.unsplash.com/photo-1562979314-bee7453e911c?auto=format&fit=crop&w=1600&q=85",
  udaipur:
    "https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1600&q=85",
  rishikesh:
    "https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=1600&q=85",
  mumbai:
    "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1600&q=85",
  pune:
    "https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?auto=format&fit=crop&w=1600&q=85",
  goa:
    "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1600&q=85",
  ahmedabad:
    "https://images.unsplash.com/photo-1687840430404-b82859282de4??auto=format&fit=crop&w=1600&q=85",
  bangalore:
    "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1600&q=85",
  hyderabad:
    "https://images.unsplash.com/photo-1730315661998-dadff57d7f8c?auto=format&fit=crop&w=1600&q=85",
  chennai:
    "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=85",
  kochi:
    "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1600&q=85",
  varanasi:
    "https://images.unsplash.com/photo-1561361058-c24cecae35ca?auto=format&fit=crop&w=1600&q=85",
  kolkata:
    "https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=1600&q=85",
  bhubaneswar:
    "https://images.unsplash.com/photo-1600100397608-f010f423b971?auto=format&fit=crop&w=1600&q=85",
  tokyo:
    "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1600&q=85",
  kyoto:
    "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=85",
  osaka:
    "https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&w=1600&q=85",
  nara:
    "https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=1600&q=85",
  hiroshima:
    "https://images.unsplash.com/photo-1578593050839-28efab21e431?auto=format&fit=crop&w=1600&q=85",
  paris:
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=85",
  rome:
    "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1600&q=85",
  florence:
    "https://images.unsplash.com/photo-1687817997684-c9335cce7c5c?auto=format&fit=crop&w=1600&q=85",
  venice:
    "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1600&q=85",
  barcelona:
    "https://images.unsplash.com/photo-1630219694734-fe47ab76b15e?auto=format&fit=crop&w=1600&q=85",
  amsterdam:
    "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=1600&q=85",
  dubai:
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=85",
  "abu-dhabi":
    "https://images.unsplash.com/photo-1734009775179-07f428483783?auto=format&fit=crop&w=1600&q=85",
  bangkok:
    "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1600&q=85",
  "chiang-mai":
    "https://images.unsplash.com/photo-1564945626082-fb0f7f689de6?auto=format&fit=crop&w=1600&q=85",
  phuket:
    "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=1600&q=85",
  singapore:
    "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1600&q=85",
  sydney:
    "https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?auto=format&fit=crop&w=1600&q=85",
  melbourne:
    "https://images.unsplash.com/photo-1545044846-351ba102b6d5?auto=format&fit=crop&w=1600&q=85",
};

/* =========================================================
   ATTRACTION-SPECIFIC IMAGES
   ========================================================= */

export const attractionImages: Record<string, string> = {
  // Delhi
  "red-fort":
    "https://images.unsplash.com/photo-1705861144413-f02e38354648?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cmVkJTIwZm9ydHxlbnwwfHwwfHx8MA%3D%3D",
  "india-gate":
    "https://images.unsplash.com/photo-1705927122615-02dcef3b1465?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW5kaWEtZ2F0ZXxlbnwwfHwwfHx8MA%3D%3D",
  "qutub-minar":
    "https://images.unsplash.com/photo-1663229203856-8a363f07d881?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cXV0dWItbWluYXJ8ZW58MHx8MHx8fDA%3D",
  "humayuns-tomb":
    "https://images.unsplash.com/photo-1620563202699-5661aefec7ea?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aHVtYXl1bnMtdG9tYnxlbnwwfHwwfHx8MA%3D%3D",
  "lotus-temple":
    "https://images.unsplash.com/photo-1688257609244-3f2a893f19d6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bG90dXMtdGVtcGxlfGVufDB8fDB8fHww",
  akshardham:
    "https://images.unsplash.com/photo-1616350958621-c294bfd5a44e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YWtzaGFyZGhhbXxlbnwwfHwwfHx8MA%3D%3D",
  "jama-masjid":
    "https://images.unsplash.com/photo-1637301625903-e25a30ba1bb5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8amFtYS1tYXNqaWR8ZW58MHx8MHx8fDA%3D",
  "chandni-chowk":
    "https://images.unsplash.com/photo-1624858020896-4a558c5d7042?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2hhbmRuaSUyMGNob3drfGVufDB8fDB8fHww",
  "lodhi-garden":
    "https://images.unsplash.com/photo-1715633743194-14db1edb294c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bG9kaGktZ2FyZGVufGVufDB8fDB8fHww",
  "connaught-place":
    "https://images.unsplash.com/photo-1670739797443-3036f0f748ef?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29ubmF1Z2h0LXBsYWNlJTVDfGVufDB8fDB8fHww",

  // Agra
  "taj-mahal":
    "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1600&q=85",
  "agra-fort":
    "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1600&q=85",
  "mehtab-bagh":
    "https://images.unsplash.com/photo-1585135497273-1a86b09fe707?auto=format&fit=crop&w=1600&q=85",
  "itmad-ud-daulah":
    "https://images.unsplash.com/photo-1600100397608-f010f423b971?auto=format&fit=crop&w=1600&q=85",
  "fatehpur-sikri":
    "https://images.unsplash.com/photo-1622313762347-3c09fe5f2719?auto=format&fit=crop&w=1600&q=85",

  // Jaipur
  "amber-fort":
    "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?auto=format&fit=crop&w=1600&q=85",
  "hawa-mahal":
    "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1600&q=85",
  "city-palace-jaipur":
    "https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=1600&q=85",
  "jantar-mantar-jaipur":
    "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1600&q=85",
  "jal-mahal":
    "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1600&q=85",
  "albert-hall-jaipur":
    "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1600&q=85",

  // Mumbai
  "gateway-india":
    "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1600&q=85",
  "marine-drive":
    "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1600&q=85",
  "elephanta-caves":
    "https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?auto=format&fit=crop&w=1600&q=85",
  csmt:
    "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=85",
  "colaba-causeway":
    "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1600&q=85",
  "sanjay-gandhi-national-park":
    "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1600&q=85",

  // Goa
  "baga-beach":
    "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1600&q=85",
  "palolem-beach":
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85",
  "fort-aguada":
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=85",
  "old-goa":
    "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=85",
  "dudhsagar-falls":
    "https://images.unsplash.com/photo-1546808762-fe36e4f3a763?auto=format&fit=crop&w=1600&q=85",

  // Varanasi
  "dashashwamedh-ghat":
    "https://images.unsplash.com/photo-1561361058-c24cecae35ca?auto=format&fit=crop&w=1600&q=85",
  "assi-ghat":
    "https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=1600&q=85",
  sarnath:
    "https://images.unsplash.com/photo-1600100397608-f010f423b971?auto=format&fit=crop&w=1600&q=85",
  "ganges-boat-ride":
    "https://images.unsplash.com/photo-1561361058-c24cecae35ca?auto=format&fit=crop&w=1600&q=85",

  // Hyderabad
  charminar:
    "https://images.unsplash.com/photo-1572449043414-7f7c3a4f3d8b?auto=format&fit=crop&w=1600&q=85",
  "golconda-fort":
    "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1600&q=85",
  "salar-jung-museum":
    "https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=1600&q=85",
  "hussain-sagar":
    "https://images.unsplash.com/photo-1572449043414-7f7c3a4f3d8b?auto=format&fit=crop&w=1600&q=85",

  // Bangalore
  lalbagh:
    "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1600&q=85",
  "cubbon-park":
    "https://images.unsplash.com/photo-1622313762347-3c09fe5f2719?auto=format&fit=crop&w=1600&q=85",
  "bangalore-palace":
    "https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=1600&q=85",
  "vidhana-soudha":
    "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1600&q=85",

  // Kolkata
  "victoria-memorial":
    "https://images.unsplash.com/photo-1600080077823-a44592513861?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmljdG9yaWEtbWVtb3JpYWx8ZW58MHx8MHx8fDA%3D",
  "howrah-bridge":
    "https://images.unsplash.com/photo-1742325646212-f917ba1feeaa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aG93cmFoLWJyaWRnZXxlbnwwfHwwfHx8MA%3D%3D",
  "indian-museum-kolkata":
    "https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=1600&q=85",
  "park-street":
    "https://images.unsplash.com/photo-1709435739782-5e1d7002b609?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBhcmstc3RyZWV0LWtvbGthdGF8ZW58MHx8MHx8fDA%3D",

  // Tokyo
  "shibuya-crossing":
    "https://images.unsplash.com/photo-1729707397413-d4b10d6a0376?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c2hpYnV5YS1jcm9zc2luZ3xlbnwwfHwwfHx8MA%3D%3D",
  sensoji:
    "https://images.unsplash.com/photo-1673330245973-6f267657731f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2Vuc29qaXxlbnwwfHwwfHx8MA%3D%3D",
  "tokyo-tower":
    "https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dG9reW8tdG93ZXJ8ZW58MHx8MHx8fDA%3D",
  "meiji-shrine":
    "https://images.unsplash.com/photo-1703443371292-0d9081cc4787?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWVpamktc2hyaW5lfGVufDB8fDB8fHww",
  shinjuku:
    "https://images.unsplash.com/photo-1578593050839-28efab21e431?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hpbmp1a3V8ZW58MHx8MHx8fDA%3D",

  // Kyoto
  "fushimi-inari":
    "https://images.unsplash.com/photo-1558862107-d49ef2a04d72?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZnVzaGltaS1pbmFyaXxlbnwwfHwwfHx8MA%3D%3D",
  kiyomizudera:
    "https://images.unsplash.com/photo-1637679105331-a0cea188b83e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8a2l5b21penVkZXJhfGVufDB8fDB8fHww",
  arashiyama:
    "https://images.unsplash.com/photo-1626690979895-f6c5c13cfb98?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGFyYXNoaXlhbWF8ZW58MHx8MHx8fDA%3D",
  kinkakuji:
    "https://images.unsplash.com/photo-1698137363944-d34de2b00bce?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8a2lua2FrdWppfGVufDB8fDB8fHww",

  // Osaka
  "osaka-castle":
    "https://images.unsplash.com/photo-1596240748549-6ec0f32d4c95?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8b3Nha2EtY2FzdGxlfGVufDB8fDB8fHww",
  dotonbori:
    "https://images.unsplash.com/photo-1584505489290-96eb4e406d08?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZG90b25ib3JpfGVufDB8fDB8fHww",
  "kuromon-market":
    "https://images.unsplash.com/photo-1608516494623-2df85572e673?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8a3Vyb21vbi1tYXJrZXR8ZW58MHx8MHx8fDA%3D",

  // Europe
  "eiffel-tower":
    "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=1600&q=85",
  louvre:
    "https://images.unsplash.com/photo-1565099824688-e93eb20fe622?auto=format&fit=crop&w=1600&q=85",
  montmartre:
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=85",
  "notre-dame":
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=85",
  colosseum:
    "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1600&q=85",
  "roman-forum":
    "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1600&q=85",
  "trevi-fountain":
    "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1600&q=85",
  pantheon:
    "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1600&q=85",
  "florence-duomo":
    "https://images.unsplash.com/photo-1687817997684-c9335cce7c5c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZmxvcmVuY2UtZHVvbW98ZW58MHx8MHx8fDA%3D",
  "uffizi-gallery":
    "https://images.unsplash.com/photo-1601130200455-cdd4befa65fc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dWZmaXppLWdhbGxlcnl8ZW58MHx8MHx8fDA%3D",
  "ponte-vecchio":
    "https://images.unsplash.com/photo-1579964571724-60ab8a4bb770?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cG9udGUtdmVjY2hpb3xlbnwwfHwwfHx8MA%3D%3D",
  "st-marks-square":
    "https://media.istockphoto.com/id/468048192/photo/venice.webp?a=1&b=1&s=612x612&w=0&k=20&c=wzaVRau5i3IvjiCqDkyn4P1j6--IBe1i5jEn7Z-gSkg=",
  "grand-canal":
    "https://images.unsplash.com/photo-1700126335966-c52858c476d7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z3JhbmQtY2FuYWx8ZW58MHx8MHx8fDA%3D",
  "rialto-bridge":
    "https://images.unsplash.com/photo-1562967967-edb2915098dc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmlhbHRvLWJyaWRnZXxlbnwwfHwwfHx8MA%3D%3D",
  "sagrada-familia":
    "https://images.unsplash.com/photo-1728249960363-13079cc2c6f6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2FncmFkYS1mYW1pbGlhfGVufDB8fDB8fHww",
  "park-guell":
    "https://images.unsplash.com/photo-1644144974835-61c2c13c79c5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cGFyayUyMGd1ZWxsfGVufDB8fDB8fHww",
  "gothic-quarter":
    "https://images.unsplash.com/photo-1663072259253-36f71c33dfed?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Z290aGljLXF1YXJ0ZXJ8ZW58MHx8MHx8fDA%3D",
  rijksmuseum:
    "https://images.unsplash.com/photo-1637578035851-c5b169722de1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmlqa3NtdXNldW18ZW58MHx8MHx8fDA%3D",
  "van-gogh-museum":
    "https://images.unsplash.com/photo-1589869571832-6db8facdad09?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dmFuLWdvZ2gtbXVzZXVtfGVufDB8fDB8fHww",
  jordaan:
    "https://images.unsplash.com/photo-1692702518020-dd541f706b2c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8am9yZGFhbnxlbnwwfHwwfHx8MA%3D%3D",

  // Middle East & APAC
  "burj-khalifa":
    "https://images.unsplash.com/photo-1698776025950-1355bec95ae6?auto=format&fit=crop&w=1600&q=85",
  "dubai-mall":
    "https://images.unsplash.com/photo-1697134674327-3f2261031064?auto=format&fit=crop&w=1600&q=85",
  "palm-jumeirah":
    "https://images.unsplash.com/photo-1682410601904-24ec1d9858e6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGFsbS1qdW1laXJhaHxlbnwwfHwwfHx8MA%3D%3D",
  "al-fahidi":
    "https://images.unsplash.com/photo-1722958099947-ef89266601e6?auto=format&fit=crop&w=1600&q=85",
  "sheikh-zayed-mosque":
    "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1600&q=85",
  "louvre-abu-dhabi":
    "https://images.unsplash.com/photo-1672324016837-4b803c38fc95?auto=format&fit=crop&w=1600&q=85",
  "qasr-al-watan":
    "https://images.unsplash.com/photo-1707060333824-b7902e6b2ac9?auto=format&fit=crop&w=1600&q=85",
  "grand-palace":
    "https://images.unsplash.com/photo-1759718016448-6a108f0070c9?auto=format&fit=crop&w=1600&q=85",
  "wat-arun":
    "https://images.unsplash.com/photo-1714672709462-de21a12a1339?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d2F0LWFydW58ZW58MHx8MHx8fDA%3D",
  "wat-pho":
    "https://images.unsplash.com/photo-1704391445538-cf5e763234be?auto=format&fit=crop&w=1600&q=85",
  "chatuchak-market":
    "https://images.unsplash.com/photo-1696437492959-b9a8c37df4ad?auto=format&fit=crop&w=1600&q=85",
  "doi-suthep":
    "https://images.unsplash.com/photo-1564945626082-fb0f7f689de6?auto=format&fit=crop&w=1600&q=85",
  "chiang-mai-old-city":
    "https://images.unsplash.com/photo-1770223024809-e93e7bbf179e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2hpYW5nLW1haS1vbGQtY2l0eXxlbnwwfHwwfHx8MA%3D%3D",
  "patong-beach":
    "https://images.unsplash.com/photo-1737515908817-2b7668aea1a1?auto=format&fit=crop&w=1600&q=85",
  "old-phuket-town":
    "https://images.unsplash.com/photo-1693629756857-9cb0a9bb66d2?auto=format&fit=crop&w=1600&q=85",
  "marina-bay-sands":
    "https://images.unsplash.com/photo-1599594026550-97d9565ceda3?auto=format&fit=crop&w=1600&q=85",
  "gardens-by-the-bay":
    "https://images.unsplash.com/photo-1508277119692-771239379ff9?auto=format&fit=crop&w=1600&q=85",
  sentosa:
    "https://images.unsplash.com/photo-1696582836075-9f66d4c31f7b?auto=format&fit=crop&w=1600&q=85",
  "chinatown-singapore":
    "https://images.unsplash.com/photo-1500956505867-124082952502?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y2hpbmF0b3duLXNpbmdhcG9yZXxlbnwwfHwwfHx8MA%3D%3D",
  "sydney-opera-house":
    "https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?auto=format&fit=crop&w=1600&q=85",
  "harbour-bridge":
    "https://images.unsplash.com/photo-1528072164453-f4e8ef0d475a?auto=format&fit=crop&w=1600&q=85",
  "bondi-beach":
    "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&w=1600&q=85",
  "the-rocks":
    "https://images.unsplash.com/photo-1524293581917-878a6d017c71?auto=format&fit=crop&w=1600&q=85",
  "federation-square":
    "https://images.unsplash.com/photo-1545044846-351ba102b6d5?auto=format&fit=crop&w=1600&q=85",
  "queen-victoria-market":
    "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=1600&q=85",
  "hosier-lane":
    "https://images.unsplash.com/photo-1718327143264-7906b9d934ac?auto=format&fit=crop&w=1600&q=85",
  "great-ocean-road":
    "https://images.unsplash.com/photo-1511233389693-4a066f739752?auto=format&fit=crop&w=1600&q=85",
};

export const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=85";

/* =========================================================
   ENTITIES
   ========================================================= */

export const countries = [
  { id: "india", name: "India", code: "IN" },
  { id: "japan", name: "Japan", code: "JP" },
  { id: "france", name: "France", code: "FR" },
  { id: "italy", name: "Italy", code: "IT" },
  { id: "spain", name: "Spain", code: "ES" },
  { id: "netherlands", name: "Netherlands", code: "NL" },
  { id: "uae", name: "United Arab Emirates", code: "AE" },
  { id: "thailand", name: "Thailand", code: "TH" },
  { id: "singapore", name: "Singapore", code: "SG" },
  { id: "australia", name: "Australia", code: "AU" },
];

export const regions = [
  // India
  { id: "north-india", name: "North India" },
  { id: "rajasthan", name: "Rajasthan" },
  { id: "west-india", name: "West India" },
  { id: "south-india", name: "South India" },
  { id: "east-india", name: "East India" },

  // Japan
  { id: "kanto", name: "Kanto" },
  { id: "kansai", name: "Kansai" },
  { id: "chugoku", name: "Chugoku" },

  // France
  { id: "ile-de-france", name: "Île-de-France" },

  // Italy
  { id: "lazio", name: "Lazio" },
  { id: "tuscany", name: "Tuscany" },
  { id: "veneto", name: "Veneto" },

  // Spain
  { id: "catalonia", name: "Catalonia" },

  // Netherlands
  { id: "north-holland", name: "North Holland" },

  // UAE
  { id: "dubai-region", name: "Dubai" },
  { id: "abu-dhabi-region", name: "Abu Dhabi" },

  // Thailand
  { id: "bangkok-region", name: "Bangkok Region" },
  { id: "northern-thailand", name: "Northern Thailand" },
  { id: "southern-thailand", name: "Southern Thailand" },

  // Singapore
  { id: "central-singapore", name: "Central Region" },

  // Australia
  { id: "new-south-wales", name: "New South Wales" },
  { id: "victoria", name: "Victoria" },
];

export const cities = [
  // INDIA
  {
    id: "delhi",
    name: "Delhi",
    countryId: "india",
    regionId: "north-india",
    latitude: 28.6139,
    longitude: 77.209,
    description:
      "India's historic capital, where Mughal monuments, colonial avenues, bustling bazaars and contemporary culture meet.",
    tags: ["history", "culture", "food", "architecture", "shopping"],
    highlights: ["Red Fort", "India Gate", "Qutub Minar", "Old Delhi", "Humayun's Tomb"],
  },
  {
    id: "agra",
    name: "Agra",
    countryId: "india",
    regionId: "north-india",
    latitude: 27.1767,
    longitude: 78.0081,
    description:
      "A historic Mughal city on the Yamuna River, home to the Taj Mahal and some of India's finest Mughal architecture.",
    tags: ["heritage", "architecture", "history", "photography"],
    highlights: ["Taj Mahal", "Agra Fort", "Mehtab Bagh", "Itmad-ud-Daulah"],
  },
  {
    id: "jaipur",
    name: "Jaipur",
    countryId: "india",
    regionId: "north-india",
    latitude: 26.9124,
    longitude: 75.7873,
    description:
      "The Pink City, known for Rajput palaces, hilltop forts, colorful bazaars and centuries of Rajasthani craftsmanship.",
    tags: ["heritage", "palaces", "shopping", "culture", "food"],
    highlights: ["Amber Fort", "Hawa Mahal", "City Palace", "Jantar Mantar", "Jal Mahal"],
  },
  {
    id: "jodhpur",
    name: "Jodhpur",
    countryId: "india",
    regionId: "rajasthan",
    latitude: 26.2389,
    longitude: 73.0243,
    description:
      "The Blue City of Rajasthan, dominated by the monumental Mehrangarh Fort and surrounded by desert landscapes.",
    tags: ["heritage", "forts", "desert", "photography"],
    highlights: ["Mehrangarh Fort", "Jaswant Thada", "Blue City", "Umaid Bhawan Palace"],
  },
  {
    id: "udaipur",
    name: "Udaipur",
    countryId: "india",
    regionId: "rajasthan",
    latitude: 24.5854,
    longitude: 73.7125,
    description:
      "The romantic City of Lakes, celebrated for palaces, lake views, old-world streets and Mewar heritage.",
    tags: ["lakes", "romance", "palaces", "heritage"],
    highlights: ["City Palace", "Lake Pichola", "Jag Mandir", "Sajjangarh"],
  },
  {
    id: "varanasi",
    name: "Varanasi",
    countryId: "india",
    regionId: "north-india",
    latitude: 25.3176,
    longitude: 82.9739,
    description:
      "One of the world's oldest continuously inhabited cities, centered around the sacred Ganges and its historic ghats.",
    tags: ["spiritual", "culture", "history", "food"],
    highlights: ["Dashashwamedh Ghat", "Ganga Aarti", "Assi Ghat", "Sarnath"],
  },
  {
    id: "rishikesh",
    name: "Rishikesh",
    countryId: "india",
    regionId: "north-india",
    latitude: 30.0869,
    longitude: 78.2676,
    description:
      "A Himalayan gateway known for yoga, spirituality, river landscapes, suspension bridges and adventure activities.",
    tags: ["adventure", "yoga", "nature", "spiritual"],
    highlights: ["Laxman Jhula", "Triveni Ghat", "River Rafting", "Beatles Ashram"],
  },
  {
    id: "mumbai",
    name: "Mumbai",
    countryId: "india",
    regionId: "west-india",
    latitude: 19.076,
    longitude: 72.8777,
    description:
      "India's energetic coastal metropolis, combining colonial architecture, Bollywood, street food and Arabian Sea views.",
    tags: ["city", "food", "architecture", "nightlife", "coast"],
    highlights: ["Gateway of India", "Marine Drive", "Colaba", "Elephanta Caves", "Bandra"],
  },
  {
    id: "pune",
    name: "Pune",
    countryId: "india",
    regionId: "west-india",
    latitude: 18.5204,
    longitude: 73.8567,
    description:
      "A lively university and technology city surrounded by historic Maratha sites and Western Ghats landscapes.",
    tags: ["culture", "history", "food", "weekend"],
    highlights: ["Shaniwar Wada", "Aga Khan Palace", "Sinhagad", "Pataleshwar Cave"],
  },
  {
    id: "goa",
    name: "Goa",
    countryId: "india",
    regionId: "west-india",
    latitude: 15.2993,
    longitude: 74.124,
    description:
      "A tropical coastal destination known for beaches, Portuguese heritage, seafood, nightlife and lush inland landscapes.",
    tags: ["beaches", "nightlife", "food", "heritage", "nature"],
    highlights: ["Baga Beach", "Palolem", "Fort Aguada", "Old Goa", "Dudhsagar Falls"],
  },
  {
    id: "ahmedabad",
    name: "Ahmedabad",
    countryId: "india",
    regionId: "west-india",
    latitude: 23.0225,
    longitude: 72.5714,
    description:
      "A major Gujarati cultural center combining historic pol houses, stepwells, textile traditions and modern architecture.",
    tags: ["heritage", "food", "architecture", "culture"],
    highlights: ["Sabarmati Ashram", "Adalaj Stepwell", "Old City", "Kankaria Lake"],
  },
  {
    id: "hyderabad",
    name: "Hyderabad",
    countryId: "india",
    regionId: "south-india",
    latitude: 17.385,
    longitude: 78.4867,
    description:
      "A historic Deccan city where Qutb Shahi architecture, biryani culture and a modern technology economy coexist.",
    tags: ["history", "food", "technology", "architecture"],
    highlights: ["Charminar", "Golconda Fort", "Hussain Sagar", "Salar Jung Museum"],
  },
  {
    id: "bangalore",
    name: "Bangalore",
    countryId: "india",
    regionId: "south-india",
    latitude: 12.9716,
    longitude: 77.5946,
    description:
      "India's technology capital, known for gardens, cafés, innovation, nightlife and a thriving contemporary culture.",
    tags: ["technology", "food", "nightlife", "parks"],
    highlights: ["Lalbagh", "Cubbon Park", "Bangalore Palace", "Vidhana Soudha"],
  },
  {
    id: "chennai",
    name: "Chennai",
    countryId: "india",
    regionId: "south-india",
    latitude: 13.0827,
    longitude: 80.2707,
    description:
      "A major South Indian coastal city known for Tamil culture, classical arts, temples and Marina Beach.",
    tags: ["culture", "beaches", "food", "temples"],
    highlights: ["Marina Beach", "Kapaleeshwarar Temple", "Fort St George", "San Thome Basilica"],
  },
  {
    id: "kochi",
    name: "Kochi",
    countryId: "india",
    regionId: "south-india",
    latitude: 9.9312,
    longitude: 76.2673,
    description:
      "A historic Kerala port city blending colonial trading history, Chinese fishing nets, backwaters and contemporary art.",
    tags: ["coast", "heritage", "food", "backwaters", "art"],
    highlights: ["Fort Kochi", "Chinese Fishing Nets", "Mattancherry Palace", "Jewish Quarter"],
  },
  {
    id: "kolkata",
    name: "Kolkata",
    countryId: "india",
    regionId: "east-india",
    latitude: 22.5726,
    longitude: 88.3639,
    description:
      "A cultural capital celebrated for literature, art, colonial architecture, theatre and Bengali cuisine.",
    tags: ["culture", "food", "literature", "architecture"],
    highlights: ["Victoria Memorial", "Howrah Bridge", "Indian Museum", "Park Street"],
  },
  {
    id: "bhubaneswar",
    name: "Bhubaneswar",
    countryId: "india",
    regionId: "east-india",
    latitude: 20.2961,
    longitude: 85.8245,
    description:
      "The Temple City of Odisha, surrounded by ancient Kalingan architecture and close to important coastal heritage sites.",
    tags: ["temples", "heritage", "culture"],
    highlights: ["Lingaraj Temple", "Udayagiri Caves", "Dhauli", "Mukteshwar Temple"],
  },

  // JAPAN
  {
    id: "tokyo",
    name: "Tokyo",
    countryId: "japan",
    regionId: "kanto",
    latitude: 35.6762,
    longitude: 139.6503,
    description:
      "Japan's dynamic capital where historic neighborhoods, temples, design districts and cutting-edge technology meet.",
    tags: ["technology", "food", "shopping", "culture", "nightlife"],
    highlights: ["Shibuya", "Senso-ji", "Tokyo Tower", "Meiji Shrine", "Shinjuku"],
  },
  {
    id: "kyoto",
    name: "Kyoto",
    countryId: "japan",
    regionId: "kansai",
    latitude: 35.0116,
    longitude: 135.7681,
    description:
      "Japan's former imperial capital, filled with temples, gardens, traditional neighborhoods and seasonal landscapes.",
    tags: ["temples", "culture", "gardens", "history"],
    highlights: ["Fushimi Inari", "Kiyomizu-dera", "Arashiyama", "Kinkaku-ji"],
  },
  {
    id: "osaka",
    name: "Osaka",
    countryId: "japan",
    regionId: "kansai",
    latitude: 34.6937,
    longitude: 135.5023,
    description:
      "A vibrant Kansai metropolis famous for street food, nightlife, shopping and Osaka Castle.",
    tags: ["food", "nightlife", "shopping", "culture"],
    highlights: ["Osaka Castle", "Dotonbori", "Umeda", "Kuromon Market"],
  },
  {
    id: "nara",
    name: "Nara",
    countryId: "japan",
    regionId: "kansai",
    latitude: 34.6851,
    longitude: 135.8048,
    description:
      "An ancient Japanese capital known for monumental temples, traditional gardens and its famous free-roaming deer.",
    tags: ["temples", "history", "nature", "culture"],
    highlights: ["Todai-ji", "Nara Park", "Kasuga Taisha", "Naramachi"],
  },
  {
    id: "hiroshima",
    name: "Hiroshima",
    countryId: "japan",
    regionId: "chugoku",
    latitude: 34.3853,
    longitude: 132.4553,
    description:
      "A historic city known for its Peace Memorial sites and access to the sacred island of Miyajima.",
    tags: ["history", "culture", "islands", "food"],
    highlights: ["Peace Memorial Park", "Atomic Bomb Dome", "Miyajima", "Itsukushima Shrine"],
  },

  // EUROPE
  {
    id: "paris",
    name: "Paris",
    countryId: "france",
    regionId: "ile-de-france",
    latitude: 48.8566,
    longitude: 2.3522,
    description:
      "France's iconic capital, celebrated for art, architecture, fashion, cafés and centuries of cultural history.",
    tags: ["art", "fashion", "food", "architecture", "romance"],
    highlights: ["Eiffel Tower", "Louvre", "Montmartre", "Seine", "Notre-Dame"],
  },
  {
    id: "rome",
    name: "Rome",
    countryId: "italy",
    regionId: "lazio",
    latitude: 41.9028,
    longitude: 12.4964,
    description:
      "Italy's historic capital layered with ancient ruins, Renaissance art, baroque architecture and vibrant neighborhoods.",
    tags: ["history", "food", "architecture", "art"],
    highlights: ["Colosseum", "Roman Forum", "Trevi Fountain", "Pantheon", "Vatican"],
  },
  {
    id: "florence",
    name: "Florence",
    countryId: "italy",
    regionId: "tuscany",
    latitude: 43.7696,
    longitude: 11.2558,
    description:
      "The Renaissance city of Florence, home to extraordinary art, architecture and Tuscan culinary traditions.",
    tags: ["art", "renaissance", "food", "architecture"],
    highlights: ["Duomo", "Uffizi Gallery", "Ponte Vecchio", "Palazzo Vecchio"],
  },
  {
    id: "venice",
    name: "Venice",
    countryId: "italy",
    regionId: "veneto",
    latitude: 45.4408,
    longitude: 12.3155,
    description:
      "A unique lagoon city of canals, historic palaces, piazzas and centuries of maritime culture.",
    tags: ["canals", "architecture", "romance", "art"],
    highlights: ["St Mark's Square", "Grand Canal", "Rialto Bridge", "Doge's Palace"],
  },
  {
    id: "barcelona",
    name: "Barcelona",
    countryId: "spain",
    regionId: "catalonia",
    latitude: 41.3874,
    longitude: 2.1686,
    description:
      "A Mediterranean city defined by Gaudí architecture, beaches, food markets and vibrant Catalan culture.",
    tags: ["architecture", "beaches", "food", "art"],
    highlights: ["Sagrada Familia", "Park Güell", "Gothic Quarter", "Casa Batlló"],
  },
  {
    id: "amsterdam",
    name: "Amsterdam",
    countryId: "netherlands",
    regionId: "north-holland",
    latitude: 52.3676,
    longitude: 4.9041,
    description:
      "A canal-lined European capital known for museums, cycling culture, historic houses and creative neighborhoods.",
    tags: ["canals", "museums", "cycling", "culture"],
    highlights: ["Rijksmuseum", "Van Gogh Museum", "Anne Frank House", "Jordaan"],
  },

  // MIDDLE EAST & APAC
  {
    id: "dubai",
    name: "Dubai",
    countryId: "uae",
    regionId: "dubai-region",
    latitude: 25.2048,
    longitude: 55.2708,
    description:
      "A modern Gulf metropolis known for dramatic architecture, luxury experiences, desert landscapes and global cuisine.",
    tags: ["luxury", "architecture", "shopping", "desert"],
    highlights: ["Burj Khalifa", "Dubai Mall", "Palm Jumeirah", "Dubai Marina", "Al Fahidi"],
  },
  {
    id: "abu-dhabi",
    name: "Abu Dhabi",
    countryId: "uae",
    regionId: "abu-dhabi-region",
    latitude: 24.4539,
    longitude: 54.3773,
    description:
      "The UAE capital, combining grand Islamic architecture, museums, waterfront promenades and desert landscapes.",
    tags: ["architecture", "culture", "luxury", "museums"],
    highlights: ["Sheikh Zayed Grand Mosque", "Louvre Abu Dhabi", "Qasr Al Watan", "Corniche"],
  },
  {
    id: "bangkok",
    name: "Bangkok",
    countryId: "thailand",
    regionId: "bangkok-region",
    latitude: 13.7563,
    longitude: 100.5018,
    description:
      "Thailand's energetic capital combining temples, street food, river life, shopping districts and modern city culture.",
    tags: ["food", "temples", "nightlife", "shopping"],
    highlights: ["Grand Palace", "Wat Arun", "Wat Pho", "Chatuchak Market"],
  },
  {
    id: "chiang-mai",
    name: "Chiang Mai",
    countryId: "thailand",
    regionId: "northern-thailand",
    latitude: 18.7883,
    longitude: 98.9853,
    description:
      "A northern Thai cultural center surrounded by mountains, temples, night markets and traditional communities.",
    tags: ["temples", "mountains", "food", "culture"],
    highlights: ["Doi Suthep", "Old City", "Night Bazaar", "Wat Chedi Luang"],
  },
  {
    id: "phuket",
    name: "Phuket",
    countryId: "thailand",
    regionId: "southern-thailand",
    latitude: 7.8804,
    longitude: 98.3923,
    description:
      "Thailand's famous island destination with beaches, viewpoints, old-town architecture and access to the Andaman Sea.",
    tags: ["beaches", "islands", "nightlife", "food"],
    highlights: ["Patong Beach", "Old Phuket Town", "Big Buddha", "Kata Beach"],
  },
  {
    id: "singapore",
    name: "Singapore",
    countryId: "singapore",
    regionId: "central-singapore",
    latitude: 1.3521,
    longitude: 103.8198,
    description:
      "A compact global city blending futuristic architecture, tropical gardens, multicultural neighborhoods and exceptional food.",
    tags: ["architecture", "food", "shopping", "gardens"],
    highlights: ["Marina Bay", "Gardens by the Bay", "Sentosa", "Chinatown", "Little India"],
  },
  {
    id: "sydney",
    name: "Sydney",
    countryId: "australia",
    regionId: "new-south-wales",
    latitude: -33.8688,
    longitude: 151.2093,
    description:
      "Australia's iconic harbor city with beaches, coastal walks, world-famous architecture and vibrant neighborhoods.",
    tags: ["beaches", "architecture", "coast", "food"],
    highlights: ["Sydney Opera House", "Harbour Bridge", "Bondi Beach", "The Rocks"],
  },
  {
    id: "melbourne",
    name: "Melbourne",
    countryId: "australia",
    regionId: "victoria",
    latitude: -37.8136,
    longitude: 144.9631,
    description:
      "A creative Australian city known for cafés, laneways, galleries, sport and diverse culinary culture.",
    tags: ["food", "art", "cafes", "culture"],
    highlights: ["Federation Square", "Great Ocean Road", "Queen Victoria Market", "Hosier Lane"],
  },
];

export const attractions = [
  // DELHI
  {
    id: "red-fort",
    name: "Red Fort",
    cityId: "delhi",
    type: "Historic Site",
    description:
      "A monumental Mughal-era fort complex in Old Delhi and one of the city's defining architectural landmarks.",
    rating: 4.7,
    durationMinutes: 150,
    bestTime: "Morning",
    tags: ["history", "architecture", "unesco"],
  },
  {
    id: "india-gate",
    name: "India Gate",
    cityId: "delhi",
    type: "Monument",
    description:
      "A monumental war memorial on the ceremonial axis of New Delhi and one of India's best-known urban landmarks.",
    rating: 4.6,
    durationMinutes: 60,
    bestTime: "Evening",
    tags: ["landmark", "photography", "history"],
  },
  {
    id: "qutub-minar",
    name: "Qutub Minar",
    cityId: "delhi",
    type: "Historic Site",
    description:
      "A towering medieval minaret surrounded by archaeological monuments in the Qutub complex.",
    rating: 4.7,
    durationMinutes: 120,
    bestTime: "Morning",
    tags: ["history", "architecture", "unesco"],
  },
  {
    id: "humayuns-tomb",
    name: "Humayun's Tomb",
    cityId: "delhi",
    type: "Tomb",
    description:
      "A grand Mughal garden tomb whose architectural language influenced later Mughal monuments.",
    rating: 4.7,
    durationMinutes: 120,
    bestTime: "Late Afternoon",
    tags: ["architecture", "history", "gardens"],
  },
  {
    id: "lotus-temple",
    name: "Lotus Temple",
    cityId: "delhi",
    type: "Temple",
    description:
      "A striking contemporary lotus-shaped house of worship surrounded by landscaped gardens.",
    rating: 4.5,
    durationMinutes: 75,
    bestTime: "Morning",
    tags: ["architecture", "spiritual", "photography"],
  },
  {
    id: "akshardham",
    name: "Swaminarayan Akshardham",
    cityId: "delhi",
    type: "Temple",
    description:
      "A large Hindu temple complex featuring detailed stone craftsmanship, gardens and cultural exhibitions.",
    rating: 4.7,
    durationMinutes: 180,
    bestTime: "Late Afternoon",
    tags: ["temple", "architecture", "culture"],
  },
  {
    id: "jama-masjid",
    name: "Jama Masjid",
    cityId: "delhi",
    type: "Religious Site",
    description:
      "A monumental 17th-century mosque overlooking the historic lanes of Old Delhi.",
    rating: 4.6,
    durationMinutes: 60,
    bestTime: "Morning",
    tags: ["history", "architecture", "old-delhi"],
  },
  {
    id: "chandni-chowk",
    name: "Chandni Chowk",
    cityId: "delhi",
    type: "Market",
    description:
      "One of Old Delhi's most vibrant historic commercial districts, known for food, textiles, spices and street life.",
    rating: 4.6,
    durationMinutes: 150,
    bestTime: "Morning",
    tags: ["food", "shopping", "culture", "street-life"],
  },
  {
    id: "lodhi-garden",
    name: "Lodhi Garden",
    cityId: "delhi",
    type: "Garden",
    description:
      "A peaceful landscaped park containing historic tombs and monuments from the Lodhi period.",
    rating: 4.5,
    durationMinutes: 90,
    bestTime: "Morning",
    tags: ["parks", "history", "walking"],
  },
  {
    id: "connaught-place",
    name: "Connaught Place",
    cityId: "delhi",
    type: "District",
    description:
      "A major commercial district of concentric colonial-era architecture, restaurants, cafés and shops.",
    rating: 4.4,
    durationMinutes: 120,
    bestTime: "Evening",
    tags: ["shopping", "food", "nightlife"],
  },

  // AGRA
  {
    id: "taj-mahal",
    name: "Taj Mahal",
    cityId: "agra",
    type: "Monument",
    description:
      "The iconic white-marble Mughal mausoleum on the Yamuna, renowned for its symmetry and monumental architecture.",
    rating: 4.9,
    durationMinutes: 180,
    bestTime: "Sunrise",
    tags: ["unesco", "architecture", "heritage", "photography"],
  },
  {
    id: "agra-fort",
    name: "Agra Fort",
    cityId: "agra",
    type: "Fort",
    description:
      "A vast red sandstone fort complex that served as a major Mughal imperial residence and military stronghold.",
    rating: 4.7,
    durationMinutes: 150,
    bestTime: "Morning",
    tags: ["history", "fort", "architecture"],
  },
  {
    id: "mehtab-bagh",
    name: "Mehtab Bagh",
    cityId: "agra",
    type: "Garden",
    description:
      "A riverside Mughal garden offering a celebrated view toward the Taj Mahal.",
    rating: 4.5,
    durationMinutes: 75,
    bestTime: "Sunset",
    tags: ["gardens", "photography", "taj-mahal"],
  },
  {
    id: "itmad-ud-daulah",
    name: "Itmad-ud-Daulah's Tomb",
    cityId: "agra",
    type: "Tomb",
    description:
      "An ornate marble Mughal tomb often described as an architectural precursor to the Taj Mahal.",
    rating: 4.5,
    durationMinutes: 75,
    bestTime: "Morning",
    tags: ["architecture", "history", "mughal"],
  },
  {
    id: "fatehpur-sikri",
    name: "Fatehpur Sikri",
    cityId: "agra",
    type: "Historic City",
    description:
      "A monumental abandoned Mughal-era city complex featuring palaces, courtyards and religious architecture.",
    rating: 4.7,
    durationMinutes: 180,
    bestTime: "Morning",
    tags: ["unesco", "history", "architecture"],
  },

  // JAIPUR
  {
    id: "amber-fort",
    name: "Amber Fort",
    cityId: "jaipur",
    type: "Fort",
    description:
      "A spectacular hilltop Rajput fort overlooking Maota Lake and known for its courtyards, gates and ornate interiors.",
    rating: 4.8,
    durationMinutes: 180,
    bestTime: "Morning",
    tags: ["fort", "heritage", "architecture"],
  },
  {
    id: "hawa-mahal",
    name: "Hawa Mahal",
    cityId: "jaipur",
    type: "Palace",
    description:
      "Jaipur's famous Palace of Winds, recognized by its intricate honeycomb facade and hundreds of small windows.",
    rating: 4.7,
    durationMinutes: 60,
    bestTime: "Morning",
    tags: ["architecture", "photography", "palace"],
  },
  {
    id: "city-palace-jaipur",
    name: "City Palace",
    cityId: "jaipur",
    type: "Palace",
    description:
      "A royal complex of courtyards, museums, gateways and palace buildings in the heart of Jaipur.",
    rating: 4.7,
    durationMinutes: 150,
    bestTime: "Morning",
    tags: ["palace", "history", "culture"],
  },
  {
    id: "jantar-mantar-jaipur",
    name: "Jantar Mantar",
    cityId: "jaipur",
    type: "Observatory",
    description:
      "A monumental collection of astronomical instruments built in the early 18th century.",
    rating: 4.6,
    durationMinutes: 75,
    bestTime: "Morning",
    tags: ["science", "history", "unesco"],
  },
  {
    id: "jal-mahal",
    name: "Jal Mahal",
    cityId: "jaipur",
    type: "Palace",
    description:
      "A picturesque palace rising from the waters of Man Sagar Lake.",
    rating: 4.5,
    durationMinutes: 45,
    bestTime: "Sunset",
    tags: ["palace", "photography", "lake"],
  },
  {
    id: "albert-hall-jaipur",
    name: "Albert Hall Museum",
    cityId: "jaipur",
    type: "Museum",
    description:
      "A grand Indo-Saracenic museum housing art, textiles, decorative objects and historical collections.",
    rating: 4.5,
    durationMinutes: 120,
    bestTime: "Afternoon",
    tags: ["museum", "art", "history"],
  },

  // MUMBAI
  {
    id: "gateway-india",
    name: "Gateway of India",
    cityId: "mumbai",
    type: "Landmark",
    description:
      "Mumbai's monumental waterfront arch overlooking the Arabian Sea and Colaba harbor.",
    rating: 4.7,
    durationMinutes: 75,
    bestTime: "Morning",
    tags: ["landmark", "architecture", "photography"],
  },
  {
    id: "marine-drive",
    name: "Marine Drive",
    cityId: "mumbai",
    type: "Waterfront",
    description:
      "Mumbai's iconic seafront promenade curving around Back Bay and famous for its evening skyline.",
    rating: 4.7,
    durationMinutes: 90,
    bestTime: "Sunset",
    tags: ["coast", "walking", "photography"],
  },
  {
    id: "elephanta-caves",
    name: "Elephanta Caves",
    cityId: "mumbai",
    type: "Historic Site",
    description:
      "A historic island cave complex featuring monumental rock-cut sculptures and temples.",
    rating: 4.6,
    durationMinutes: 240,
    bestTime: "Morning",
    tags: ["heritage", "caves", "island"],
  },
  {
    id: "csmt",
    name: "Chhatrapati Shivaji Maharaj Terminus",
    cityId: "mumbai",
    type: "Historic Building",
    description:
      "A spectacular Victorian Gothic railway terminus and one of Mumbai's most distinctive architectural landmarks.",
    rating: 4.7,
    durationMinutes: 60,
    bestTime: "Evening",
    tags: ["architecture", "unesco", "history"],
  },
  {
    id: "colaba-causeway",
    name: "Colaba Causeway",
    cityId: "mumbai",
    type: "Market",
    description:
      "A lively shopping and street-food district near the southern tip of Mumbai.",
    rating: 4.5,
    durationMinutes: 120,
    bestTime: "Evening",
    tags: ["shopping", "food", "street-life"],
  },
  {
    id: "sanjay-gandhi-national-park",
    name: "Sanjay Gandhi National Park",
    cityId: "mumbai",
    type: "National Park",
    description:
      "A large protected green area within metropolitan Mumbai containing forest landscapes and the Kanheri Caves.",
    rating: 4.5,
    durationMinutes: 240,
    bestTime: "Morning",
    tags: ["nature", "wildlife", "hiking"],
  },

  // GOA
  {
    id: "baga-beach",
    name: "Baga Beach",
    cityId: "goa",
    type: "Beach",
    description:
      "One of North Goa's best-known beaches, surrounded by restaurants, nightlife and water activities.",
    rating: 4.4,
    durationMinutes: 180,
    bestTime: "Sunset",
    tags: ["beach", "nightlife", "water"],
  },
  {
    id: "palolem-beach",
    name: "Palolem Beach",
    cityId: "goa",
    type: "Beach",
    description:
      "A scenic crescent-shaped South Goa beach known for its palms, calm waters and relaxed atmosphere.",
    rating: 4.7,
    durationMinutes: 180,
    bestTime: "Sunset",
    tags: ["beach", "nature", "relaxation"],
  },
  {
    id: "fort-aguada",
    name: "Fort Aguada",
    cityId: "goa",
    type: "Fort",
    description:
      "A historic Portuguese coastal fort overlooking the Arabian Sea.",
    rating: 4.5,
    durationMinutes: 90,
    bestTime: "Late Afternoon",
    tags: ["history", "fort", "coast"],
  },
  {
    id: "old-goa",
    name: "Old Goa",
    cityId: "goa",
    type: "Heritage District",
    description:
      "A historic district containing monumental Portuguese-era churches and religious architecture.",
    rating: 4.7,
    durationMinutes: 150,
    bestTime: "Morning",
    tags: ["heritage", "architecture", "unesco"],
  },
  {
    id: "dudhsagar-falls",
    name: "Dudhsagar Falls",
    cityId: "goa",
    type: "Waterfall",
    description:
      "A dramatic multi-tier waterfall surrounded by the forests of the Western Ghats.",
    rating: 4.6,
    durationMinutes: 360,
    bestTime: "Morning",
    tags: ["nature", "waterfall", "adventure"],
  },

  // VARANASI
  {
    id: "dashashwamedh-ghat",
    name: "Dashashwamedh Ghat",
    cityId: "varanasi",
    type: "Ghat",
    description:
      "One of Varanasi's most famous riverfront ghats and a focal point for the evening Ganga Aarti.",
    rating: 4.7,
    durationMinutes: 120,
    bestTime: "Evening",
    tags: ["spiritual", "ganges", "culture"],
  },
  {
    id: "assi-ghat",
    name: "Assi Ghat",
    cityId: "varanasi",
    type: "Ghat",
    description:
      "A lively southern Ganges ghat popular for sunrise, boat rides and cultural experiences.",
    rating: 4.6,
    durationMinutes: 120,
    bestTime: "Sunrise",
    tags: ["spiritual", "ganges", "sunrise"],
  },
  {
    id: "sarnath",
    name: "Sarnath",
    cityId: "varanasi",
    type: "Archaeological Site",
    description:
      "A major Buddhist pilgrimage site associated with the Buddha's first sermon.",
    rating: 4.7,
    durationMinutes: 180,
    bestTime: "Morning",
    tags: ["buddhism", "history", "archaeology"],
  },
  {
    id: "ganges-boat-ride",
    name: "Ganges Sunrise Boat Ride",
    cityId: "varanasi",
    type: "Experience",
    description:
      "A traditional river experience offering views of Varanasi's ghats from the Ganges.",
    rating: 4.8,
    durationMinutes: 90,
    bestTime: "Sunrise",
    tags: ["experience", "ganges", "photography"],
  },

  // HYDERABAD
  {
    id: "charminar",
    name: "Charminar",
    cityId: "hyderabad",
    type: "Monument",
    description:
      "Hyderabad's iconic four-minaret monument surrounded by historic markets and the old city.",
    rating: 4.6,
    durationMinutes: 90,
    bestTime: "Evening",
    tags: ["architecture", "history", "old-city"],
  },
  {
    id: "golconda-fort",
    name: "Golconda Fort",
    cityId: "hyderabad",
    type: "Fort",
    description:
      "A massive historic fortress complex associated with the Qutb Shahi dynasty.",
    rating: 4.7,
    durationMinutes: 180,
    bestTime: "Late Afternoon",
    tags: ["fort", "history", "architecture"],
  },
  {
    id: "salar-jung-museum",
    name: "Salar Jung Museum",
    cityId: "hyderabad",
    type: "Museum",
    description:
      "A major museum housing an extensive collection of art, decorative objects and historical artifacts.",
    rating: 4.4,
    durationMinutes: 150,
    bestTime: "Afternoon",
    tags: ["museum", "art", "history"],
  },
  {
    id: "hussain-sagar",
    name: "Hussain Sagar Lake",
    cityId: "hyderabad",
    type: "Lake",
    description:
      "A large historic lake separating Hyderabad and Secunderabad with a prominent Buddha statue.",
    rating: 4.4,
    durationMinutes: 90,
    bestTime: "Evening",
    tags: ["lake", "walking", "photography"],
  },

  // BANGALORE
  {
    id: "lalbagh",
    name: "Lalbagh Botanical Garden",
    cityId: "bangalore",
    type: "Garden",
    description:
      "A historic botanical garden featuring diverse plant collections, mature trees and the iconic glasshouse.",
    rating: 4.6,
    durationMinutes: 150,
    bestTime: "Morning",
    tags: ["garden", "nature", "walking"],
  },
  {
    id: "cubbon-park",
    name: "Cubbon Park",
    cityId: "bangalore",
    type: "Park",
    description:
      "A large green space in central Bangalore popular for walking, recreation and urban nature.",
    rating: 4.5,
    durationMinutes: 120,
    bestTime: "Morning",
    tags: ["parks", "nature", "walking"],
  },
  {
    id: "bangalore-palace",
    name: "Bangalore Palace",
    cityId: "bangalore",
    type: "Palace",
    description:
      "A Tudor-inspired royal residence with ornate interiors, grounds and historic collections.",
    rating: 4.4,
    durationMinutes: 120,
    bestTime: "Afternoon",
    tags: ["palace", "architecture", "history"],
  },
  {
    id: "vidhana-soudha",
    name: "Vidhana Soudha",
    cityId: "bangalore",
    type: "Government Building",
    description:
      "An imposing landmark of neo-Dravidian architecture and one of Bangalore's most recognizable buildings.",
    rating: 4.5,
    durationMinutes: 45,
    bestTime: "Evening",
    tags: ["architecture", "landmark", "photography"],
  },

  // KOLKATA
  {
    id: "victoria-memorial",
    name: "Victoria Memorial",
    cityId: "kolkata",
    type: "Museum",
    description:
      "A grand marble museum and memorial surrounded by landscaped gardens.",
    rating: 4.7,
    durationMinutes: 150,
    bestTime: "Morning",
    tags: ["museum", "architecture", "history"],
  },
  {
    id: "howrah-bridge",
    name: "Howrah Bridge",
    cityId: "kolkata",
    type: "Landmark",
    description:
      "An iconic cantilever bridge crossing the Hooghly River and connecting Kolkata with Howrah.",
    rating: 4.5,
    durationMinutes: 45,
    bestTime: "Evening",
    tags: ["architecture", "landmark", "river"],
  },
  {
    id: "indian-museum-kolkata",
    name: "Indian Museum",
    cityId: "kolkata",
    type: "Museum",
    description:
      "One of India's major museums with extensive archaeological, artistic and natural-history collections.",
    rating: 4.5,
    durationMinutes: 180,
    bestTime: "Afternoon",
    tags: ["museum", "history", "culture"],
  },
  {
    id: "park-street",
    name: "Park Street",
    cityId: "kolkata",
    type: "District",
    description:
      "A famous Kolkata dining and entertainment district known for restaurants, music and nightlife.",
    rating: 4.5,
    durationMinutes: 120,
    bestTime: "Evening",
    tags: ["food", "nightlife", "culture"],
  },

  // TOKYO
  {
    id: "shibuya-crossing",
    name: "Shibuya Crossing",
    cityId: "tokyo",
    type: "Landmark",
    description:
      "One of Tokyo's most recognizable urban intersections and a symbol of the city's energy.",
    rating: 4.7,
    durationMinutes: 60,
    bestTime: "Evening",
    tags: ["city", "photography", "shopping"],
  },
  {
    id: "sensoji",
    name: "Senso-ji",
    cityId: "tokyo",
    type: "Temple",
    description:
      "Tokyo's historic Buddhist temple complex centered around the famous Kaminarimon gate.",
    rating: 4.7,
    durationMinutes: 120,
    bestTime: "Morning",
    tags: ["temple", "history", "culture"],
  },
  {
    id: "tokyo-tower",
    name: "Tokyo Tower",
    cityId: "tokyo",
    type: "Landmark",
    description:
      "A famous communications and observation tower offering panoramic views over Tokyo.",
    rating: 4.6,
    durationMinutes: 120,
    bestTime: "Sunset",
    tags: ["landmark", "city-view", "photography"],
  },
  {
    id: "meiji-shrine",
    name: "Meiji Shrine",
    cityId: "tokyo",
    type: "Shrine",
    description:
      "A major Shinto shrine set within a large forested area near Harajuku.",
    rating: 4.7,
    durationMinutes: 120,
    bestTime: "Morning",
    tags: ["shrine", "nature", "culture"],
  },
  {
    id: "shinjuku",
    name: "Shinjuku",
    cityId: "tokyo",
    type: "District",
    description:
      "A major Tokyo district filled with skyscrapers, restaurants, entertainment and nightlife.",
    rating: 4.6,
    durationMinutes: 180,
    bestTime: "Evening",
    tags: ["nightlife", "food", "shopping"],
  },

  // KYOTO
  {
    id: "fushimi-inari",
    name: "Fushimi Inari Taisha",
    cityId: "kyoto",
    type: "Shrine",
    description:
      "A famous Shinto shrine known for its thousands of vermilion torii gates climbing Mount Inari.",
    rating: 4.8,
    durationMinutes: 180,
    bestTime: "Early Morning",
    tags: ["shrine", "hiking", "photography"],
  },
  {
    id: "kiyomizudera",
    name: "Kiyomizu-dera",
    cityId: "kyoto",
    type: "Temple",
    description:
      "A historic Buddhist temple with a celebrated wooden stage overlooking Kyoto's eastern hills.",
    rating: 4.8,
    durationMinutes: 150,
    bestTime: "Morning",
    tags: ["temple", "history", "architecture"],
  },
  {
    id: "arashiyama",
    name: "Arashiyama Bamboo Grove",
    cityId: "kyoto",
    type: "Nature",
    description:
      "A famous bamboo landscape and one of Kyoto's most recognizable natural attractions.",
    rating: 4.7,
    durationMinutes: 120,
    bestTime: "Early Morning",
    tags: ["nature", "photography", "walking"],
  },
  {
    id: "kinkakuji",
    name: "Kinkaku-ji",
    cityId: "kyoto",
    type: "Temple",
    description:
      "The Golden Pavilion, a Zen temple whose golden exterior is reflected in a surrounding pond.",
    rating: 4.7,
    durationMinutes: 90,
    bestTime: "Morning",
    tags: ["temple", "architecture", "photography"],
  },

  // OSAKA
  {
    id: "osaka-castle",
    name: "Osaka Castle",
    cityId: "osaka",
    type: "Castle",
    description:
      "A major Japanese castle complex surrounded by a large park and defensive moats.",
    rating: 4.6,
    durationMinutes: 150,
    bestTime: "Morning",
    tags: ["castle", "history", "architecture"],
  },
  {
    id: "dotonbori",
    name: "Dotonbori",
    cityId: "osaka",
    type: "District",
    description:
      "Osaka's neon-lit entertainment district famous for street food, restaurants and nightlife.",
    rating: 4.8,
    durationMinutes: 150,
    bestTime: "Evening",
    tags: ["food", "nightlife", "shopping"],
  },
  {
    id: "kuromon-market",
    name: "Kuromon Market",
    cityId: "osaka",
    type: "Market",
    description:
      "A lively food market offering seafood, produce, snacks and local specialties.",
    rating: 4.6,
    durationMinutes: 120,
    bestTime: "Morning",
    tags: ["food", "market", "culture"],
  },

  // PARIS
  {
    id: "eiffel-tower",
    name: "Eiffel Tower",
    cityId: "paris",
    type: "Landmark",
    description:
      "Paris's defining iron landmark and one of the world's most recognizable structures.",
    rating: 4.8,
    durationMinutes: 180,
    bestTime: "Sunset",
    tags: ["landmark", "architecture", "photography"],
  },
  {
    id: "louvre",
    name: "Louvre Museum",
    cityId: "paris",
    type: "Museum",
    description:
      "One of the world's largest museums, housing an extraordinary collection spanning ancient civilizations to European art.",
    rating: 4.8,
    durationMinutes: 300,
    bestTime: "Morning",
    tags: ["art", "museum", "history"],
  },
  {
    id: "montmartre",
    name: "Montmartre",
    cityId: "paris",
    type: "District",
    description:
      "A historic hilltop neighborhood associated with artists, cafés, winding streets and Sacré-Cœur.",
    rating: 4.7,
    durationMinutes: 180,
    bestTime: "Late Afternoon",
    tags: ["art", "culture", "walking"],
  },
  {
    id: "notre-dame",
    name: "Notre-Dame de Paris",
    cityId: "paris",
    type: "Cathedral",
    description:
      "A landmark Gothic cathedral on Île de la Cité and one of Paris's most important historic buildings.",
    rating: 4.8,
    durationMinutes: 90,
    bestTime: "Morning",
    tags: ["architecture", "history", "religion"],
  },

  // ROME
  {
    id: "colosseum",
    name: "Colosseum",
    cityId: "rome",
    type: "Historic Site",
    description:
      "The monumental ancient Roman amphitheater and one of the defining archaeological sites of Rome.",
    rating: 4.8,
    durationMinutes: 180,
    bestTime: "Morning",
    tags: ["ancient-rome", "history", "architecture"],
  },
  {
    id: "roman-forum",
    name: "Roman Forum",
    cityId: "rome",
    type: "Archaeological Site",
    description:
      "A vast archaeological area containing the remains of ancient Rome's political and civic center.",
    rating: 4.7,
    durationMinutes: 150,
    bestTime: "Morning",
    tags: ["history", "archaeology", "ancient-rome"],
  },
  {
    id: "trevi-fountain",
    name: "Trevi Fountain",
    cityId: "rome",
    type: "Landmark",
    description:
      "Rome's spectacular Baroque fountain and one of the city's most famous public spaces.",
    rating: 4.7,
    durationMinutes: 60,
    bestTime: "Evening",
    tags: ["architecture", "photography", "baroque"],
  },
  {
    id: "pantheon",
    name: "Pantheon",
    cityId: "rome",
    type: "Historic Building",
    description:
      "One of the best-preserved monumental structures of ancient Rome, famous for its extraordinary dome.",
    rating: 4.8,
    durationMinutes: 75,
    bestTime: "Morning",
    tags: ["ancient-rome", "architecture", "history"],
  },

  // FLORENCE
  {
    id: "florence-duomo",
    name: "Florence Cathedral",
    cityId: "florence",
    type: "Cathedral",
    description:
      "Florence's iconic cathedral complex dominated by Brunelleschi's monumental dome.",
    rating: 4.8,
    durationMinutes: 120,
    bestTime: "Morning",
    tags: ["renaissance", "architecture", "art"],
  },
  {
    id: "uffizi-gallery",
    name: "Uffizi Gallery",
    cityId: "florence",
    type: "Museum",
    description:
      "One of the world's most important collections of Renaissance art.",
    rating: 4.8,
    durationMinutes: 240,
    bestTime: "Morning",
    tags: ["art", "renaissance", "museum"],
  },
  {
    id: "ponte-vecchio",
    name: "Ponte Vecchio",
    cityId: "florence",
    type: "Bridge",
    description:
      "Florence's historic medieval bridge spanning the Arno River and lined with shops.",
    rating: 4.7,
    durationMinutes: 60,
    bestTime: "Sunset",
    tags: ["architecture", "river", "photography"],
  },

  // VENICE
  {
    id: "st-marks-square",
    name: "St Mark's Square",
    cityId: "venice",
    type: "Public Square",
    description:
      "Venice's grand central square surrounded by historic monuments and arcades.",
    rating: 4.7,
    durationMinutes: 90,
    bestTime: "Morning",
    tags: ["architecture", "history", "photography"],
  },
  {
    id: "grand-canal",
    name: "Grand Canal",
    cityId: "venice",
    type: "Waterway",
    description:
      "Venice's principal waterway winding through the historic city and lined with palaces.",
    rating: 4.8,
    durationMinutes: 90,
    bestTime: "Sunset",
    tags: ["canals", "architecture", "photography"],
  },
  {
    id: "rialto-bridge",
    name: "Rialto Bridge",
    cityId: "venice",
    type: "Bridge",
    description:
      "One of Venice's most famous bridges crossing the Grand Canal.",
    rating: 4.6,
    durationMinutes: 60,
    bestTime: "Morning",
    tags: ["architecture", "canals", "shopping"],
  },

  // BARCELONA
  {
    id: "sagrada-familia",
    name: "Sagrada Família",
    cityId: "barcelona",
    type: "Basilica",
    description:
      "Gaudí's extraordinary unfinished basilica and Barcelona's most recognizable architectural landmark.",
    rating: 4.8,
    durationMinutes: 150,
    bestTime: "Morning",
    tags: ["architecture", "gaudi", "art"],
  },
  {
    id: "park-guell",
    name: "Park Güell",
    cityId: "barcelona",
    type: "Park",
    description:
      "A colorful Gaudí-designed park combining gardens, architectural structures and panoramic views.",
    rating: 4.7,
    durationMinutes: 150,
    bestTime: "Morning",
    tags: ["gaudi", "architecture", "parks"],
  },
  {
    id: "gothic-quarter",
    name: "Gothic Quarter",
    cityId: "barcelona",
    type: "Historic District",
    description:
      "A maze of medieval streets, plazas, churches, shops and restaurants in the heart of Barcelona.",
    rating: 4.7,
    durationMinutes: 180,
    bestTime: "Evening",
    tags: ["history", "walking", "food"],
  },

  // AMSTERDAM
  {
    id: "rijksmuseum",
    name: "Rijksmuseum",
    cityId: "amsterdam",
    type: "Museum",
    description:
      "The Netherlands' major national museum, home to masterpieces of Dutch art and history.",
    rating: 4.8,
    durationMinutes: 240,
    bestTime: "Morning",
    tags: ["art", "museum", "history"],
  },
  {
    id: "van-gogh-museum",
    name: "Van Gogh Museum",
    cityId: "amsterdam",
    type: "Museum",
    description:
      "A museum dedicated to Vincent van Gogh containing the world's largest collection of his works.",
    rating: 4.8,
    durationMinutes: 150,
    bestTime: "Morning",
    tags: ["art", "museum", "van-gogh"],
  },
  {
    id: "jordaan",
    name: "Jordaan",
    cityId: "amsterdam",
    type: "District",
    description:
      "A picturesque Amsterdam neighborhood of canals, narrow streets, cafés, galleries and historic houses.",
    rating: 4.7,
    durationMinutes: 150,
    bestTime: "Afternoon",
    tags: ["canals", "walking", "food"],
  },

  // DUBAI
  {
    id: "burj-khalifa",
    name: "Burj Khalifa",
    cityId: "dubai",
    type: "Landmark",
    description:
      "The world's tallest building and the centerpiece of Downtown Dubai.",
    rating: 4.8,
    durationMinutes: 150,
    bestTime: "Sunset",
    tags: ["architecture", "city-view", "luxury"],
  },
  {
    id: "dubai-mall",
    name: "Dubai Mall",
    cityId: "dubai",
    type: "Shopping",
    description:
      "A vast entertainment and retail complex adjacent to Burj Khalifa.",
    rating: 4.6,
    durationMinutes: 240,
    bestTime: "Afternoon",
    tags: ["shopping", "food", "entertainment"],
  },
  {
    id: "palm-jumeirah",
    name: "Palm Jumeirah",
    cityId: "dubai",
    type: "Landmark",
    description:
      "An iconic artificial island shaped like a palm and lined with resorts, beaches and waterfront attractions.",
    rating: 4.6,
    durationMinutes: 180,
    bestTime: "Sunset",
    tags: ["beach", "architecture", "luxury"],
  },
  {
    id: "al-fahidi",
    name: "Al Fahidi Historical District",
    cityId: "dubai",
    type: "Historic District",
    description:
      "A preserved neighborhood offering a glimpse into Dubai's architectural and trading heritage.",
    rating: 4.5,
    durationMinutes: 120,
    bestTime: "Morning",
    tags: ["history", "culture", "architecture"],
  },

  // ABU DHABI
  {
    id: "sheikh-zayed-mosque",
    name: "Sheikh Zayed Grand Mosque",
    cityId: "abu-dhabi",
    type: "Mosque",
    description:
      "A monumental white-marble mosque celebrated for its domes, courtyards, columns and intricate decoration.",
    rating: 4.9,
    durationMinutes: 150,
    bestTime: "Sunset",
    tags: ["architecture", "culture", "photography"],
  },
  {
    id: "louvre-abu-dhabi",
    name: "Louvre Abu Dhabi",
    cityId: "abu-dhabi",
    type: "Museum",
    description:
      "A major art museum beneath Jean Nouvel's dramatic geometric dome on Saadiyat Island.",
    rating: 4.7,
    durationMinutes: 180,
    bestTime: "Afternoon",
    tags: ["art", "museum", "architecture"],
  },
  {
    id: "qasr-al-watan",
    name: "Qasr Al Watan",
    cityId: "abu-dhabi",
    type: "Palace",
    description:
      "A grand presidential palace complex showcasing Emirati architecture and cultural heritage.",
    rating: 4.7,
    durationMinutes: 150,
    bestTime: "Late Afternoon",
    tags: ["palace", "architecture", "culture"],
  },

  // BANGKOK
  {
    id: "grand-palace",
    name: "Grand Palace",
    cityId: "bangkok",
    type: "Palace",
    description:
      "Bangkok's monumental royal complex containing ornate buildings, courtyards and the Temple of the Emerald Buddha.",
    rating: 4.7,
    durationMinutes: 180,
    bestTime: "Morning",
    tags: ["palace", "temple", "history"],
  },
  {
    id: "wat-arun",
    name: "Wat Arun",
    cityId: "bangkok",
    type: "Temple",
    description:
      "A striking riverside temple famous for its tall decorated central prang.",
    rating: 4.7,
    durationMinutes: 90,
    bestTime: "Sunset",
    tags: ["temple", "architecture", "river"],
  },
  {
    id: "wat-pho",
    name: "Wat Pho",
    cityId: "bangkok",
    type: "Temple",
    description:
      "A historic temple complex famous for its monumental reclining Buddha and traditional massage school.",
    rating: 4.7,
    durationMinutes: 120,
    bestTime: "Morning",
    tags: ["temple", "culture", "history"],
  },
  {
    id: "chatuchak-market",
    name: "Chatuchak Weekend Market",
    cityId: "bangkok",
    type: "Market",
    description:
      "One of Bangkok's largest markets with thousands of stalls selling food, crafts, clothing and collectibles.",
    rating: 4.6,
    durationMinutes: 240,
    bestTime: "Morning",
    tags: ["shopping", "food", "market"],
  },

  // CHIANG MAI
  {
    id: "doi-suthep",
    name: "Wat Phra That Doi Suthep",
    cityId: "chiang-mai",
    type: "Temple",
    description:
      "A revered mountain temple overlooking Chiang Mai and one of northern Thailand's most important cultural landmarks.",
    rating: 4.8,
    durationMinutes: 150,
    bestTime: "Morning",
    tags: ["temple", "mountains", "culture"],
  },
  {
    id: "chiang-mai-old-city",
    name: "Chiang Mai Old City",
    cityId: "chiang-mai",
    type: "Historic District",
    description:
      "The walled historic center containing temples, markets, cafés and traditional northern Thai architecture.",
    rating: 4.7,
    durationMinutes: 180,
    bestTime: "Morning",
    tags: ["history", "temples", "walking"],
  },

  // PHUKET
  {
    id: "patong-beach",
    name: "Patong Beach",
    cityId: "phuket",
    type: "Beach",
    description:
      "Phuket's best-known resort beach surrounded by restaurants, nightlife and water activities.",
    rating: 4.3,
    durationMinutes: 180,
    bestTime: "Sunset",
    tags: ["beach", "nightlife", "water"],
  },
  {
    id: "old-phuket-town",
    name: "Old Phuket Town",
    cityId: "phuket",
    type: "Historic District",
    description:
      "A colorful historic quarter known for Sino-Portuguese architecture, cafés and local food.",
    rating: 4.6,
    durationMinutes: 150,
    bestTime: "Morning",
    tags: ["architecture", "food", "culture"],
  },

  // SINGAPORE
  {
    id: "marina-bay-sands",
    name: "Marina Bay Sands",
    cityId: "singapore",
    type: "Landmark",
    description:
      "Singapore's iconic integrated resort and one of the defining elements of its modern skyline.",
    rating: 4.7,
    durationMinutes: 120,
    bestTime: "Evening",
    tags: ["architecture", "city-view", "luxury"],
  },
  {
    id: "gardens-by-the-bay",
    name: "Gardens by the Bay",
    cityId: "singapore",
    type: "Garden",
    description:
      "A futuristic waterfront garden complex featuring Supertrees, conservatories and extensive plant collections.",
    rating: 4.8,
    durationMinutes: 180,
    bestTime: "Evening",
    tags: ["gardens", "architecture", "nature"],
  },
  {
    id: "sentosa",
    name: "Sentosa",
    cityId: "singapore",
    type: "Island",
    description:
      "A resort island offering beaches, attractions, entertainment and leisure activities.",
    rating: 4.5,
    durationMinutes: 240,
    bestTime: "Morning",
    tags: ["beach", "entertainment", "family"],
  },
  {
    id: "chinatown-singapore",
    name: "Chinatown",
    cityId: "singapore",
    type: "District",
    description:
      "A multicultural historic district filled with temples, shophouses, markets and hawker food.",
    rating: 4.6,
    durationMinutes: 150,
    bestTime: "Evening",
    tags: ["food", "culture", "shopping"],
  },

  // SYDNEY
  {
    id: "sydney-opera-house",
    name: "Sydney Opera House",
    cityId: "sydney",
    type: "Landmark",
    description:
      "Australia's architectural icon on Sydney Harbour and one of the world's most recognizable performing-arts buildings.",
    rating: 4.8,
    durationMinutes: 120,
    bestTime: "Sunset",
    tags: ["architecture", "culture", "harbor"],
  },
  {
    id: "harbour-bridge",
    name: "Sydney Harbour Bridge",
    cityId: "sydney",
    type: "Landmark",
    description:
      "The monumental steel arch bridge connecting Sydney's central districts across the harbor.",
    rating: 4.8,
    durationMinutes: 120,
    bestTime: "Sunset",
    tags: ["architecture", "harbor", "photography"],
  },
  {
    id: "bondi-beach",
    name: "Bondi Beach",
    cityId: "sydney",
    type: "Beach",
    description:
      "Sydney's iconic surf beach known for coastal walks, swimming and a lively beach culture.",
    rating: 4.7,
    durationMinutes: 180,
    bestTime: "Morning",
    tags: ["beach", "surfing", "coast"],
  },
  {
    id: "the-rocks",
    name: "The Rocks",
    cityId: "sydney",
    type: "Historic District",
    description:
      "Sydney's historic harborside district of sandstone buildings, lanes, markets and restaurants.",
    rating: 4.6,
    durationMinutes: 150,
    bestTime: "Evening",
    tags: ["history", "food", "architecture"],
  },

  // MELBOURNE
  {
    id: "federation-square",
    name: "Federation Square",
    cityId: "melbourne",
    type: "Public Square",
    description:
      "Melbourne's central cultural gathering place surrounded by galleries, restaurants and distinctive architecture.",
    rating: 4.5,
    durationMinutes: 90,
    bestTime: "Evening",
    tags: ["architecture", "culture", "city"],
  },
  {
    id: "queen-victoria-market",
    name: "Queen Victoria Market",
    cityId: "melbourne",
    type: "Market",
    description:
      "A historic market offering fresh produce, specialty food, clothing and local goods.",
    rating: 4.6,
    durationMinutes: 150,
    bestTime: "Morning",
    tags: ["food", "market", "shopping"],
  },
  {
    id: "hosier-lane",
    name: "Hosier Lane",
    cityId: "melbourne",
    type: "Street Art",
    description:
      "A famous laneway covered in constantly evolving urban art and murals.",
    rating: 4.6,
    durationMinutes: 60,
    bestTime: "Afternoon",
    tags: ["art", "photography", "culture"],
  },
  {
    id: "great-ocean-road",
    name: "Great Ocean Road",
    cityId: "melbourne",
    type: "Scenic Route",
    description:
      "A spectacular coastal road trip route west of Melbourne featuring cliffs, beaches and the Twelve Apostles.",
    rating: 4.9,
    durationMinutes: 720,
    bestTime: "Morning",
    tags: ["road-trip", "coast", "nature"],
  },
];

export type RouteSeed = [
  string,
  string,
  string,
  number,
  number,
  string
];

export const routes: RouteSeed[] = [
  // India
  ["delhi", "agra", "TRAIN", 120, 230, "Every 30 min"],
  ["delhi", "jaipur", "TRAIN", 270, 280, "Daily"],
  ["delhi", "mumbai", "FLIGHT", 135, 1150, "Multiple daily"],
  ["delhi", "goa", "FLIGHT", 165, 1515, "Multiple daily"],
  ["delhi", "varanasi", "FLIGHT", 90, 680, "Daily"],
  ["delhi", "kolkata", "FLIGHT", 130, 1305, "Multiple daily"],
  ["delhi", "bangalore", "FLIGHT", 165, 1740, "Multiple daily"],
  ["delhi", "rishikesh", "TRAIN", 240, 240, "Multiple daily"],
  ["agra", "jaipur", "TRAIN", 240, 240, "Daily"],
  ["jaipur", "mumbai", "FLIGHT", 120, 920, "Daily"],
  ["jaipur", "jodhpur", "TRAIN", 210, 330, "Daily"],
  ["jaipur", "udaipur", "TRAIN", 240, 390, "Daily"],
  ["jodhpur", "udaipur", "BUS", 270, 250, "Daily"],
  ["mumbai", "goa", "FLIGHT", 70, 440, "Multiple daily"],
  ["mumbai", "pune", "TRAIN", 195, 150, "Every hour"],
  ["mumbai", "bangalore", "FLIGHT", 105, 840, "Multiple daily"],
  ["mumbai", "ahmedabad", "TRAIN", 320, 490, "Multiple daily"],
  ["goa", "bangalore", "FLIGHT", 75, 480, "Daily"],
  ["goa", "hyderabad", "FLIGHT", 90, 540, "Daily"],
  ["pune", "hyderabad", "FLIGHT", 90, 560, "Daily"],
  ["bangalore", "hyderabad", "FLIGHT", 75, 500, "Multiple daily"],
  ["bangalore", "chennai", "TRAIN", 300, 350, "Multiple daily"],
  ["bangalore", "kochi", "FLIGHT", 65, 430, "Daily"],
  ["chennai", "kochi", "FLIGHT", 75, 550, "Daily"],
  ["hyderabad", "kolkata", "FLIGHT", 120, 1180, "Daily"],
  ["kolkata", "bhubaneswar", "TRAIN", 260, 440, "Multiple daily"],

  // Japan
  ["tokyo", "kyoto", "TRAIN", 135, 460, "Multiple daily"],
  ["tokyo", "osaka", "TRAIN", 150, 515, "Multiple daily"],
  ["kyoto", "osaka", "TRAIN", 30, 55, "Every 15 min"],
  ["kyoto", "nara", "TRAIN", 45, 40, "Every 20 min"],
  ["osaka", "nara", "TRAIN", 40, 35, "Every 15 min"],
  ["osaka", "hiroshima", "TRAIN", 90, 300, "Multiple daily"],

  // Europe
  ["paris", "rome", "FLIGHT", 125, 1100, "Multiple daily"],
  ["paris", "amsterdam", "TRAIN", 200, 500, "Multiple daily"],
  ["paris", "barcelona", "TRAIN", 410, 1030, "Daily"],
  ["rome", "florence", "TRAIN", 90, 270, "Multiple daily"],
  ["florence", "venice", "TRAIN", 135, 260, "Multiple daily"],
  ["rome", "venice", "TRAIN", 230, 530, "Multiple daily"],
  ["barcelona", "rome", "FLIGHT", 115, 860, "Multiple daily"],

  // Middle East & APAC
  ["dubai", "abu-dhabi", "BUS", 90, 140, "Every 30 min"],
  ["dubai", "bangkok", "FLIGHT", 390, 4900, "Daily"],
  ["dubai", "paris", "FLIGHT", 430, 5250, "Multiple daily"],
  ["bangkok", "chiang-mai", "FLIGHT", 70, 600, "Multiple daily"],
  ["bangkok", "phuket", "FLIGHT", 85, 690, "Multiple daily"],
  ["bangkok", "singapore", "FLIGHT", 150, 1420, "Multiple daily"],
  ["singapore", "sydney", "FLIGHT", 480, 6300, "Daily"],
  ["sydney", "melbourne", "FLIGHT", 90, 710, "Multiple daily"],
  ["paris", "tokyo", "FLIGHT", 780, 9700, "Daily"],
  ["bangalore", "singapore", "FLIGHT", 270, 3250, "Daily"],
];

/* =========================================================
   NORMALIZE DATA WITH SPECIFIC IMAGE LOOKUPS
   ========================================================= */

export const citiesWithImages = cities.map((city) => ({
  ...city,
  image: destinationImages[city.id] ?? FALLBACK_IMAGE,
  tags: city.tags ?? [],
  highlights: city.highlights ?? [],
}));

export const attractionsWithImages = attractions.map((attraction) => ({
  ...attraction,
  image:
    attractionImages[attraction.id] ??
    destinationImages[attraction.cityId] ??
    FALLBACK_IMAGE,
  description: attraction.description ?? `Explore ${attraction.name}.`,
  rating: attraction.rating ?? 4.5,
  durationMinutes: attraction.durationMinutes ?? 90,
  bestTime: attraction.bestTime ?? "Morning",
  tags: attraction.tags ?? [],
}));

/* =========================================================
   SEED
   ========================================================= */

async function seed() {
  const session = driver.session();
  const startedAt = Date.now();

  try {
    /* =====================================================
       CONSTRAINTS
       ===================================================== */

    console.log("\nCreating constraints...");

    await session.run(`
      CREATE CONSTRAINT country_id_unique IF NOT EXISTS
      FOR (n:Country)
      REQUIRE n.id IS UNIQUE
    `);

    await session.run(`
      CREATE CONSTRAINT region_id_unique IF NOT EXISTS
      FOR (n:Region)
      REQUIRE n.id IS UNIQUE
    `);

    await session.run(`
      CREATE CONSTRAINT city_id_unique IF NOT EXISTS
      FOR (n:City)
      REQUIRE n.id IS UNIQUE
    `);

    await session.run(`
      CREATE CONSTRAINT attraction_id_unique IF NOT EXISTS
      FOR (n:Attraction)
      REQUIRE n.id IS UNIQUE
    `);

    /* =====================================================
       CLEAR EXISTING GRAPH
       ===================================================== */

    console.log("\nClearing existing RouteGraph data...");

    await session.run(`
      MATCH (n)
      DETACH DELETE n
    `);

    /* =====================================================
       COUNTRIES
       ===================================================== */

    console.log("Creating countries...");

    await session.run(
      `
      UNWIND $countries AS country

      CREATE (c:Country {
        id: country.id,
        name: country.name,
        code: country.code
      })
      `,
      { countries }
    );

    /* =====================================================
       REGIONS
       ===================================================== */

    console.log("Creating regions...");

    await session.run(
      `
      UNWIND $regions AS region

      CREATE (r:Region {
        id: region.id,
        name: region.name
      })
      `,
      { regions }
    );

    /* =====================================================
       CITIES
       ===================================================== */

    console.log(`Creating ${citiesWithImages.length} cities...`);

    await session.run(
      `
      UNWIND $cities AS city

      MATCH (country:Country {
        id: city.countryId
      })

      MATCH (region:Region {
        id: city.regionId
      })

      CREATE (c:City {
        id: city.id,
        name: city.name,
        latitude: city.latitude,
        longitude: city.longitude,
        description: city.description,
        image: city.image,
        tags: city.tags,
        highlights: city.highlights
      })

      CREATE (c)-[:LOCATED_IN]->(country)
      CREATE (c)-[:IN_REGION]->(region)
      `,
      { cities: citiesWithImages }
    );

    /* =====================================================
       ATTRACTIONS
       ===================================================== */

    console.log(`Creating ${attractionsWithImages.length} attractions...`);

    await session.run(
      `
      UNWIND $attractions AS attraction

      MATCH (city:City {
        id: attraction.cityId
      })

      CREATE (a:Attraction {
        id: attraction.id,
        name: attraction.name,
        type: attraction.type,
        description: attraction.description,
        image: attraction.image,
        rating: attraction.rating,
        durationMinutes: attraction.durationMinutes,
        bestTime: attraction.bestTime,
        tags: attraction.tags
      })

      CREATE (a)-[:LOCATED_IN]->(city)
      `,
      { attractions: attractionsWithImages }
    );

    /* =====================================================
       BIDIRECTIONAL ROUTES
       ===================================================== */

    console.log(
      `Creating ${routes.length} bidirectional transport routes (${routes.length * 2} connections)...`
    );

    await session.run(
      `
      UNWIND $routes AS route

      MATCH (from:City { id: route[0] })
      MATCH (to:City { id: route[1] })

      // Forward route
      MERGE (from)-[:CONNECTED_BY {
        mode: route[2],
        durationMinutes: route[3],
        distanceKm: route[4],
        frequency: route[5]
      }]->(to)

      // Backward route for bidirectional compatibility
      MERGE (to)-[:CONNECTED_BY {
        mode: route[2],
        durationMinutes: route[3],
        distanceKm: route[4],
        frequency: route[5]
      }]->(from)
      `,
      { routes }
    );

    /* =====================================================
       GRAPH STATISTICS
       ===================================================== */

    const nodeCounts = await session.run(`
      MATCH (n)
      RETURN labels(n)[0] AS type, count(n) AS count
      ORDER BY type
    `);

    const relationshipCounts = await session.run(`
      MATCH ()-[r]->()
      RETURN type(r) AS type, count(r) AS count
      ORDER BY type
    `);

    const cityStats = await session.run(`
      MATCH (c:City)
      OPTIONAL MATCH (a:Attraction)-[:LOCATED_IN]->(c)
      RETURN count(DISTINCT c) AS cities, count(DISTINCT a) AS attractions
    `);

    const routeStats = await session.run(`
      MATCH ()-[r:CONNECTED_BY]->()
      RETURN count(r) AS routes, count(DISTINCT r.mode) AS transportModes
    `);

    const countryStats = await session.run(`
      MATCH (c:Country)
      OPTIONAL MATCH (city:City)-[:LOCATED_IN]->(c)
      RETURN count(DISTINCT c) AS countries, count(DISTINCT city) AS cities
    `);

    const transportStats = await session.run(`
      MATCH ()-[r:CONNECTED_BY]->()
      RETURN r.mode AS mode, count(r) AS count
      ORDER BY count DESC
    `);

    const topAttractions = await session.run(`
      MATCH (a:Attraction)-[:LOCATED_IN]->(c:City)
      RETURN a.name AS attraction, c.name AS city, a.rating AS rating
      ORDER BY a.rating DESC
      LIMIT 10
    `);

    /* =====================================================
       FINAL OUTPUT
       ===================================================== */

    const cityCount = cityStats.records[0].get("cities").toNumber();
    const attractionCount = cityStats.records[0].get("attractions").toNumber();
    const routeCount = routeStats.records[0].get("routes").toNumber();
    const transportModeCount = routeStats.records[0].get("transportModes").toNumber();
    const countryCount = countryStats.records[0].get("countries").toNumber();
    const elapsed = ((Date.now() - startedAt) / 1000).toFixed(2);

    console.log("\n==============================================");
    console.log("             ROUTEGRAPH SEED COMPLETE");
    console.log("==============================================\n");

    console.log("GRAPH SUMMARY");
    console.log(`  Countries       : ${countryCount}`);
    console.log(`  Cities          : ${cityCount}`);
    console.log(`  Attractions     : ${attractionCount}`);
    console.log(`  Routes          : ${routeCount}`);
    console.log(`  Transport Modes : ${transportModeCount}`);
    console.log(`  Seed Time       : ${elapsed}s`);

    console.log("\n----------------------------------------------");
    console.log("NODE COUNTS");
    for (const record of nodeCounts.records) {
      console.log(`  ${String(record.get("type")).padEnd(18)} ${record.get("count").toString()}`);
    }

    console.log("\n----------------------------------------------");
    console.log("RELATIONSHIP COUNTS");
    for (const record of relationshipCounts.records) {
      console.log(`  ${String(record.get("type")).padEnd(18)} ${record.get("count").toString()}`);
    }

    console.log("\n----------------------------------------------");
    console.log("TRANSPORT BREAKDOWN");
    for (const record of transportStats.records) {
      console.log(`  ${String(record.get("mode")).padEnd(18)} ${record.get("count").toString()}`);
    }

    console.log("\n----------------------------------------------");
    console.log("TOP ATTRACTIONS");
    for (const record of topAttractions.records) {
      console.log(`  ${record.get("attraction")} — ${record.get("city")} — ★ ${record.get("rating")}`);
    }

    console.log("\n==============================================");
    console.log("        GRAPH READY FOR EXPLORATION");
    console.log("==============================================\n");
  } catch (error) {
    console.error("\n==============================================");
    console.error("SEED FAILED");
    console.error("==============================================");
    console.error(error);
    process.exitCode = 1;
  } finally {
    await session.close();
    await driver.close();
  }
}

seed().catch((error) => {
  console.error("Fatal seed error:", error);
  process.exit(1);
});