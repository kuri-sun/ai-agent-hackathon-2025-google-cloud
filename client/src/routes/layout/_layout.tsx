import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Header from "../../components/header";
import { AiOutlineInbox } from "react-icons/ai";
import { useAuth } from "../../context/auth-provider";
import { BiMessageDots } from "react-icons/bi";
import { useTranslation } from "react-i18next";
import { BeatLoader } from "../../components/beat-loader";

const Layout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadAuth = async () => {
      await login();
      setLoading(false);
    };
    loadAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const tabs = [
    {
      name: t("My Email"),
      subtabs: [
        { name: t("Inbox"), path: "/", icon: <AiOutlineInbox size={24} /> },
        {
          name: t("ReviewBox"),
          path: "/reviews",
          icon: <BiMessageDots size={24} />,
        },
      ],
    },
    // {
    //   name: "Team",
    //   icon: <AiOutlineTeam size={24} />,
    //   subtabs: [
    //     { name: "ReviewBox", path: "/reviews" }
    //   ],
    // },
  ];

  return (
    <main className="text-gray-600 dark:text-neutral-100">
      {/* Header */}
      <Header />
      <div className="h-[calc(100vh-52px)] mt-[52px]">
        <div className="flex flex-row dark:bg-black/80 ">
          {/* SideBar */}
          <nav className="fixed flex flex-col w-1/6">
            <div className="flex flex-col h-[calc(100vh-52px)] border-r">
              {tabs.map((tab) => (
                <div key={tab.name}>
                  <div className="flex flex-row gap-2 items-center border-b h-[40px] px-4">
                    <h2 className="font-bold flex items-center">{tab.name}</h2>
                  </div>
                  <div className="flex flex-col">
                    {tab.subtabs.map((subtab) => (
                      <Link
                        key={subtab.name}
                        to={subtab.path}
                        className="flex flex-row justify-between gap-3 py-2 px-4 border-b hover:bg-gray-100 dark:hover:bg-black/60 focus:bg-gray-100 dark:focus:bg-gray-700"
                      >
                        {subtab.name}
                        {subtab.icon}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </nav>

          {loading ? <BeatLoader text={t("Processing...")} /> : <Outlet />}
        </div>
      </div>
    </main>
  );
};

export default Layout;
