import React from "react";
import { twMerge } from "tailwind-merge";
import { Link } from "react-router-dom";
import geminiLogo from "../assets/gemini-logo.png";
import { useAuth } from "../context/auth-provider";
import Dropdown from "./dropdown";
import { setUILanguage } from "../utils/i18n";
import { BsFillLightbulbFill } from "react-icons/bs";

function Header({ className = "" }: { className?: string }) {
  const defaultLang = localStorage.getItem("lang") ?? "ja";
  const { user, logOut } = useAuth();

  const onToggleLanguageClick = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUILanguage(e.target.value);
  };

  const onToggleLightDarkMode = () => {
    const html = document.querySelector("html");
    if (html) {
      html.classList.toggle("dark");
      localStorage.setItem(
        "dark",
        html.classList.contains("dark") ? "dark" : ""
      );
    }
  };

  const dropdownItems = [
    {
      label: "Logout",
      value: "logout",
      className: "text-red-600 font-semibold hover:bg-red-100 p-2 rounded",
      onClick: () => {
        logOut();
      },
    },
  ];

  return (
    <div
      className={twMerge(
        "fixed top-0 flex z-[50] w-full transition-all duration-1000 border-b",
        className
      )}
    >
      <div
        className={twMerge(
          "relative text-lg flex flex-row gap-4 items-center justify-center sm:justify-between w-full bg-white text-black dark:text-white dark:bg-neutral-800 h-[52px] px-8"
        )}
      >
        {/* Company Logo */}
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
        <div className="relative flex flex-row gap-6">
          <select
            className="p-2 rounded-lg border bg-white dark:bg-neutral-800 cursor-pointer"
            name="language select"
            onChange={onToggleLanguageClick}
            defaultValue={defaultLang}
          >
            <option value="ja">日本語</option>
            <option value="en">English</option>
          </select>
          <button
            onClick={onToggleLightDarkMode}
            className="bg-white dark:bg-neutral-800 p-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-black/60"
          >
            <BsFillLightbulbFill size={24} />
          </button>
          {user ? (
            <Dropdown items={dropdownItems}>
              <img
                src={user.avatar ?? "/images/profile.png"}
                alt="avatar"
                width={48}
                height={48}
                className="h-10 w-10 rounded-full border"
              />
            </Dropdown>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Header;
