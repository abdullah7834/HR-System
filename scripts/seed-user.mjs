#!/usr/bin/env node
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Load .env.local manually
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, "../.env.local");

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  envContent.split("\n").forEach((line) => {
    const [key, value] = line.split("=");
    if (key && value) {
      process.env[key.trim()] = value.trim();
    }
  });
}

const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment"
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function seed() {
  const email = process.env.SEED_EMAIL || "admin@example.com";
  const password = process.env.SEED_PASSWORD || "Password123!";

  console.log(`Seeding user ${email}`);

  try {
    // Use the Admin API to create a user. If the user already exists return info.
    if (!supabase.auth?.admin || !supabase.auth.admin.createUser) {
      console.error(
        "Admin auth API not available on this client. Ensure you are using @supabase/supabase-js v2+"
      );
      process.exit(1);
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) {
      // If user exists, try to fetch it
      console.error("Create user error:", error.message || error);
      process.exit(1);
    }

    console.log("User created:", data);
  } catch (err) {
    console.error("Unexpected error while seeding user:", err);
    process.exit(1);
  }
}

seed();
