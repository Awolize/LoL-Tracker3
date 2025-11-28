#!/usr/bin/env node

// Cross-platform dev script to set NODE_OPTIONS for server instrumentation
import { spawn } from "child_process";

// Set NODE_OPTIONS for server instrumentation
process.env.NODE_OPTIONS = "--import ./instrument.server.mjs";

// Run vite dev with the same arguments
const args = ["vite", "dev", "--port", "3001"];

const child = spawn("npx", args, {
	stdio: "inherit",
	shell: true, // This allows cross-platform execution
});

child.on("exit", (code) => {
	process.exit(code);
});
