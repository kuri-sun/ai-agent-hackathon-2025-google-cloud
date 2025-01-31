import React from "react";
import { twMerge } from "tailwind-merge";
import { Link } from "react-router-dom";
import geminiLogo from "../assets/gemini-logo.png";

function Header({ className = "" }: { className?: string }) {
  return (
    <div
      className={twMerge(
        "fixed top-0 flex z-[50] w-full transition-all duration-1000 border-b",
        className
      )}
    >
      <div
        className={twMerge(
          "relative text-lg flex flex-row gap-4 items-center justify-center sm:justify-between w-full rounded-lg bg-white text-black dark:text-white dark:bg-neutral-800 py-3 px-4"
        )}
      >
        <div
          className={twMerge(
            "hidden sm:flex flex-row items-center gap-4 transition-all duration-1000 "
          )}
        >
          <Link
            to="/"
            className="text-xl font-semibold text-black inline-flex flex-row dark:text-neutral-100 opacity-100 gap-4"
          >
            <span>Co-Email</span>
            <div className="flex flex-row gap-1 items-baseline">
              <span className="font-light text-sm">powered with</span>
              <img src={geminiLogo} alt="gemini-logo" className="h-[20px]" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Header;
