import { CATEGORIES, USAGE } from "./constants.js";
import { parseCard, rankChar } from "./cards.js";
import { bestHand, compareHands } from "./hands.js";
import { parseHand } from "./parse.js";
import { buildPots, splitPot } from "./pots.js";

function failure(message) {
  return { code: 2, out: "", err: `pokerank: ${message}\n` };
}

function success(out) {
  return { code: 0, out, err: "" };
}

function displayHand(hand) {
  return `${CATEGORIES[hand.category]} (${hand.ranks.map(rankChar).join(" ")})`;
}

export function main(args, io) {
  if (args.length === 1 && args[0] === "--help") {
    return success(USAGE);
  }
  if (args.length === 0) {
    return failure("missing command (rank, pots or showdown)");
  }

  const command = args[0];
  if (command !== "rank" && command !== "pots" && command !== "showdown") {
    return failure(`unknown command "${command}"`);
  }

  const option = args.slice(1).find((argument) => argument.startsWith("-") && argument !== "-");
  if (option !== undefined) {
    return failure(`unknown option "${option}"`);
  }

  if (command === "rank") {
    const cards = [];
    const seen = new Set();
    for (const text of args.slice(1)) {
      const card = parseCard(text);
      if (card === null) {
        return failure(`invalid card "${text}"`);
      }
      if (seen.has(text)) {
        return failure(`duplicate card "${text}"`);
      }
      seen.add(text);
      cards.push(card);
    }
    if (cards.length < 5 || cards.length > 7) {
      return failure("rank needs 5 to 7 cards");
    }
    return success(`${displayHand(bestHand(cards))}\n`);
  }

  const operands = args.slice(1);
  if (operands.length === 0) {
    return failure("missing FILE");
  }
  if (operands.length > 1) {
    return failure("too many arguments");
  }

  const path = operands[0];
  const result = path === "-" ? io.readStdin() : io.readFile(path);
  const display = path === "-" ? "<stdin>" : path.replaceAll("\\", "/");
  if (result.error !== undefined) {
    return failure(`${display}: ${result.error}`);
  }

  let hand;
  try {
    hand = parseHand(display, result.text);
  } catch (error) {
    return failure(error.message);
  }

  if (command === "showdown") {
    if (hand.board === null) {
      return failure(`${display}: no board line`);
    }

    const evaluated = new Map();
    for (const player of hand.players) {
      if (!player.folded) {
        evaluated.set(player, bestHand([...player.cards, ...hand.board]));
      }
    }

    const winnings = new Map(hand.players.map((player) => [player, 0]));
    const lines = [`board: ${hand.board.map((card) => card.text).join(" ")}`];

    for (const player of hand.players) {
      lines.push(player.folded ? `${player.name}: folded` : `${player.name}: ${displayHand(evaluated.get(player))}`);
    }

    const pots = buildPots(hand.players);
    for (const [index, pot] of pots.entries()) {
      let strongest = evaluated.get(pot.eligible[0]);
      let winners = [pot.eligible[0]];
      for (const player of pot.eligible.slice(1)) {
        const comparison = compareHands(evaluated.get(player), strongest);
        if (comparison > 0) {
          strongest = evaluated.get(player);
          winners = [player];
        } else if (comparison === 0) {
          winners.push(player);
        }
      }
      const shares = splitPot(pot.amount, winners);
      for (const { player, share } of shares) {
        winnings.set(player, winnings.get(player) + share);
      }
      const awardText = shares.map(({ player, share }) => `${player.name} ${share}`).join(", ");
      lines.push(
        `pot ${index + 1}: ${pot.amount} (${pot.eligible.map((player) => player.name).join(" ")}) -> ${awardText}`,
      );
    }

    for (const player of hand.players) {
      const total = winnings.get(player);
      const net = total - player.chips;
      const signedNet = net > 0 ? `+${net}` : net < 0 ? `${net}` : "0";
      lines.push(`${player.name} => ${total} (${signedNet})`);
    }
    return success(`${lines.join("\n")}\n`);
  }

  const pots = buildPots(hand.players);
  const lines = pots.map(
    (pot, index) => `pot ${index + 1}: ${pot.amount} (${pot.eligible.map((player) => player.name).join(" ")})`,
  );
  const total = hand.players.reduce((sum, player) => sum + player.chips, 0);
  lines.push(`total: ${total}`);
  return success(`${lines.join("\n")}\n`);
}
