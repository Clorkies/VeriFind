export type ItemCategory = "electronics" | "books" | "valuables";

export type ItemStatus = "found" | "claimed" | "resolved";

export interface Item {
  id: string;
  name: string;
  category: ItemCategory;
  location: string;
  status: ItemStatus;
  imageUrl: string | null;
  txHash: string;
  foundAt: string;
}

function pic(seed: string, w = 480, h = 320) {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

export const MOCK_ITEMS: Item[] = [
  {
    id: "1",
    name: "AirPods Pro",
    category: "electronics",
    location: "Found at: N-Building / Cafeteria",
    status: "found",
    imageUrl: pic("vf-airpods"),
    txHash:
      "5b2c9a1f4e3d8c7b6a594837261504132f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c",
    foundAt: "2026-04-22T14:30:00.000Z",
  },
  {
    id: "2",
    name: "TI-84 Calculator",
    category: "electronics",
    location: "Found at: Library / 3F Study Pods",
    status: "claimed",
    imageUrl: pic("vf-calc"),
    txHash:
      "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234",
    foundAt: "2026-04-20T09:15:00.000Z",
  },
  {
    id: "3",
    name: "Umbrella (Black)",
    category: "valuables",
    location: "Found at: Main Gate / Waiting Area",
    status: "found",
    imageUrl: null,
    txHash:
      "deadbeef0123456789abcdef0123456789abcdef0123456789abcdef012345",
    foundAt: "2026-04-21T11:00:00.000Z",
  },
  {
    id: "4",
    name: "Discrete Math Textbook",
    category: "books",
    location: "Found at: S-Building / Hallway B",
    status: "found",
    imageUrl: pic("vf-book1"),
    txHash:
      "cafebabe11223344556677889900aabbccddeeff0011223344556677889900",
    foundAt: "2026-04-18T16:45:00.000Z",
  },
  {
    id: "5",
    name: "Student ID Lanyard",
    category: "valuables",
    location: "Found at: Gym / Locker Row 4",
    status: "resolved",
    imageUrl: pic("vf-lanyard"),
    txHash:
      "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
    foundAt: "2026-04-15T08:20:00.000Z",
  },
  {
    id: "6",
    name: "USB-C Hub (Anker)",
    category: "electronics",
    location: "Found at: IT Lab / Bench 2",
    status: "found",
    imageUrl: pic("vf-hub"),
    txHash:
      "fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210",
    foundAt: "2026-04-23T10:05:00.000Z",
  },
  {
    id: "7",
    name: "Data Structures Notes",
    category: "books",
    location: "Found at: Library / Quiet Zone",
    status: "claimed",
    imageUrl: null,
    txHash:
      "aaaabbbbccccddddeeeeffff00001111aaaabbbbccccddddeeeeffff0000",
    foundAt: "2026-04-19T13:40:00.000Z",
  },
  {
    id: "8",
    name: "Mechanical Keyboard (75%)",
    category: "electronics",
    location: "Found at: CS Dept / Lab 101",
    status: "found",
    imageUrl: pic("vf-kb"),
    txHash:
      "111122223333444455556666777788889999aaaabbbbccccddddeeeeffff",
    foundAt: "2026-04-24T07:55:00.000Z",
  },
  {
    id: "9",
    name: "Silver Water Bottle",
    category: "valuables",
    location: "Found at: Cafeteria / Outdoor Tables",
    status: "found",
    imageUrl: pic("vf-bottle"),
    txHash:
      "bbbbccccddddeeeeffff0000111122223333444455556666777788889999",
    foundAt: "2026-04-22T18:10:00.000Z",
  },
  {
    id: "10",
    name: "Operating Systems (10th Ed.)",
    category: "books",
    location: "Found at: N-Building / Room 204",
    status: "resolved",
    imageUrl: pic("vf-osbook"),
    txHash:
      "ccccddddeeeeffff0000111122223333444455556666777788889999aaaa",
    foundAt: "2026-04-10T12:00:00.000Z",
  },
  {
    id: "11",
    name: "Wireless Mouse (Logitech)",
    category: "electronics",
    location: "Found at: Library / Ground Floor",
    status: "claimed",
    imageUrl: pic("vf-mouse"),
    txHash:
      "dddd88889999aaaabbbbccccddddeeeeffff000011112222333344445555",
    foundAt: "2026-04-17T15:25:00.000Z",
  },
  {
    id: "12",
    name: "Leather Wallet (Brown)",
    category: "valuables",
    location: "Found at: Parking B / Near Elevator",
    status: "found",
    imageUrl: pic("vf-wallet"),
    txHash:
      "eeee9999aaaabbbbccccddddeeeeffff0000111122223333444455556666",
    foundAt: "2026-04-23T20:00:00.000Z",
  },
  {
    id: "13",
    name: "Compiler Design Handout Set",
    category: "books",
    location: "Found at: Faculty Lounge / Table A",
    status: "found",
    imageUrl: null,
    txHash:
      "ffff0000111122223333444455556666777788889999aaaabbbbccccdddd",
    foundAt: "2026-04-21T09:30:00.000Z",
  },
  {
    id: "14",
    name: "iPad Mini + Case",
    category: "electronics",
    location: "Found at: Auditorium / Seat Block C",
    status: "resolved",
    imageUrl: pic("vf-ipad"),
    txHash:
      "0000aaaa1111bbbb2222cccc3333dddd4444eeee5555ffff666677778888",
    foundAt: "2026-04-08T11:11:00.000Z",
  },
];

export function truncateTxId(hash: string, start = 5, end = 5) {
  if (hash.length <= start + end + 2) return hash;
  return `${hash.slice(0, start)}...${hash.slice(-end)}`;
}
