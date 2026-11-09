import { expect, test } from "vitest";
import { check } from "./helpers/run.js";

// prettier-ignore
const rows = [
  { args: ["rank"], files: {}, code: 2, out: "", err: "pokerank: rank needs 5 to 7 cards\n" },
  { args: ["rank", "As", "Ks", "Qs", "Js"], files: {}, code: 2, out: "", err: "pokerank: rank needs 5 to 7 cards\n" },
  { args: ["rank", "As", "Ks", "Qs", "Js", "Ts", "9s", "8s", "7s"], files: {}, code: 2, out: "", err: "pokerank: rank needs 5 to 7 cards\n" },
  { args: ["rank", "As", "Ks", "Qs", "Js", "1s"], files: {}, code: 2, out: "", err: "pokerank: invalid card \"1s\"\n" },
  { args: ["rank", "As", "Ks", "Qs", "Js", "10s"], files: {}, code: 2, out: "", err: "pokerank: invalid card \"10s\"\n" },
  { args: ["rank", "As", "Ks", "Qs", "Js", "ts"], files: {}, code: 2, out: "", err: "pokerank: invalid card \"ts\"\n" },
  { args: ["rank", "As", "Ks", "Qs", "Js", "TS"], files: {}, code: 2, out: "", err: "pokerank: invalid card \"TS\"\n" },
  { args: ["rank", "As", "Ks", "Qs", "Js", "Tx"], files: {}, code: 2, out: "", err: "pokerank: invalid card \"Tx\"\n" },
  { args: ["rank", "As", "Ks", "Qs", "Js", "T"], files: {}, code: 2, out: "", err: "pokerank: invalid card \"T\"\n" },
  { args: ["rank", "As", "Ks", "Qs", "Js", "As"], files: {}, code: 2, out: "", err: "pokerank: duplicate card \"As\"\n" },
  { args: ["rank", "As", "Ks", "As", "Js", "1s"], files: {}, code: 2, out: "", err: "pokerank: duplicate card \"As\"\n" },
  { args: ["rank", "-", "Ks", "Qs", "Js", "Ts"], files: {}, code: 2, out: "", err: "pokerank: invalid card \"-\"\n" },
];

for (const [index, row] of rows.entries()) {
  test(`row ${index + 1}`, () => {
    expect(check(row)).toEqual(row);
  });
}
