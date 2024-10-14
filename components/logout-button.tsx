"use client"
import { useSession } from "next-auth/react";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { signOut } from 'next-auth/react';
import { User } from "next-auth";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export function LogoutButton() {
    const router = useRouter()
    const handleSignOut = () => {
        signOut();
        router.refresh()
    };

    return (
        <DropdownMenuItem>
            <Button onClick={handleSignOut} className="w-full md:w-auto bg-slate-100 text-black" variant='outline'>
                Logout
            </Button>
        </DropdownMenuItem>
    );
}
