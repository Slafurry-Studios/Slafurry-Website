import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const findUnique = vi.fn();
const upsert = vi.fn();
const count = vi.fn();
vi.mock("@/lib/prisma", () => ({
  prisma: { adminUser: { findUnique, upsert, count } },
}));

const { adminEmailAllowlist, resolveAdminUser } = await import("@/lib/auth/admin-users");

describe("adminEmailAllowlist", () => {
  it("parses, trims and lower-cases", () => {
    expect([...adminEmailAllowlist(" A@x.com, b@Y.com ,,")]).toEqual(["a@x.com", "b@y.com"]);
    expect(adminEmailAllowlist(undefined).size).toBe(0);
  });
});

describe("resolveAdminUser", () => {
  const original = process.env.ADMIN_EMAILS;
  beforeEach(() => {
    findUnique.mockReset();
    upsert.mockReset();
    count.mockReset();
    process.env.ADMIN_EMAILS = "boss@slafurrystudios.com";
  });
  afterEach(() => {
    process.env.ADMIN_EMAILS = original;
  });

  it("accepts an existing AdminUser row regardless of email", async () => {
    findUnique.mockResolvedValue({ id: "a1", name: "Zaini" });
    await expect(resolveAdminUser({ id: "u1", email: "anyone@else.com" })).resolves.toEqual({ id: "a1", name: "Zaini" });
    expect(upsert).not.toHaveBeenCalled();
  });

  it("provisions an allowlisted email (case-insensitive)", async () => {
    findUnique.mockResolvedValue(null);
    upsert.mockResolvedValue({ id: "a2", name: "boss@slafurrystudios.com" });
    await expect(resolveAdminUser({ id: "u2", email: "Boss@SlafurryStudios.com" })).resolves.toEqual({
      id: "a2",
      name: "boss@slafurrystudios.com",
    });
  });

  it("rejects non-allowlisted users even when the AdminUser table is empty", async () => {
    findUnique.mockResolvedValue(null);
    count.mockResolvedValue(0);
    await expect(resolveAdminUser({ id: "u3", email: "random@gmail.com" })).resolves.toBeNull();
    await expect(resolveAdminUser({ id: "u4", email: null })).resolves.toBeNull();
    expect(upsert).not.toHaveBeenCalled();
  });
});
