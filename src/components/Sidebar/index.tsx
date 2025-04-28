import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  Settings,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Folder,
  FileText,
} from "lucide-react";

interface SidebarProps {
  open: boolean;
  setOpen: (state: boolean) => void;
}

const routes = [
  {
    name: "Dashboard",
    icon: <LayoutDashboard size={22} />,
  },
  {
    name: "Usuários",
    icon: <Users size={22} />,
    children: [
      {
        name: "Arquivos",
        icon: <Folder size={20} />,
      },
      {
        name: "Listar",
        icon: <FileText size={20} />,
      },
    ],
  },
  {
    name: "Boletas",
    icon: <FileText size={22} />,
  },
  {
    name: "Configurações",
    icon: <Settings size={22} />,
  },
];

export default function Sidebar({ open }: SidebarProps) {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const renderRoutes = () =>
    routes.map((route) => (
      <li key={route.name} className="flex flex-col">
        {route.children ? (
          <>
            <button
              onClick={() => toggleDropdown(route.name)}
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-[#590202] hover:text-white transition-all duration-200 focus:outline-none bg-transparent"
            >
              <span>{route.icon}</span>
              {(isOpen || isMobile) && <span>{route.name}</span>}
              {activeDropdown === route.name ? (
                <ChevronUp className="h-5 w-5 ml-auto" />
              ) : (
                <ChevronDown className="h-5 w-5 ml-auto" />
              )}
            </button>
            {activeDropdown === route.name && (
              <ul className="pl-4 mt-2 space-y-2">
                {route.children.map((child) => (
                  <li key={child.name} className="flex items-center">
                    <a
                      href="#"
                      className="flex items-center space-x-2 p-2 rounded-md hover:bg-[#590202] hover:text-white transition-all duration-200 w-full"
                    >
                      <span>{child.icon}</span>
                      {(isOpen || isMobile) && <span>{child.name}</span>}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <a
            href="#"
            className="flex items-center space-x-2 p-2 rounded-md hover:bg-[#590202] hover:text-white transition-all duration-200"
          >
            <span>{route.icon}</span>
            {(isOpen || isMobile) && <span>{route.name}</span>}
          </a>
        )}
      </li>
    ));

  return (
    <>
      {isMobile ? (
        <div
          className={`flex ${
            open ? "block fixed" : "hidden"
          } transition-all duration-300`}
          style={{
            height: "calc(100vh - 64px)",
            zIndex: 1000,
          }}
        >
          <div
            className="p-4 shadow-sm shadow-stone-200 relative transition-all duration-300 overflow-y-auto overflow-x-hidden scrollbarMobile bg-[#590202] text-white"
            style={{ width: "100vw" }}
          >
            <ul className="space-y-4">{renderRoutes()}</ul>
          </div>
        </div>
      ) : (
        <div
          className={`flex ${
            isOpen ? "w-[190px]" : "w-[94px]"
          } transition-all duration-300 relative`}
          style={{ height: "calc(100vh - 64px)" }}
        >
          <div className="pl-4 pt-3 pr-2 pb-4 shadow-sm shadow-stone-200 relative overflow-y-auto overflow-x-hidden custom-scrollbar dark:bg-darkModeBackground">
            <ul className="space-y-4">{renderRoutes()}</ul>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="absolute top-4 right-[-16px] text-white bg-[#590202] rounded p-1 focus:outline-none shadow-lg z-10 transition-all duration-300"
          >
            {isOpen ? (
              <ChevronLeft className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </button>
        </div>
      )}
    </>
  );
}
