import { expect, test } from "vitest";
import { check } from "./helpers/run.js";

// prettier-ignore
const rows = [
  { args: ["rank", "As", "Ks", "Qs", "Js", "Ts"], files: {}, code: 0, out: "straight flush (A K Q J T)\n", err: "" },
  { args: ["rank", "Ah", "2h", "3h", "4h", "5h"], files: {}, code: 0, out: "straight flush (5 4 3 2 A)\n", err: "" },
  { args: ["rank", "Kd", "Kc", "Kh", "Ks", "2d"], files: {}, code: 0, out: "quads (K K K K 2)\n", err: "" },
  { args: ["rank", "Kd", "Kc", "Kh", "2s", "2d"], files: {}, code: 0, out: "full house (K K K 2 2)\n", err: "" },
  { args: ["rank", "2h", "9h", "Kh", "4h", "7h"], files: {}, code: 0, out: "flush (K 9 7 4 2)\n", err: "" },
  { args: ["rank", "Td", "9c", "8h", "7s", "6d"], files: {}, code: 0, out: "straight (T 9 8 7 6)\n", err: "" },
  { args: ["rank", "Ad", "2c", "3h", "4s", "5d"], files: {}, code: 0, out: "straight (5 4 3 2 A)\n", err: "" },
  { args: ["rank", "7d", "7c", "7h", "Ks", "2d"], files: {}, code: 0, out: "trips (7 7 7 K 2)\n", err: "" },
  { args: ["rank", "7d", "7c", "Kh", "Ks", "2d"], files: {}, code: 0, out: "two pair (K K 7 7 2)\n", err: "" },
  { args: ["rank", "7d", "7c", "Kh", "Js", "2d"], files: {}, code: 0, out: "pair (7 7 K J 2)\n", err: "" },
  { args: ["rank", "Ah", "Kh", "Qh", "2d", "3c", "9h", "4h"], files: {}, code: 0, out: "flush (A K Q 9 4)\n", err: "" },
  { args: ["rank", "Ah", "Kd", "Qc", "Js", "Th", "9d", "8c"], files: {}, code: 0, out: "straight (A K Q J T)\n", err: "" },
  { args: ["rank", "Ah", "2d", "3c", "4s", "5h", "6d", "Kc"], files: {}, code: 0, out: "straight (6 5 4 3 2)\n", err: "" },
  { args: ["rank", "Ah", "2d", "3c", "4s", "5h", "Kd", "Qc"], files: {}, code: 0, out: "straight (5 4 3 2 A)\n", err: "" },
  { args: ["rank", "Ah", "2h", "3h", "4h", "5h", "6h", "7d"], files: {}, code: 0, out: "straight flush (6 5 4 3 2)\n", err: "" },
  { args: ["rank", "Ah", "2h", "3h", "4h", "5h", "Kh", "Qh"], files: {}, code: 0, out: "straight flush (5 4 3 2 A)\n", err: "" },
  { args: ["rank", "Kd", "Kc", "Kh", "Qs", "Qd", "Qc", "2d"], files: {}, code: 0, out: "full house (K K K Q Q)\n", err: "" },
  { args: ["rank", "Kd", "Kc", "Qh", "Qs", "Jd", "Jc", "2h"], files: {}, code: 0, out: "two pair (K K Q Q J)\n", err: "" },
  { args: ["rank", "Kd", "Kc", "Qh", "Qs", "Jd", "Jc", "Th"], files: {}, code: 0, out: "two pair (K K Q Q J)\n", err: "" },
  { args: ["rank", "Ad", "Ac", "Ah", "9s", "9d", "9c", "9h"], files: {}, code: 0, out: "quads (9 9 9 9 A)\n", err: "" },
  { args: ["rank", "2h", "5h", "9h", "Jh", "Kh", "Ah", "3h"], files: {}, code: 0, out: "flush (A K J 9 5)\n", err: "" },
  { args: ["rank", "Td", "Jd", "Qd", "Kd", "9c", "9h", "9s"], files: {}, code: 0, out: "straight (K Q J T 9)\n", err: "" },
];

for (const [index, row] of rows.entries()) {
  test(`row ${index + 1}`, () => {
    expect(check(row)).toEqual(row);
  });
}
