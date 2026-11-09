function descending(values) {
  return [...values].sort((a, b) => b - a);
}

function straightRanks(ranks) {
  const unique = [...new Set(ranks)].sort((a, b) => b - a);
  if (unique.length !== 5) {
    return null;
  }
  if (unique[0] - unique[4] === 4) {
    return unique;
  }
  if (unique.join(",") === "14,5,4,3,2") {
    return [5, 4, 3, 2, 14];
  }
  return null;
}

function classify(cards) {
  const ranks = cards.map((card) => card.rank);
  const counts = new Map();
  for (const rank of ranks) {
    counts.set(rank, (counts.get(rank) ?? 0) + 1);
  }
  const groups = [...counts.entries()].sort(([rankA, countA], [rankB, countB]) => countB - countA || rankB - rankA);
  const isFlush = cards.every((card) => card.suit === cards[0].suit);
  const straight = straightRanks(ranks);

  if (isFlush && straight) {
    return { category: 8, ranks: straight };
  }
  if (groups[0][1] === 4) {
    const quad = groups[0][0];
    return { category: 7, ranks: [quad, quad, quad, quad, groups[1][0]] };
  }
  if (groups[0][1] === 3 && groups[1][1] === 2) {
    const trips = groups[0][0];
    const pair = groups[1][0];
    return { category: 6, ranks: [trips, trips, trips, pair, pair] };
  }
  if (isFlush) {
    return { category: 5, ranks: descending(ranks) };
  }
  if (straight) {
    return { category: 4, ranks: straight };
  }
  if (groups[0][1] === 3) {
    const trips = groups[0][0];
    const kickers = descending(groups.slice(1).map(([rank]) => rank));
    return { category: 3, ranks: [trips, trips, trips, ...kickers] };
  }
  const pairs = groups.filter(([, count]) => count === 2).map(([rank]) => rank);
  if (pairs.length >= 2) {
    const [highPair, lowPair] = descending(pairs);
    const kicker = groups.find(([, count]) => count === 1)?.[0] ?? descending(pairs)[2];
    return { category: 2, ranks: [highPair, highPair, lowPair, lowPair, kicker] };
  }
  if (pairs.length === 1) {
    const pair = pairs[0];
    const kickers = descending(groups.filter(([, count]) => count === 1).map(([rank]) => rank));
    return { category: 1, ranks: [pair, pair, ...kickers] };
  }
  return { category: 0, ranks: descending(ranks) };
}

export function compareHands(a, b) {
  if (a.category !== b.category) {
    return a.category - b.category;
  }
  for (let index = 0; index < 5; index += 1) {
    if (a.ranks[index] !== b.ranks[index]) {
      return a.ranks[index] - b.ranks[index];
    }
  }
  return 0;
}

export function bestHand(cards) {
  let best = null;
  for (let a = 0; a < cards.length - 4; a += 1) {
    for (let b = a + 1; b < cards.length - 3; b += 1) {
      for (let c = b + 1; c < cards.length - 2; c += 1) {
        for (let d = c + 1; d < cards.length - 1; d += 1) {
          for (let e = d + 1; e < cards.length; e += 1) {
            const candidate = classify([cards[a], cards[b], cards[c], cards[d], cards[e]]);
            if (best === null || compareHands(candidate, best) > 0) {
              best = candidate;
            }
          }
        }
      }
    }
  }
  return best;
}
