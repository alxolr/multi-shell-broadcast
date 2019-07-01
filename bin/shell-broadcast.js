#!/usr/bin/env node

const { spawn } = require("child_process");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const shells = [
  {
    name: "ent",
    path: "/home/alxolr/Work/tutorials/elasticmq-node-tutorial"
  },
  {
    name: "mt",
    path: "/home/alxolr/Work/tutorials/mocha-tutorial"
  },
  {
    name: "nlm",
    path: "/home/alxolr/Work/tutorials/node-leak-memory"
  },
  {
    name: "bir",
    path: "/home/alxolr/Work/tutorials/multi-shell-broadcast"
  }
];

function ask() {
  rl.question("shell_broadcast> ", answer => {
    if (answer.toLowerCase() === "exit") {
      process.exit(1);
    }

    const [command, ...args] = answer.trim().split(" ");
    let finished = shells.length;

    for (let shell of shells) {
      const ls = spawn(command, args, {
        cwd: shell.path
      });
      ls.stdout.on("data", data => {
        console.log("[%s]> %s\n%s", shell.name, answer, data);
      });

      ls.stderr.pipe(process.stdout);

      ls.stdout.on("end", handleFinish);

      function handleFinish() {
        finished--;
        if (finished <= 0) {
          ask();
        }
      }
    }
  });
}

ask();
