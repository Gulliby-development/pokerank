export function buildPots(players) {
  const thresholds = [...new Set(players.filter((player) => !player.folded).map((player) => player.chips))].sort(
    (a, b) => a - b,
  );
  const pots = [];
  let previous = 0;

  for (const threshold of thresholds) {
    let amount = 0;
    for (const player of players) {
      amount += Math.max(0, Math.min(player.chips, threshold) - previous);
    }
    pots.push({
      amount,
      eligible: players.filter((player) => !player.folded && player.chips >= threshold),
    });
    previous = threshold;
  }

  const lastPot = pots[pots.length - 1];
  for (const player of players) {
    if (player.folded && player.chips > previous) {
      lastPot.amount += player.chips - previous;
    }
  }

  return pots;
}

export function splitPot(amount, winners) {
  const baseShare = Math.floor(amount / winners.length);
  const remainder = amount % winners.length;
  return winners.map((player, index) => ({
    player,
    share: baseShare + (index < remainder ? 1 : 0),
  }));
}
