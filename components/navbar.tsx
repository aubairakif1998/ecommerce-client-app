import Link from "next/link";
import { getServerSession } from "next-auth";
import MainNav from "@/components/main-nav";
import Container from "@/components/ui/container";
import NavbarActions from "@/components/navbar-actions";
import getCategories from "@/actions/get-categories";
import { authOptions } from "@/lib/auth"; // Adjust the path as needed

const Navbar = async () => {
  const categories = await getCategories();
  const session = await getServerSession(authOptions); // Fetch the session

  return (
    <div className="border-b">
      <Container>
        <div className="relative px-4 sm:px-6 lg:px-8 flex h-16 items-center">
          <Link href="/" className="ml-4 flex lg:ml-0 gap-x-2">
            <p className="font-bold text-xl">STORE</p>
          </Link>
          <MainNav data={categories} />
          <NavbarActions isSignedIn={!!session} user={session?.user} />
        </div>
      </Container>
    </div>
  );
};

export default Navbar;
