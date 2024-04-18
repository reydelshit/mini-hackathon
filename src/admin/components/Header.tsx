import Logo from '@/assets/logo.jpg';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Header = () => {
  return (
    <div className=" mb-[2rem] ml-[5rem] flex h-[6rem] items-center justify-between border-2 bg-white p-4">
      <h1 className="text-2xl font-semibold">MINI HACKATHON</h1>

      <div className="flex gap-2">
        <Avatar className="h-[4rem] w-[4rem]">
          <AvatarImage src={Logo} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <div className="flex items-center">
          <h1 className="text-xl font-semibold">Cyril Nnaemeka</h1>
        </div>
      </div>
    </div>
  );
};

export default Header;
