import { expect, test } from "vitest";
import { check } from "./helpers/run.js";

// prettier-ignore
const rows = [
  { args: ["pots", "h.txt"], files: {"h.txt": "seat ann 10 As Ks\n"}, code: 0, out: "pot 1: 10 (ann)\ntotal: 10\n", err: "" },
  { args: ["pots", "h.txt"], files: {"h.txt": "# note\n\n  \t\nseat ann 10 As Ks\n"}, code: 0, out: "pot 1: 10 (ann)\ntotal: 10\n", err: "" },
  { args: ["pots", "h.txt"], files: {"h.txt": "\ufeffseat ann 10 As Ks\r\nseat bob 10 Qd Qc\r\n"}, code: 0, out: "pot 1: 20 (ann bob)\ntotal: 20\n", err: "" },
  { args: ["pots", "h.txt"], files: {"h.txt": "seat ann 10 As Ks\nseat bob 10 Qd Qc"}, code: 0, out: "pot 1: 20 (ann bob)\ntotal: 20\n", err: "" },
  { args: ["pots", "h.txt"], files: {"h.txt": "seat\tann\t10  As \tKs\nfold  bob   4\n"}, code: 0, out: "pot 1: 14 (ann)\ntotal: 14\n", err: "" },
  { args: ["pots", "h.txt"], files: {"h.txt": "seat ann 10 As Ks # note\n"}, code: 2, out: "", err: "pokerank: h.txt:1: seat needs NAME AMOUNT CARD CARD\n" },
  { args: ["pots", "h.txt"], files: {"h.txt": "seat ann 10 As Ks\ncheck 5\n"}, code: 2, out: "", err: "pokerank: h.txt:2: unknown keyword \"check\"\n" },
  { args: ["pots", "h.txt"], files: {"h.txt": "Seat ann 10 As Ks\n"}, code: 2, out: "", err: "pokerank: h.txt:1: unknown keyword \"Seat\"\n" },
  { args: ["pots", "h.txt"], files: {"h.txt": "seat ann 10 As\n"}, code: 2, out: "", err: "pokerank: h.txt:1: seat needs NAME AMOUNT CARD CARD\n" },
  { args: ["pots", "h.txt"], files: {"h.txt": "seat ann 10 As Ks Qd\n"}, code: 2, out: "", err: "pokerank: h.txt:1: seat needs NAME AMOUNT CARD CARD\n" },
  { args: ["pots", "h.txt"], files: {"h.txt": "fold ann\n"}, code: 2, out: "", err: "pokerank: h.txt:1: fold needs NAME AMOUNT\n" },
  { args: ["pots", "h.txt"], files: {"h.txt": "fold ann 10 5\n"}, code: 2, out: "", err: "pokerank: h.txt:1: fold needs NAME AMOUNT\n" },
  { args: ["pots", "h.txt"], files: {"h.txt": "seat ann 10 As Ks\nfold bob 5 Qd\n"}, code: 2, out: "", err: "pokerank: h.txt:2: fold needs NAME AMOUNT\n" },
  { args: ["pots", "h.txt"], files: {"h.txt": "seat abcdefghijkl 10 As Ks\n"}, code: 0, out: "pot 1: 10 (abcdefghijkl)\ntotal: 10\n", err: "" },
  { args: ["pots", "h.txt"], files: {"h.txt": "seat abcdefghijklm 10 As Ks\n"}, code: 2, out: "", err: "pokerank: h.txt:1: invalid name \"abcdefghijklm\"\n" },
  { args: ["pots", "h.txt"], files: {"h.txt": "seat ann 10 As Ks\nseat ann 5 Qd Qc\n"}, code: 2, out: "", err: "pokerank: h.txt:2: duplicate name \"ann\"\n" },
  { args: ["pots", "h.txt"], files: {"h.txt": "seat ann 1000000000 As Ks\n"}, code: 0, out: "pot 1: 1000000000 (ann)\ntotal: 1000000000\n", err: "" },
  { args: ["pots", "h.txt"], files: {"h.txt": "seat ann 1000000001 As Ks\n"}, code: 2, out: "", err: "pokerank: h.txt:1: invalid amount \"1000000001\"\n" },
  { args: ["pots", "h.txt"], files: {"h.txt": "seat ann 0 As Ks\n"}, code: 2, out: "", err: "pokerank: h.txt:1: invalid amount \"0\"\n" },
  { args: ["pots", "h.txt"], files: {"h.txt": "seat ann 007 As Ks\n"}, code: 2, out: "", err: "pokerank: h.txt:1: invalid amount \"007\"\n" },
  { args: ["pots", "h.txt"], files: {"h.txt": "seat ann +5 As Ks\n"}, code: 2, out: "", err: "pokerank: h.txt:1: invalid amount \"+5\"\n" },
  { args: ["pots", "h.txt"], files: {"h.txt": "seat ann 12345678901 As Ks\n"}, code: 2, out: "", err: "pokerank: h.txt:1: invalid amount \"12345678901\"\n" },
  { args: ["pots", "h.txt"], files: {"h.txt": "seat ann 10 As Kx\n"}, code: 2, out: "", err: "pokerank: h.txt:1: invalid card \"Kx\"\n" },
  { args: ["pots", "h.txt"], files: {"h.txt": "seat ann 10 As As\n"}, code: 2, out: "", err: "pokerank: h.txt:1: duplicate card \"As\"\n" },
  { args: ["pots", "h.txt"], files: {"h.txt": "seat ann 10 As Ks\nseat bob 10 Ks Qd\n"}, code: 2, out: "", err: "pokerank: h.txt:2: duplicate card \"Ks\"\n" },
  { args: ["pots", "h.txt"], files: {"h.txt": "board Ah Kd 7c 2s 9h\nseat ann 10 As Ks\n"}, code: 0, out: "pot 1: 10 (ann)\ntotal: 10\n", err: "" },
  { args: ["pots", "h.txt"], files: {"h.txt": "board Ah Kd 7c 2s\nseat ann 10 As Ks\n"}, code: 2, out: "", err: "pokerank: h.txt:1: board needs 5 cards\n" },
  { args: ["pots", "h.txt"], files: {"h.txt": "board Ah Kd 7c 2s 9h 3h\nseat ann 10 As Ks\n"}, code: 2, out: "", err: "pokerank: h.txt:1: board needs 5 cards\n" },
  { args: ["pots", "h.txt"], files: {"h.txt": "board Ah Kd 7c 2s 1h\n"}, code: 2, out: "", err: "pokerank: h.txt:1: invalid card \"1h\"\n" },
  { args: ["pots", "h.txt"], files: {"h.txt": "seat ann 10 As Ks\nfold bob 5\nseat cy 10 Qd Qc\nfold dee 5\nfold eli 5\nfold fay 5\nfold gus 5\nfold hal 5\nfold ivy 5\nfold jo 5\n"}, code: 0, out: "pot 1: 60 (ann cy)\ntotal: 60\n", err: "" },
  { args: ["pots", "h.txt"], files: {"h.txt": "seat ann 10 As Ks\nfold bob 5\nseat cy 10 Qd Qc\nfold dee 5\nfold eli 5\nfold fay 5\nfold gus 5\nfold hal 5\nfold ivy 5\nfold jo 5\nfold kim 5\n"}, code: 2, out: "", err: "pokerank: h.txt:11: more than 10 players\n" },
];

for (const [index, row] of rows.entries()) {
  test(`row ${index + 1}`, () => {
    expect(check(row)).toEqual(row);
  });
}
