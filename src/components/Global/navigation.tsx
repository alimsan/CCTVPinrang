"use client";
import React, { useState, useEffect } from "react";
import {
  FaHome,
  FaUser,
  FaEnvelope,
  FaCog,
  FaInfoCircle,
  FaChevronLeft,
} from "react-icons/fa";
import Link from "next/link";

interface SubMenuItem {
  label: string;
  href: string;
}

interface NavItem {
  icon: React.ReactElement;
  label: string;
  href: string;
  subItems?: SubMenuItem[];
}

const navItems: NavItem[] = [
  { icon: <FaHome />, label: "Home", href: "/" },
  {
    icon: <FaUser />,
    label: "Profile",
    href: "/profile",
    subItems: [
      { label: "Sejarah Singkat", href: "/profile/sejarah" },
      { label: "Visi dan Misi", href: "/profile/visi-misi" },
      { label: "Motto", href: "/profile/motto" },
    ],
  },
  { icon: <FaEnvelope />, label: "Messages", href: "/messages" },
  { icon: <FaCog />, label: "Settings", href: "/settings" },
  { icon: <FaInfoCircle />, label: "About", href: "/about" },
];

const Navigation: React.FC = () => {
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isDesktop = windowWidth >= 1024;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;
  const isMobile = windowWidth < 768;

  const toggleSubmenu = (label: string) => {
    setOpenSubmenu(openSubmenu === label ? null : label);
  };

  const renderNavItems = (items: NavItem[]) => {
    return items.map((item) => (
      <div key={item.label} className="relative group">
        {item.subItems ? (
          <button
            onClick={() => toggleSubmenu(item.label)}
            className={`flex items-center justify-center p-2 rounded-lg transition-all duration-300 hover:bg-gray-200 ${
              isDesktop ? "flex-row space-x-2" : "flex-col"
            }`}
          >
            <div className="text-2xl group-hover:scale-110 transition-transform duration-300">
              {item.icon}
            </div>
            {(isDesktop || isTablet) && (
              <span className="text-sm flex items-center">
                {item.label}
                <FaChevronLeft className="ml-1" />
              </span>
            )}
          </button>
        ) : (
          <Link
            href={item.href}
            className={`flex items-center justify-center p-2 rounded-lg transition-all duration-300 hover:bg-gray-200 ${
              isDesktop ? "flex-row space-x-2" : "flex-col"
            }`}
          >
            <div className="text-2xl group-hover:scale-110 transition-transform duration-300">
              {item.icon}
            </div>
            {(isDesktop || isTablet) && (
              <span className="text-sm">{item.label}</span>
            )}
          </Link>
        )}
        {item.subItems && openSubmenu === item.label && (
          <div
            className={`
            ${isDesktop ? "absolute left-0 mt-2 w-48" : ""}
            ${isTablet ? "absolute right-full top-0 mr-2 w-48" : ""}
            ${
              isMobile
                ? "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
                : ""
            }
            rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50
          `}
          >
            {isMobile && (
              <div className="bg-white p-4 rounded-lg w-4/5 max-w-sm">
                <h3 className="text-lg font-bold mb-2">{item.label}</h3>
                <button
                  onClick={() => setOpenSubmenu(null)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
                {item.subItems.map((subItem) => (
                  <Link
                    key={subItem.label}
                    href={subItem.href}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  >
                    {subItem.label}
                  </Link>
                ))}
              </div>
            )}
            {!isMobile && (
              <div
                className="py-1"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                {item.subItems.map((subItem) => (
                  <Link
                    key={subItem.label}
                    href={subItem.href}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    role="menuitem"
                  >
                    {subItem.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    ));
  };

  if (isDesktop) {
    return (
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {renderNavItems(navItems)}
          </div>
        </div>
      </nav>
    );
  }

  if (isTablet) {
    return (
      <nav className="fixed top-1/2 right-4 transform -translate-y-1/2 bg-white shadow-md rounded-lg p-2 z-50">
        <div className="flex flex-col space-y-4">
          {renderNavItems(navItems)}
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="flex justify-around items-center h-16">
        {renderNavItems(navItems.slice(0, 4))}
      </div>
    </nav>
  );
};

export default Navigation;
