import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useIsAdmin } from "@/lib/auth";

export function Navbar() {
  const isAdmin = useIsAdmin();

  return (
    <nav className="border-b">
      <div className="container flex items-center justify-between h-14">
        <Link href="/">
          <Button variant="link" className="text-lg font-semibold">
            Teacher Reviews
          </Button>
        </Link>
        <Link href={isAdmin ? "/admin" : "/login"}>
          <Button variant="ghost" size="sm">
            {isAdmin ? "Admin Panel" : "Admin Login"}
          </Button>
        </Link>
      </div>
    </nav>
  );
}
