import {execFileSync} from "node:child_process";execFileSync("npx",["ncc","build","src/action/main.ts","-o","dist/action","--license","licenses.txt"],{stdio:"inherit"});
