export interface SystemQuote {
  id: string;
  quote: string;
  author: string;
  category: 'motivation' | 'discipline' | 'level_up' | 'nutrition' | 'monarch';
  source?: string;
}

export const SYSTEM_QUOTES: SystemQuote[] = [
  // --- SUNG JIN-WOO & SOLO LEVELING SYSTEM DIRECTIVES ---
  {
    id: 'quote_1',
    quote: 'The only person who can decide my limit is myself.',
    author: 'Sung Jin-woo',
    category: 'discipline',
  },
  {
    id: 'quote_2',
    quote: 'Arise. My power does not waver, and my shadows do not retreat.',
    author: 'The Shadow Monarch',
    category: 'monarch',
  },
  {
    id: 'quote_3',
    quote: 'If the world doesn’t give you strength, take it for yourself through daily execution.',
    author: 'Sung Jin-woo',
    category: 'motivation',
  },
  {
    id: 'quote_4',
    quote: 'A daily quest is an absolute command. There is no negotiation with The System.',
    author: 'The System Architect',
    category: 'discipline',
  },
  {
    id: 'quote_5',
    quote: 'Leveling up is the only absolute truth in this world.',
    author: 'Sung Jin-woo',
    category: 'level_up',
  },
  {
    id: 'quote_6',
    quote: 'I don’t stop when I’m tired. I stop when the quest is finished.',
    author: 'Sung Jin-woo',
    category: 'motivation',
  },
  {
    id: 'quote_7',
    quote: 'Food is the sacred biological fuel that repairs torn muscle fibers after battle.',
    author: 'Hunter Metabolic Ledger',
    category: 'nutrition',
  },
  {
    id: 'quote_8',
    quote: 'Every rep in the dark is an extra level under the light.',
    author: 'Hunter Guild Creed',
    category: 'discipline',
  },
  {
    id: 'quote_9',
    quote: 'I will become stronger. No matter what it takes, one rep at a time.',
    author: 'Sung Jin-woo',
    category: 'monarch',
  },
  {
    id: 'quote_10',
    quote: 'My heart will not stop beating until I reach the apex of strength.',
    author: 'Sung Jin-woo',
    category: 'motivation',
  },
  {
    id: 'quote_11',
    quote: 'Pain is simply weakness leaving the vessel. Adapt, recover, conquer.',
    author: 'The System Architect',
    category: 'discipline',
  },
  {
    id: 'quote_12',
    quote: 'The gap between an E-Rank hunter and a Monarch is built on daily progressive overload.',
    author: 'The Shadow Monarch',
    category: 'level_up',
  },
];

export function getRandomQuote(category?: SystemQuote['category']): SystemQuote {
  let list = SYSTEM_QUOTES;

  if (category) {
    const catFiltered = list.filter((q) => q.category === category);
    if (catFiltered.length > 0) list = catFiltered;
  }

  const index = Math.floor(Math.random() * list.length);
  return list[index] || SYSTEM_QUOTES[0];
}
