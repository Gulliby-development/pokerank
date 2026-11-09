<p align="center"><img src="docs/logo.svg" width="96" alt="" /></p>

# pokerank

[![CI](https://github.com/Gulliby-development/pokerank/actions/workflows/ci.yml/badge.svg)](https://github.com/Gulliby-development/pokerank/actions/workflows/ci.yml) [![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

pokerank is an offline Texas hold'em hand ranker and whole-chip pot splitter for home-game hosts and poker teachers. Give it five to seven cards to rank, or describe a showdown in a text file to see best hands, main and side pots, winners, payouts, and each player's net. It uses exact integer arithmetic: it does not simulate deals, use randomness, or connect to a network.

## Requirements and setup

Use Node.js 20 or newer on Windows, macOS, or Linux. Install the project's pinned development dependencies with either:

```sh
bun install
# or
npm install
```

Run the CLI from the repository directory with `node bin/pokerank.js`. No install is needed to run the program beyond having Node.js. For example, `node bin/pokerank.js --help` prints its usage.

## Cards and hand ranking

A card is exactly two characters: a rank from `23456789TJQKA` followed by a lowercase suit from `cdhs`. Thus `As` is the ace of spades and `Td` is the ten of diamonds. `10s`, lowercase ranks, uppercase suits, and all other spellings are invalid. A hand has five to seven distinct cards; the best five-card combination is used.

Hands rank from weakest to strongest: high card, pair, two pair, trips (three of a kind), straight, flush, full house, quads (four of a kind), and straight flush. Suits never break ties. Compare the category first, then compare its five displayed ranks from left to right; the first higher rank wins. Equal values tie.

A straight uses five consecutive ranks. Ace may be high (ten through ace) or low (ace through five); the low ace-high display is `5 4 3 2 A`. There is no wraparound. A straight flush is a straight all in one suit. A flush uses the five highest cards of its suit, including when more than five cards of that suit are available.

The rank tuple is arranged to compare hands correctly:

- Straight and straight flush show the ranks from high to low.
- Quads show four equal ranks followed by the best kicker.
- Full houses show the triplet followed by the pair. With multiple triplets, the higher is used for the triplet; with trips and two pairs, the higher pair is used.
- Flush and high card show five descending ranks.
- Trips show the triplet then two highest kickers.
- Two pair shows the higher pair, lower pair, then the best remaining rank. With three pairs, the third pair can supply that kicker.
- One pair shows the pair then the three highest kickers.

## Hand-file format

The `pots` and `showdown` commands read UTF-8 text. One leading byte order mark is ignored. Lines are separated by LF; for CRLF, the CR immediately before LF is removed. Words are separated by spaces or tabs. Blank lines and lines whose first word begins with `#` are ignored; comments are not permitted after other words on a line. Keywords are lowercase.

Use these forms, with cards written in the same format described above:

```text
board C1 C2 C3 C4 C5
seat NAME CHIPS C1 C2
fold NAME CHIPS
```

A board line is optional for `pots`, required for `showdown`, and may appear at most once wherever it occurs in the file. A seat is an active player; a fold records a folded player's contribution. The board and all active hands share one card set, so a card cannot be repeated anywhere. Seats and folds together preserve file order and may total no more than 10 players.

Names are unique (case-sensitive), 1–12 characters, and contain only ASCII letters, digits, or underscores. Chip amounts are unsigned decimal integers from 1 through 1000000000, with no sign or leading zero. Amounts and pot arithmetic use whole chips.

Validation proceeds in file order and stops at the first issue. For a board line, checks are: repeated board line, exactly five cards, then each card left-to-right for validity and duplication. For a seat or fold line, checks are: exact word count, player limit, name validity then uniqueness, amount validity, then (for seats) each card's validity then uniqueness. A line with another keyword reports `unknown keyword "WORD"`. Exact line errors include `second board line`, `board needs 5 cards`, `seat needs NAME AMOUNT CARD CARD`, `fold needs NAME AMOUNT`, `more than 10 players`, `invalid name "X"`, `duplicate name "X"`, `invalid amount "X"`, `invalid card "X"`, and `duplicate card "X"`. A line error is displayed as `DISPLAY:LINE: MESSAGE`. After all lines, the absence of any seat line is checked before a missing board for showdown: `DISPLAY: no seat lines` precedes `DISPLAY: no board line`. The displayed file path changes backslashes to forward slashes; standard input is displayed as `<stdin>`.

## Commands

```text
usage: pokerank rank CARD...
       pokerank pots FILE
       pokerank showdown FILE
```

Only `--help` by itself prints usage and exits successfully. Otherwise, command-line checks are ordered: no arguments reports `missing command (rank, pots or showdown)`; an unknown command reports `unknown command "X"`; then an argument beginning with a hyphen other than the file marker `-` reports `unknown option "X"`; command-specific checks follow. Options are not supported. Every error is written to standard error with exit code 2 and no standard output; its complete form is `pokerank: TEXT`. Successful commands exit 0. If a file cannot be read, the exact diagnostic is `pokerank: DISPLAY: cannot read the file`; if its bytes are not valid UTF-8, it is `pokerank: DISPLAY: input is not valid UTF-8`. DISPLAY is the file name with backslashes changed to forward slashes, or `<stdin>` for standard input. Failed commands produce no partial output.

### Rank a hand

`node bin/pokerank.js rank CARD...` accepts cards as separate arguments. Each card is checked left-to-right for validity and then duplication; after that, a count outside five to seven reports `rank needs 5 to 7 cards`. Success prints one line containing the best category and its five comparison ranks, for example `straight (5 4 3 2 A)`.

### List pots

`node bin/pokerank.js pots FILE` accepts one file path or `-` for standard input. Missing and extra operands report `missing FILE` and `too many arguments`. It prints each pot as `pot N: AMOUNT (NAMES)`, with eligible active players in file order, followed by `total: SUM`. It checks the file and hand-file errors described above, but does not require a board.

### Settle a showdown

`node bin/pokerank.js showdown FILE` takes the same file operand and validation behavior as `pots`, but requires a board. It prints, without blank lines: the board in its original card spelling; each player in file order with their best hand or `folded`; each pot and its winners as `pot N: AMOUNT (NAMES) -> NAME SHARE` (winners in file order, separated by comma and space); then each player's total and net as `NAME => TOTAL (NET)`. Positive nets have a plus sign, negative nets a minus sign, and zero is `0`. Errors are atomic: a failed run prints no partial results.

## Pots and payouts

Distinct active-player contribution totals define ascending pot thresholds. At each threshold, the pot receives the incremental chips contributed by every player, including folded players, and active players who reached that threshold are eligible, in file order. Folded contributions above the largest active contribution are added to the final pot. A player who is the sole eligible winner receives that pot back.

At showdown, the strongest eligible hand wins each pot. Tied winners split it evenly using integer division; any remainder chips go one each to the earliest winners in file order. A player's total is all shares awarded to them, and their net is that total less their contribution.

## Example

The following complete transcript uses a POSIX shell in the repository directory:

```text
$ printf 'board 2c 7d 9h Jc Kd\\nseat ann 100 Ah Kh\\nseat bob 100 Ad Ks\\nseat cy 40 Qs Ts\\nfold dee 25\\nfold eli 51\\n' > hand.txt
$ node bin/pokerank.js showdown hand.txt
board: 2c 7d 9h Jc Kd
ann: pair (K K A J 9)
bob: pair (K K A J 9)
cy: straight (K Q J T 9)
dee: folded
eli: folded
pot 1: 185 (ann bob cy) -> cy 185
pot 2: 131 (ann bob) -> ann 66, bob 65
ann => 66 (-34)
bob => 65 (-35)
cy => 185 (+145)
dee => 0 (-25)
eli => 0 (-51)
$ node bin/pokerank.js pots hand.txt
pot 1: 185 (ann bob cy)
pot 2: 131 (ann bob)
total: 316
$ node bin/pokerank.js rank Ah 2d 3c 4s 5h Kd Qc
straight (5 4 3 2 A)
$ node bin/pokerank.js rank Ah Kd Qc Js 1h 2>&1; echo "exit $?"
pokerank: invalid card "1h"
exit 2
$ rm hand.txt
```

## Development

The prescribed suite contains 110 literal behavior rows across CLI, card, hand, hand-file, pots, and showdown coverage. Run the project's checks:

```sh
bun run lint
bun run format:check
bun run test
```

See [LICENSE](LICENSE) for the MIT license.

---

Built with [BAKED](https://github.com/Gulliby-development/baked), an open-source coding agent (bench round R88).
