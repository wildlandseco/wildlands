// scripts/build.mjs
import { spawnSync } from "node:child_process";

function run(cmd, args) {
  const res = spawnSync(cmd, args, { stdio: "inherit", shell: true });
  return res.status ?? 0;
}

// 1) Run Contentlayer (ignore its exit code/noisy error on Windows)
const clStatus = run("npx", ["contentlayer", "build"]);
if (clStatus !== 0) {
  console.log("\n[build] Contentlayer exited non-zero. Ignoring and continuing to Next build…\n");
}

// 2) Run Next build (fail the whole script only if this fails)
const nextStatus = run("npx", ["next", "build"]);
process.exit(nextStatus);
