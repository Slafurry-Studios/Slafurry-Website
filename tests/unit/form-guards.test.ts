import { describe, it, expect } from "vitest";
import { checkHoneypot } from "@/lib/actions/form-guards";

describe("checkHoneypot", () => {
  it("returns not-bot when honeypot field is empty", async () => {
    const formData = new FormData();
    const result = await checkHoneypot(formData, "company");
    expect(result.isBot).toBe(false);
    expect(result.reason).toBe("");
  });

  it("returns bot when honeypot field is filled", async () => {
    const formData = new FormData();
    formData.append("company", "viagra-store");
    const result = await checkHoneypot(formData, "company");
    expect(result.isBot).toBe(true);
    expect(result.reason).toBe("Honeypot field filled.");
  });

  it("uses a custom honeypot field name", async () => {
    const formData = new FormData();
    formData.append("website", "http://spam.example");
    const result = await checkHoneypot(formData, "website");
    expect(result.isBot).toBe(true);
  });
});
