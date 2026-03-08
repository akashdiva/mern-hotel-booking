import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../assets/Ragu_Residency-icon.jpeg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 w-full z-50 bg-gray-100 shadow-sm">
        <div className="w-full flex items-center justify-between px-6 md:px-10 py-4">

          {/* Logo + Hotel Name */}
          <div className="flex items-center gap-2">
            <img
              src={logo}
              alt="Raghu Residency Logo"
              className="h-10 w-10 md:h-12 md:w-12 rounded-lg object-cover"
            />
            <div>
              <h2 className="font-semibold text-base md:text-lg text-gray-800">
                Raghu Residency
              </h2>
              <p className="text-xs md:text-sm text-gray-500">
                Tiruvallur, Tamil Nadu
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
        <ul className="hidden md:flex gap-10 text-gray-700 font-medium">

  <li>
    <NavLink
      to="/"
      className={({ isActive }) =>
        isActive
          ? "text-[#E17100] font-semibold border-b-2 border-[#E17100]"
          : "hover:text-[#E17100] transition"
      }
    >
      Home
    </NavLink>
  </li>

  <li>
    <NavLink
      to="/rooms"
      className={({ isActive }) =>
        isActive
          ? "text-[#E17100] font-semibold border-b-2 border-[#E17100]"
          : "hover:text-[#E17100] transition"
      }
    >
      Rooms
    </NavLink>
  </li>

  <li>
    <NavLink
      to="/booking/1"
      className={({ isActive }) =>
        isActive
          ? "text-[#E17100] font-semibold border-b-2 border-[#E17100]"
          : "hover:text-[#E17100] transition"
      }
    >
      Book Now
    </NavLink>
  </li>

  <li>
    <NavLink
      to="/contact"
      className={({ isActive }) =>
        isActive
          ? "text-[#E17100] font-semibold border-b-2 border-[#E17100]"
          : "hover:text-[#E17100] transition"
      }
    >
      Contact
    </NavLink>
  </li>

</ul>

          {/* Desktop Call Button */}
          <a
            href="tel:+918667837244"
            className="hidden md:block bg-[#E17100] hover:bg-[#c96300] text-white px-5 py-2 rounded-lg font-medium transition"
          >
            📞 +91 86678 37244
          </a>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-800"
            onClick={() => setIsOpen(true)}
          >
            <Menu size={28} />
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-lg transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 z-50`}
      >
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="font-semibold text-lg">Raghu Residency</h2>
          <button onClick={() => setIsOpen(false)}>
            <X size={26} />
          </button>
        </div>

       <ul className="flex flex-col gap-6 p-6 text-gray-700 font-medium">

<li>
<NavLink
to="/"
end
onClick={() => setIsOpen(false)}
className={({ isActive }) =>
isActive ? "text-[#E17100] font-semibold" : ""
}
>
Home
</NavLink>
</li>

<li>
<NavLink
to="/rooms"
onClick={() => setIsOpen(false)}
className={({ isActive }) =>
isActive ? "text-[#E17100] font-semibold" : ""
}
>
Rooms
</NavLink>
</li>

<li>
<NavLink
to="/booking/1"
onClick={() => setIsOpen(false)}
className={({ isActive }) =>
isActive ? "text-[#E17100] font-semibold" : ""
}
>
Book Now
</NavLink>
</li>

<li>
<NavLink
to="/contact"
onClick={() => setIsOpen(false)}
className={({ isActive }) =>
isActive ? "text-[#E17100] font-semibold" : ""
}
>
Contact
</NavLink>
</li>

</ul>

        {/* Mobile Call Button */}
        <div className="p-6">
          <a
            href="tel:+918667837244"
            className="block text-center bg-[#E17100] hover:bg-[#c96300] text-white py-3 rounded-lg font-medium transition"
          >
            📞 +91 86678 37244
          </a>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Navbar;