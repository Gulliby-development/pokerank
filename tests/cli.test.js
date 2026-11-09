import { expect, test } from "vitest";
import { check } from "./helpers/run.js";

// prettier-ignore
const rows = [
  { args: [], files: {}, code: 2, out: "", err: "pokerank: missing command (rank, pots or showdown)\n" },
  { args: ["bogus"], files: {}, code: 2, out: "", err: "pokerank: unknown command \"bogus\"\n" },
  { args: ["Rank", "As"], files: {}, code: 2, out: "", err: "pokerank: unknown command \"Rank\"\n" },
  { args: ["--help"], files: {}, code: 0, out: "usage: pokerank rank CARD...\n       pokerank pots FILE\n       pokerank showdown FILE\n", err: "" },
  { args: ["--help", "rank"], files: {}, code: 2, out: "", err: "pokerank: unknown command \"--help\"\n" },
  { args: ["pots"], files: {}, code: 2, out: "", err: "pokerank: missing FILE\n" },
  { args: ["pots", "a.txt", "b.txt"], files: {}, code: 2, out: "", err: "pokerank: too many arguments\n" },
  { args: ["showdown", "-x", "a.txt"], files: {"a.txt": "board Ah Kd 7c 2s 9h\nseat ann 100 As Ks\nseat bob 100 Qd Qc\nseat cy 40 8h 8d\nfold dee 30\n"}, code: 2, out: "", err: "pokerank: unknown option \"-x\"\n" },
  { args: ["rank", "-1", "As"], files: {}, code: 2, out: "", err: "pokerank: unknown option \"-1\"\n" },
  { args: ["pots", "--board", "a.txt"], files: {"a.txt": "board Ah Kd 7c 2s 9h\nseat ann 100 As Ks\nseat bob 100 Qd Qc\nseat cy 40 8h 8d\nfold dee 30\n"}, code: 2, out: "", err: "pokerank: unknown option \"--board\"\n" },
  { args: ["showdown", "missing.txt"], files: {}, code: 2, out: "", err: "pokerank: missing.txt: cannot read the file\n" },
  { args: ["showdown", "-"], files: {}, code: 2, out: "", err: "pokerank: <stdin>: cannot read the file\n" },
];

for (const [index, row] of rows.entries()) {
  test(`row ${index + 1}`, () => {
    expect(check(row)).toEqual(row);
  });
}
