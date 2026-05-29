
import { cookies, headers } from "next/headers";
import { getIPAddress } from "./location";
import db from "@/config/db";
import { SESSIONS_LIFETIME } from "@/config/constant";
import { eq } from "drizzle-orm";
import { users, sessionsTable } from "@/drizzle/schema";

type CreateSessionData = {
  token: string;
  userId: number;
  ip: string;
  userAgent: string;
  tx?:  DbClient;
};

const generateSessionToken = () => {
  // return crypto.randomBytes(32).toString("hex").normalize();

  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
};

// generate a 256-bit cryptographically secure random token
// <Buffer 4f 8a 9b 12 ...> (raw binary, not readable)
// Converts that binary data into a hexadecimal string.("4f8a9b12d1e...")
// This ensures the string is in a consistent Unicode normalization from (usually NFC).

const createUserSession = async ({
  token,
  userId,
  ip,
  userAgent,
  tx = db,
}: CreateSessionData) => {

  // const hashedToken = crypto.createHash('sha256').update(token).digest("hex");

  const hashedToken = async (token: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(token);

    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  };

  const [session] = await tx.insert(sessionsTable).values({
    id: await hashedToken(token),
    userId,
    expiresAt: new Date(Date.now() + SESSIONS_LIFETIME * 1000),
    ip,
    userAgent,
    createdAt: new Date(),
  });
  return session;
};


//  Give me the type of the first parameter of the callback inside db.transaction - that's the tx object
type DbClient = typeof db | Parameters<Parameters<typeof db.transaction>[0]>[0];

export const createSessionAndSetCookies = async (userId: number, tx: DbClient = db) => {
  const token = generateSessionToken();
  const ip = await getIPAddress();
  const headersList = await headers();

  await createUserSession({
    token,
    userId: userId,
    ip: ip,
    userAgent: headersList.get("user-agent") || "",
    tx,
  });

  const cookiesStore = await cookies();

  cookiesStore.set("session", token, {
    secure: true,
    httpOnly: true,
    maxAge: SESSIONS_LIFETIME,
  });
};

// ------------------- ** ------------------- ** ------------- //

export const validateSessionAndGetUser = async (session: string) => {
  const hashToken = async (session: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(session);

    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  };

  const tokenHash = await hashToken(session);

  const [user] = await db
    .select({
      id: users.id,
      session: {
        id: sessionsTable.id,
        expiresAt: sessionsTable.expiresAt,
        userAgent: sessionsTable.userAgent,
        ip: sessionsTable.ip,
      },
      name: users.name,
      username: users.username,
      email: users.email,
      // emailVerifieldAt: users.emailVerifieldAt,
      role: users.role,
      phone: users.phone,
      avatarUrl: users.avatarUrl,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(sessionsTable)
    .innerJoin(users, eq(sessionsTable.userId, users.id))
    .where(eq(sessionsTable.id, tokenHash));

  // handle user and session if it's there or not
  if (!user) {
    return null;
  }

  if (Date.now() >= user.session.expiresAt.getTime()) {
    await invalidateSession(user.session.id);
    return null;
  }

    if ( Date.now() >= user.session.expiresAt.getTime() - SESSIONS_LIFETIME * 1000 ) {
    await db.update(sessionsTable).set({
      expiresAt: new Date(Date.now() + SESSIONS_LIFETIME * 1000),
    }).where(eq(sessionsTable.id, user.session.id));    
  }
   return { user };
   
};

//  -- invalidateSession  function --
export const invalidateSession = async (id: string) => {
  await db.delete(sessionsTable).where(eq(sessionsTable.id, id));
};


