
const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const { spawn } = require("node:child_process");

test("application returns a successful JSON response", async (t) => {
  const port = 3100 + Math.floor(Math.random() * 1000);

  const serverProcess = spawn(process.execPath, ["app.js"], {
    cwd: process.cwd(),
    env: { ...process.env, PORT: String(port) },
    stdio: "ignore"
  });

  t.after(() => {
    serverProcess.kill();
  });

  let response;

  for (let attempt = 0; attempt < 30; attempt++) {
    try {
      response = await new Promise((resolve, reject) => {
        const request = http.get(
          `http://127.0.0.1:${port}`,
          resolve
        );

        request.on("error", reject);
        request.setTimeout(500, () => {
          request.destroy(new Error("Request timed out"));
        });
      });

      break;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  assert.ok(response, "Application did not start in time");
  assert.equal(response.statusCode, 200);
  assert.match(
    response.headers["content-type"],
    /application\/json/
  );

  const body = await new Promise((resolve, reject) => {
    let data = "";

    response.setEncoding("utf8");
    response.on("data", (chunk) => {
      data += chunk;
    });
    response.on("end", () => resolve(data));
    response.on("error", reject);
  });

  assert.deepEqual(JSON.parse(body), {
    message: "Task 1 CI/CD Demo is running!",
    status: "success"
  });
});
