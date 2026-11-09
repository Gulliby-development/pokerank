// Fixed tables of pokerank: the card ranks and suits, the hand names, the limits and the usage text.
export const RANKS = "23456789TJQKA";
export const SUITS = "cdhs";
export const CATEGORIES = [
  "high card",
  "pair",
  "two pair",
  "trips",
  "straight",
  "flush",
  "full house",
  "quads",
  "straight flush",
];
export const MAX_PLAYERS = 10;
export const MAX_AMOUNT = 1000000000;
export const USAGE = "usage: pokerank rank CARD...\n       pokerank pots FILE\n       pokerank showdown FILE\n";
