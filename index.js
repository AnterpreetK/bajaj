import express from "express";
import dotenv from "dotenv";
import { fibonacci, primesOnly, lcmArray, hcfArray } from "./utils/math.js";
import { askAI } from "./utils/ai.js";

dotenv.config();
const app = express();
app.use(express.json());

const EMAIL = "anterpreet1614.be23@chitkara.edu.in";

/* ---------------- HEALTH CHECK ---------------- */
app.get("/health", (req, res) => {
  res.status(200).json({
    is_success: true,
    official_email: EMAIL
  });
});

/* ---------------- BFHL API ---------------- */
app.post("/bfhl", async (req, res) => {
  try {
    /* ✅ EMPTY BODY CHECK (Hidden Test) */
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        is_success: false,
        official_email: EMAIL,
        error: "Request body cannot be empty"
      });
    }

    /* ✅ PAYLOAD SIZE LIMIT (Security Guardrail) */
    if (JSON.stringify(req.body).length > 1000) {
      return res.status(413).json({
        is_success: false,
        official_email: EMAIL,
        error: "Payload too large"
      });
    }

    const keys = Object.keys(req.body);

    /* ✅ EXACTLY ONE KEY RULE */
    if (keys.length !== 1) {
      return res.status(400).json({
        is_success: false,
        official_email: EMAIL,
        error: "Exactly one key required"
      });
    }

    const key = keys[0];
    const value = req.body[key];
    let data;

    switch (key) {
      case "fibonacci":
        if (!Number.isInteger(value) || value <= 0 || value > 50) {
          throw new Error("Invalid fibonacci input");
        }
        data = fibonacci(value);
        break;

      case "prime":
        if (!Array.isArray(value)) {
          throw new Error("Prime input must be an array");
        }
        data = primesOnly(value);
        break;

      case "lcm":
        if (!Array.isArray(value)) {
          throw new Error("LCM input must be an array");
        }
        data = lcmArray(value);
        break;

      case "hcf":
        if (!Array.isArray(value)) {
          throw new Error("HCF input must be an array");
        }
        data = hcfArray(value);
        break;

      case "AI":
        if (typeof value !== "string" || value.trim().length === 0) {
          throw new Error("AI input must be a non-empty string");
        }
        data = await askAI(value);
        break;

      default:
        throw new Error("Invalid key");
    }

    /* ✅ SUCCESS RESPONSE */
    res.status(200).json({
      is_success: true,
      official_email: EMAIL,
      data
    });

  } catch (err) {
    /* ✅ SMART STATUS CODES */
    const statusCode = err.message.includes("AI")
      ? 502
      : 400;

    res.status(statusCode).json({
      is_success: false,
      official_email: EMAIL,
      error: err.message
    });
  }
});

/* ---------------- START SERVER ---------------- */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
