import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

async function loadEnv() {
  const dotenvPaths = [".env.local", ".env"];
  for (const file of dotenvPaths) {
    const abs = path.resolve(process.cwd(), file);
    try {
      const content = await fs.readFile(abs, "utf8");
      content
        .split(/\r?\n/)
        .filter(Boolean)
        .forEach((line) => {
          const idx = line.indexOf("=");
          if (idx === -1) return;
          const key = line.slice(0, idx);
          const value = line.slice(idx + 1);
          if (!(key in process.env)) {
            process.env[key] = value;
          }
        });
    } catch (error) {
      if (error.code !== "ENOENT") {
        console.warn(`Could not read ${file}:`, error.message);
      }
    }
  }
}

async function main() {
  await loadEnv();

  const accessToken = process.env.SUPABASE_ACCESS_TOKEN;
  const projectRef =
    process.env.SUPABASE_PROJECT_REF || process.env.VITE_SUPABASE_URL?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];

  if (!accessToken) {
    console.error("SUPABASE_ACCESS_TOKEN is required");
    process.exit(1);
  }
  if (!projectRef) {
    console.error("Could not determine SUPABASE project reference. Set SUPABASE_PROJECT_REF explicitly.");
    process.exit(1);
  }

  const sqlPath = path.resolve(process.cwd(), "supabase/bootstrap.sql");
  const sql = await fs.readFile(sqlPath, "utf8");

  const response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: sql }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Failed to apply SQL:", response.status, text);
    process.exit(1);
  }

  console.log("Supabase schema bootstrap succeeded.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
