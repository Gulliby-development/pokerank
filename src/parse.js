import { parseCard } from "./cards.js";
import { MAX_AMOUNT, MAX_PLAYERS } from "./constants.js";

const NAME_PATTERN = /^[A-Za-z0-9_]{1,12}$/;
const AMOUNT_PATTERN = /^(?:[1-9][0-9]*)$/;

function problem(display, line, message) {
  return new Error(`${display}:${line}: ${message}`);
}

function wordsOf(line) {
  return line.split(/[ \t]+/).filter((word) => word.length > 0);
}

export function parseHand(display, text) {
  const source = text.startsWith("\uFEFF") ? text.slice(1) : text;
  const lines = source.split("\n");
  const boardCards = new Set();
  const playerNames = new Set();
  const players = [];
  let board = null;
  let hasBoard = false;
  let hasSeat = false;

  for (let index = 0; index < lines.length; index += 1) {
    let line = lines[index];
    if (index < lines.length - 1 && line.endsWith("\r")) {
      line = line.slice(0, -1);
    }
    const words = wordsOf(line);
    if (words.length === 0 || words[0].startsWith("#")) {
      continue;
    }

    const keyword = words[0];
    if (keyword === "board") {
      if (hasBoard) {
        throw problem(display, index + 1, "second board line");
      }
      if (words.length !== 6) {
        throw problem(display, index + 1, "board needs 5 cards");
      }
      const cards = [];
      for (const token of words.slice(1)) {
        const card = parseCard(token);
        if (card === null) {
          throw problem(display, index + 1, `invalid card "${token}"`);
        }
        if (boardCards.has(token)) {
          throw problem(display, index + 1, `duplicate card "${token}"`);
        }
        boardCards.add(token);
        cards.push(card);
      }
      board = cards;
      hasBoard = true;
      continue;
    }

    if (keyword !== "seat" && keyword !== "fold") {
      throw problem(display, index + 1, `unknown keyword "${keyword}"`);
    }

    const isSeat = keyword === "seat";
    const expectedWords = isSeat ? 5 : 3;
    if (words.length !== expectedWords) {
      throw problem(display, index + 1, isSeat ? "seat needs NAME AMOUNT CARD CARD" : "fold needs NAME AMOUNT");
    }
    if (players.length >= MAX_PLAYERS) {
      throw problem(display, index + 1, "more than 10 players");
    }

    const name = words[1];
    if (!NAME_PATTERN.test(name)) {
      throw problem(display, index + 1, `invalid name "${name}"`);
    }
    if (playerNames.has(name)) {
      throw problem(display, index + 1, `duplicate name "${name}"`);
    }

    const amountText = words[2];
    const chips = Number(amountText);
    if (!AMOUNT_PATTERN.test(amountText) || chips > MAX_AMOUNT) {
      throw problem(display, index + 1, `invalid amount "${amountText}"`);
    }

    const cards = [];
    if (isSeat) {
      hasSeat = true;
      for (const token of words.slice(3)) {
        const card = parseCard(token);
        if (card === null) {
          throw problem(display, index + 1, `invalid card "${token}"`);
        }
        if (boardCards.has(token)) {
          throw problem(display, index + 1, `duplicate card "${token}"`);
        }
        boardCards.add(token);
        cards.push(card);
      }
    }

    playerNames.add(name);
    players.push({ name, chips, folded: !isSeat, cards });
  }

  if (!hasSeat) {
    throw new Error(`${display}: no seat lines`);
  }
  return { board, players };
}
