import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Header from "../../components/header";
import { AiOutlineInbox } from "react-icons/ai";
import { useAuth } from "../../context/auth-provider";

const Layout = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  React.useEffect(() => {
    login();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const tabs = [
    {
      name: "My Email",
      icon: <AiOutlineInbox size={24} />,
      subtabs: [
        { name: "Inbox", path: "/" },
        { name: "ReviewBox", path: "/reviews" },
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
    <main className="">
      {/* Header */}
      <Header />
      {/* SideBar */}
      <div className="h-[calc(100vh-52px)] mt-[52px]">
        <div className="flex flex-row">
          {/* Email Drawer View */}
          <nav className="fixed flex flex-col w-1/6">
            <div className="flex flex-col h-[calc(100vh-52px)] bg-white border-r">
              {tabs.map((tab) => (
                <div key={tab.name}>
                  <div className="flex flex-row bg-gray-50 justify-between items-center border-b h-[40px] px-4">
                    <h2 className="font-bold flex items-center">{tab.name}</h2>
                    {tab.icon}
                  </div>
                  <div className="flex flex-col">
                    {tab.subtabs.map((subtab) => (
                      <Link
                        key={subtab.name}
                        to={subtab.path}
                        className="py-2 px-4 border-b hover:bg-gray-100 focus:bg-gray-100"
                      >
                        {subtab.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              {/* <div className="inline-flex flex-row justify-between border-b py-2 px-4">
                <h2 className="font-bold">Email</h2>
                <AiOutlineInbox size={24} />
              </div>
              <Link
                to="/"
                className="py-2 px-4 border-b hover:bg-gray-100 focus:bg-gray-100"
              >
                My Inbox
              </Link> */}
            </div>
          </nav>
          <Outlet />
        </div>
      </div>
    </main>
  );
};

export default Layout;
