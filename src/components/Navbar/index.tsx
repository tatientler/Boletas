import { useState, useEffect } from "react";
import { Menu, X, Bell } from "lucide-react";
import Logo from "../../assets/logo.png";

interface NavbarProps {
  user: {
    name: string;
    role: string;
    avatar: string;
  };
  open: boolean;
  setOpen: (state: boolean) => void;
}

export default function Navbar({ user, open, setOpen }: NavbarProps) {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className="shadow shadow-stone-200 bg-white dark:bg-gray-900">
      <div className="mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {width < 768 && (
            <div className="absolute inset-y-0 left-0 flex items-center">
              <button
                onClick={() => setOpen(!open)}
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-white focus:outline-none"
              >
                {open ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          )}

          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center ml-0">
              <img className="h-8 w-auto" src={Logo} alt="Logo" />
            </div>
          </div>

          <div className="absolute inset-y-0 right-0 flex items-center gap-4 pr-2">
            <button className="rounded-full p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white focus:outline-none cursor-pointer">
              <Bell className="h-6 w-6" />
            </button>
            <div className="relative group">
              <div className="border-2 border-[#590202] rounded-full">
                <img
                  className="h-10 w-10 rounded-full cursor-pointer"
                  src={user.avatar}
                  alt="Imagem do usuário"
                />
              </div>
              <div className="absolute right-0 mt-2 hidden w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 group-hover:block">
                <div className="py-1">
                  <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.role}</div>
                  </div>
                  <a
                    href="#profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    Meu Perfil
                  </a>
                  <a
                    href="#settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    Configurações
                  </a>
                  <button
                    onClick={() => {}}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    Sair
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
