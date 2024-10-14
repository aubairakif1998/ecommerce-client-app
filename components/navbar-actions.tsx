"use client";

import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import useCart from "@/hooks/use-cart";
import { Button } from "./ui/button";
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
// import UserWidget from './user';  
import Image from 'next/image';
import { User } from "next-auth";
import { LogoutButton } from "./logout-button";
interface NavbarActionsProps {
  isSignedIn: boolean; // Add a prop to indicate signed-in state
  user: User | null
}

const NavbarActions = ({ isSignedIn, user }: NavbarActionsProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const cart = useCart();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="ml-auto flex items-center gap-x-4">
      {isSignedIn ? ( // Use the prop here
        <>
          <Button
            onClick={() => router.push('/my-orders')}
            className="rounded-xl bg-white px-4 py-2 text-black"
          >
            My Orders
          </Button>
          <Button
            onClick={() => router.push('/cart')}
            className="flex items-center rounded-full bg-black px-4 py-2"
          >
            <ShoppingBag size={20} color="white" />
            <span className="ml-2 text-sm font-medium text-white">
              {cart.items.length}
            </span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
              >
                <Image
                  src={'/placeholder-user.jpg'}
                  width={36}
                  height={36}
                  alt="Avatar"
                  className="overflow-hidden rounded-full"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user?.email || "Guest"}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuSeparator />
              {user ? (
                <LogoutButton />
              ) : <div></div>
              }
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        !(pathname === '/sign-in' || pathname === '/sign-up') && (
          <Button
            onClick={() => router.push('/sign-in')}
            className="rounded-full bg-blue-600 px-4 py-2 text-white"
          >
            Sign In
          </Button>
        )
      )}
    </div>
  );
};

export default NavbarActions;
