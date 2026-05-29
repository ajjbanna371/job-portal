import { headers } from "next/headers";

const IP_HEADER_PRIORITY = [
  "x-forwarded-for",
  "x-real-ip",
  "cf-connecting-ip",
  "true-client-ip",
  "x-client-ip",
  "x-forwarded",
  "forwarded-for",
  "forwarded",
];

export async function getIPAddress() {
  const headersList = await headers();

  for (const header of IP_HEADER_PRIORITY) {
    const value = headersList.get(header);

    if (typeof value === "string" && value.length > 0) {
      const ip = value.split(",")[0].trim();
      if (ip) return ip;
    }
  }

  return "0.0.0.0";
}