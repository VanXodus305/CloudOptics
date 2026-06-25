import fs from "fs";
import path from "path";

console.log("Watching directory for changes for 30 seconds...");
const events = [];

const watcher = fs.watch(".", { recursive: true }, (eventType, filename) => {
  if (filename && !filename.includes(".next") && !filename.includes("node_modules") && !filename.includes(".git")) {
    const logStr = `[${new Date().toLocaleTimeString()}] ${eventType}: ${filename}`;
    console.log(logStr);
    events.push(logStr);
  }
});

setTimeout(() => {
  watcher.close();
  console.log("\nFinished watching. Total events:", events.length);
  if (events.length === 0) {
    console.log("No file changes detected outside of ignored directories.");
  }
  process.exit(0);
}, 30000);
