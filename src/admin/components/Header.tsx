import User from '@/assets/user.png';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Header = () => {
  return (
    <div className=" mb-[2rem] ml-[5rem] flex h-[6rem] items-center justify-between border-2 bg-white p-4">
      <h1 className="cursor-pointer text-2xl font-semibold">
        <a href="/admin">MINI HACKATHON</a>
      </h1>

      <div className="flex gap-2">
        <Avatar className="h-[4rem] w-[4rem]">
          <AvatarImage src={User} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <div className="flex items-center">
          <h1 className="text-xl font-semibold">Reydel Ocon</h1>
        </div>
      </div>
    </div>
  );
};

export default Header;
