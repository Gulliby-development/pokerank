import { RANKS, SUITS } from "./constants.js";

const rankValues = new Map([...RANKS].map((rank, index) => [rank, index + 2]));

export function parseCard(text) {
  if (typeof text !== "string" || text.length !== 2) {
    return null;
  }

  const rank = rankValues.get(text[0]);
  const suit = text[1];
  if (rank === undefined || !SUITS.includes(suit)) {
    return null;
  }

  return { text, rank, suit };
}

export function rankChar(value) {
  return Number.isInteger(value) && value >= 2 && value <= 14 ? RANKS[value - 2] : undefined;
}
