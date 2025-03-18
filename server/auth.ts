import { type Request, type Response, type NextFunction } from "express";
import session from "express-session";
import MemoryStore from "memorystore";

const SessionStore = MemoryStore(session);

// In a real app, this would be in a database
const ADMIN_PASSWORD = "admin123";

export const sessionMiddleware = session({
  secret: "your-secret-key",
  resave: false,
  saveUninitialized: false,
  store: new SessionStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
});

export function isAdmin(req: Request): boolean {
  return req.session.isAdmin === true;
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!isAdmin(req)) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

export async function login(password: string): Promise<boolean> {
  return password === ADMIN_PASSWORD;
}
