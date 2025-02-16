import clsx from "clsx";
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { TbLayoutSidebarLeftCollapse } from "react-icons/tb";

const navitems = [
  { title: "Home", path: "/" },
  { title: "Contact", path: "/" },
  { title: "Privacy", path: "/" },
  { title: "Terms & Conditions", path: "/" },
  { title: "Refund Policy", path: "/" },
  { title: "Login", path: "/auth/login" },
];

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    document.body.classList.toggle("overflow-hidden", !isSidebarOpen);
  };

  const closeSidebarWithDelay = () => {
    setTimeout(() => {
      setIsSidebarOpen(false);
      document.body.classList.remove("overflow-hidden");
    }, 200);
  };

  return (
    <main className=" h-[80px] flex flex-col justify-between z-[9999] px-3 py-5 text-black bg-[#E7F3FB]">
      <nav className="w-10/12  mx-auto flex justify-between items-center px-5">
        <div className="flex items-center justify-between lg:justify-center w-full lg:w-fit">
          <div>
            <Link to="/">
              {/* LOGO */}
              <img src="/logo.png" className="w-[50px] h-full" alt="Logo" />
            </Link>
          </div>

          <section className="w-[50px] ">
            {/* MENU for Mobile */}
            <h1
              className="text-3xl cursor-pointer lg:hidden"
              onClick={toggleSidebar}
            >
              <FaBars />
            </h1>
          </section>
        </div>

        <section className="flex items-center justify-center gap-8 xl:gap-16 2xl:gap-20 text-center">
          {/* Navbar For Larger Displays */}
          {navitems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="relative hidden lg:inline-block font-montserrat font-bold text-center text-sm md:text-base w-[60px] text-black transition-all duration-300 hover:text-blue-500 
      before:absolute before:left-0 before:bottom-0 before:w-0 before:h-[2px] before:bg-blue-500 before:transition-all before:duration-300 before:ease-in-out 
      hover:before:w-full"
            >
              {item.title}
            </Link>
          ))}
        </section>

        {/* Mobile Sidebar */}
        <div
          className={clsx(
            "fixed inset-0 z-[10000] lg:hidden bg-black/50 backdrop-blur-sm transition-all",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
          onClick={toggleSidebar} // Close sidebar when background is clicked
        >
          <section
            className="overflow-scroll text-white bg-black/80 h-screen w-56 absolute left-0 top-0 flex flex-col items-center gap-8 py-16"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the sidebar
          >
            <p className="text-center">
              <TbLayoutSidebarLeftCollapse size="30" onClick={toggleSidebar} />
            </p>

            {navitems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="font-bold flex flex-col items-center justify-center"
                onClick={closeSidebarWithDelay} // Close sidebar with delay
              >
                {item.title}
              </Link>
            ))}
          </section>
        </div>
      </nav>
    </main>
  );
};

export default Navbar;
