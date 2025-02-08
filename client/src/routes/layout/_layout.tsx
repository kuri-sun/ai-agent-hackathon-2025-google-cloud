import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Header from "../../components/header";
import { AiOutlineInbox } from "react-icons/ai";
import { useAuth } from "../../context/auth-provider";
import { BiMessageDots } from "react-icons/bi";

const Layout = () => {
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
      name: "My Email",
      subtabs: [
        { name: "Inbox", path: "/", icon: <AiOutlineInbox size={24} /> },
        {
          name: "ReviewBox",
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

  if (loading) {
    return <div>Loading...</div>;
  }

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
                  <div className="flex flex-row bg-gray-50 gap-2 items-center border-b h-[40px] px-4">
                    <h2 className="font-bold flex items-center">{tab.name}</h2>
                  </div>
                  <div className="flex flex-col">
                    {tab.subtabs.map((subtab) => (
                      <Link
                        key={subtab.name}
                        to={subtab.path}
                        className="flex flex-row justify-between gap-3 py-2 px-4 border-b hover:bg-gray-100 focus:bg-gray-100"
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
          <Outlet />
        </div>
      </div>
    </main>
  );
};

export default Layout;
