import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function RootLayout() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const user = {
    name: "John Doe",
    role: "Software Engineer",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  };

  return (
    <div
      style={{
        overflow: "hidden",
        height: "100vh",
      }}
    >
      <div className="flex flex-col min-h-screen">
        <Navbar user={user} open={isOpen} setOpen={setIsOpen} />
        <div className="flex flex-1">
          <Sidebar open={isOpen} setOpen={setIsOpen} />
          <div
            className="overflow-y-auto px-7 py-4 scroll-smooth w-full bg-gray-100"
            style={{ height: "calc(100vh - 64px)" }}
          >
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
