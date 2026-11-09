import { expect, test } from "vitest";
import { check } from "./helpers/run.js";

// prettier-ignore
const rows = [
  { args: ["pots", "h.txt"], files: {"h.txt": "seat ann 100 As Ks\nseat bob 100 Qd Qc\n"}, code: 0, out: "pot 1: 200 (ann bob)\ntotal: 200\n", err: "" },
  { args: ["pots", "h.txt"], files: {"h.txt": "seat ann 100 As Ks\nseat bob 60 Qd Qc\n"}, code: 0, out: "pot 1: 120 (ann bob)\npot 2: 40 (ann)\ntotal: 160\n", err: "" },
  { args: ["pots", "h.txt"], files: {"h.txt": "seat ann 100 As Ks\nseat bob 60 Qd Qc\nseat cy 30 8h 8d\n"}, code: 0, out: "pot 1: 90 (ann bob cy)\npot 2: 60 (ann bob)\npot 3: 40 (ann)\ntotal: 190\n", err: "" },
  { args: ["pots", "h.txt"], files: {"h.txt": "seat ann 100 As Ks\nseat bob 60 Qd Qc\nseat cy 30 8h 8d\nfold dee 45\n"}, code: 0, out: "pot 1: 120 (ann bob cy)\npot 2: 75 (ann bob)\npot 3: 40 (ann)\ntotal: 235\n", err: "" },
  { args: ["pots", "h.txt"], files: {"h.txt": "seat ann 100 As Ks\nseat bob 60 Qd Qc\nfold cy 130\n"}, code: 0, out: "pot 1: 180 (ann bob)\npot 2: 110 (ann)\ntotal: 290\n", err: "" },
  { args: ["pots", "h.txt"], files: {"h.txt": "seat ann 30 As Ks\nseat bob 30 Qd Qc\nseat cy 30 8h 8d\n"}, code: 0, out: "pot 1: 90 (ann bob cy)\ntotal: 90\n", err: "" },
  { args: ["pots", "h.txt"], files: {"h.txt": "seat ann 30 As Ks\nseat bob 60 Qd Qc\nseat cy 90 8h 8d\nseat dee 120 7h 7d\n"}, code: 0, out: "pot 1: 120 (ann bob cy dee)\npot 2: 90 (bob cy dee)\npot 3: 60 (cy dee)\npot 4: 30 (dee)\ntotal: 300\n", err: "" },
  { args: ["pots", "h.txt"], files: {"h.txt": "seat ann 10 As Ks\nseat bob 20 Qd Qc\nfold cy 15\nseat dee 20 7h 7d\n"}, code: 0, out: "pot 1: 40 (ann bob dee)\npot 2: 25 (bob dee)\ntotal: 65\n", err: "" },
  { args: ["pots", "h.txt"], files: {"h.txt": "seat ann 1000000000 As Ks\nseat bob 1000000000 Qd Qc\nseat cy 1000000000 8h 8d\n"}, code: 0, out: "pot 1: 3000000000 (ann bob cy)\ntotal: 3000000000\n", err: "" },
  { args: ["pots", "h.txt"], files: {"h.txt": "seat ann 1 As Ks\nseat bob 2 Qd Qc\nseat cy 3 8h 8d\nseat dee 4 7h 7d\nseat eli 5 6h 6d\nseat fay 6 5h 5d\nseat gus 7 4h 4d\nseat hal 8 3h 3d\nseat ivy 9 2h 2d\nseat jo 10 Jh Jd\n"}, code: 0, out: "pot 1: 10 (ann bob cy dee eli fay gus hal ivy jo)\npot 2: 9 (bob cy dee eli fay gus hal ivy jo)\npot 3: 8 (cy dee eli fay gus hal ivy jo)\npot 4: 7 (dee eli fay gus hal ivy jo)\npot 5: 6 (eli fay gus hal ivy jo)\npot 6: 5 (fay gus hal ivy jo)\npot 7: 4 (gus hal ivy jo)\npot 8: 3 (hal ivy jo)\npot 9: 2 (ivy jo)\npot 10: 1 (jo)\ntotal: 55\n", err: "" },
  { args: ["pots", "h.txt"], files: {"h.txt": "fold bob 3\nseat ann 10 As Ks\n"}, code: 0, out: "pot 1: 13 (ann)\ntotal: 13\n", err: "" },
  { args: ["pots", "-"], files: {"-": "seat ann 5 As Ks\nseat bob 9 Qd Qc\n"}, code: 0, out: "pot 1: 10 (ann bob)\npot 2: 4 (bob)\ntotal: 14\n", err: "" },
];

for (const [index, row] of rows.entries()) {
  test(`row ${index + 1}`, () => {
    expect(check(row)).toEqual(row);
  });
}
