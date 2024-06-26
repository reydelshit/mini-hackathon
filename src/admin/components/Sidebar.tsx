import Logo from '@/assets/logo.jpg';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PiStudent } from 'react-icons/pi';
import { HomeIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ExitIcon } from '@radix-ui/react-icons';
import CICT from '@/assets/cict.jpg';

import Dashboard from '../pages/Dashboard';
import Events from '../pages/Events';
import NotFound from '../pages/NotFound';
import Students from '../pages/Student';
import WireTransfer from '../pages/OnlineTransfer';

export default function Sidebar() {
  const [width, setWidth] = useState<number>(5);
  const [isMouseOver, setIsMouseOver] = useState<boolean>(false);

  const handleMouseOver = () => {
    setWidth(18);
    setIsMouseOver(true);
  };

  const handleMouseLeave = () => {
    setWidth(5);
    setIsMouseOver(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('mini_hackathon_token');
    window.location.href = '/login';
  };

  return (
    <>
      <div
        onMouseOver={() => handleMouseOver()}
        onMouseLeave={() => handleMouseLeave()}
        style={{ width: `${width}rem` }}
        className="duration-350 fixed left-0 top-0 z-10  flex h-screen flex-col items-center justify-center border-r-2 bg-white p-2 transition-all ease-in-out md:w-[25rem]"
      >
        <header className="flex h-[8rem] items-center">
          {isMouseOver ? (
            <Avatar className="mt-[5rem] h-[10em] w-[10rem] cursor-pointer">
              <AvatarImage src={CICT} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          ) : (
            <Avatar className="h-[4rem] w-[4rem]">
              <AvatarImage src={CICT} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          )}
        </header>

        <div className="mt-[-5rem] flex h-full w-full flex-col items-start justify-center p-2 transition-none">
          {isMouseOver ? (
            <Link
              to="/admin/"
              className="mb-2 flex w-full rounded-sm bg-inherit p-2 font-semibold text-black  hover:bg-primary-color hover:text-white"
            >
              <HomeIcon className="mr-2 h-[1.5rem] w-5" /> Dashboard
            </Link>
          ) : (
            <Link
              to="/admin/"
              className="mb-2 flex w-full rounded-sm bg-inherit p-2 font-semibold text-black  hover:bg-primary-color hover:text-white"
            >
              <HomeIcon className="mr-2 h-[1.5rem] w-5" />
            </Link>
          )}

          {isMouseOver ? (
            <Link
              to="/admin/students"
              className="mb-2 flex w-full rounded-sm bg-inherit p-2 font-semibold text-black  hover:bg-primary-color hover:text-white"
            >
              <PiStudent className="mr-2 h-[1.5rem] w-5" /> Students
            </Link>
          ) : (
            <Link
              to="/admin/students"
              className="mb-2 flex w-full rounded-sm bg-inherit p-2 font-semibold text-black hover:bg-primary-color hover:text-white "
            >
              <PiStudent className="mr-2 h-[1.5rem] w-5" />
            </Link>
          )}

          {/* {isMouseOver ? (
            <Link
              to="/admin/representatives"
              className="hover:bg-primary-color mb-2 flex w-full rounded-sm bg-inherit p-2 font-semibold text-black hover:text-white "
            >
              <HomeIcon className="mr-2 h-[1.5rem] w-5" /> Representative
            </Link>
          ) : (
            <Link
              to="/admin/representatives"
              className="hover:bg-primary-color mb-2 flex w-full rounded-sm bg-inherit p-2 font-semibold text-black hover:text-white "
            >
              <HomeIcon className="mr-2 h-[1.5rem] w-5" />
            </Link>
          )} */}
        </div>

        <footer className="mt-auto">
          {isMouseOver ? (
            <Button
              onClick={handleLogout}
              className="w-full border-none bg-inherit text-black shadow-none outline-none"
            >
              <ExitIcon className="mr-2 h-[1.5rem] w-5" /> Logout
            </Button>
          ) : (
            <Button
              onClick={handleLogout}
              className="w-full border-none bg-inherit text-black shadow-none outline-none"
            >
              <ExitIcon className="mr-2 h-[1.5rem] w-5" />
            </Button>
          )}
        </footer>
      </div>

      <div className="h-full w-full">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/events/:id" element={<Events />} />
          <Route path="/events/:id/check" element={<WireTransfer />} />

          <Route path="*" element={<NotFound />} />
          <Route path="/*" element={<NotFound />} />
          <Route path="/*/*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}
