import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import CICT from '@/assets/cict.jpg';

type ChangeEvent = React.ChangeEvent<HTMLInputElement>;

export default function Login() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorInput, setErrorInput] = useState<string>('');
  const [error, setError] = useState<string>('');

  const usernameLogin = 'admin';
  const passwordLogin = 'admin';

  const [credentials, setCredentials] = useState([]);

  const handleChange = (e: ChangeEvent) => {
    const { name, value } = e.target;

    setUsername(value);
    setPassword(value);

    setCredentials((values) => ({ ...values, [name]: value }));

    console.log(credentials);
  };

  const handleLogin = () => {
    if (!username || !password)
      return setErrorInput('Please fill in all fields');

    if (username !== usernameLogin || password !== passwordLogin) {
      return setError('Invalid username or password');
    } else {
      localStorage.setItem('mini_hackathon_token', 'admin');

      window.location.href = '/admin';
    }

    // axios
    //   .get(`${import.meta.env.VITE_MINI_HACKATHON}/login.php`, {
    //     params: credentials,
    //   })
    //   .then((res) => {
    //     console.log(res.data);
    //     if (res.data) {
    //       if (res.data[0].account_type === 'admin') {
    //         localStorage.setItem('lto_bidding_token', res.data[0].account_id);
    //         localStorage.setItem('lto_accountType', res.data[0].account_type);

    //         fetchVipStatus(res.data[0].account_id);
    //         window.location.href = '/admin';
    //       } else if (parseInt(res.data[0].is_verified) === 0) {
    //         setError('Account not verified yet');
    //         return;
    //       } else if (parseInt(res.data[0].is_verified) === 2) {
    //         setError('Account is rejected');
    //         return;
    //       } else {
    //         localStorage.setItem('lto_bidding_token', res.data[0].account_id);
    //         localStorage.setItem('lto_accountType', res.data[0].account_type);
    //         fetchVipStatus(res.data[0].account_id);

    //         window.location.href = '/';
    //       }
    //     }
    //   });
  };

  return (
    <div className="flex h-dvh w-dvw items-center justify-center">
      <div className="flex h-[35rem] w-[40%] flex-col items-center justify-center rounded-md border-2 border-primary-color bg-white p-4 px-[5rem] text-black shadow-slate-400">
        <Avatar className="my-[1rem] h-[10em] w-[10rem] cursor-pointer">
          <AvatarImage src={CICT} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <Input
          onChange={handleChange}
          className="placeholder: mb-8 w-full p-8  text-2xl placeholder:text-2xl placeholder:font-semibold focus:outline-none"
          placeholder="Username"
          name="username"
          required
        />

        {/* <Label className="mb-1 self-start text-sm">Password</Label> */}
        <Input
          className="placeholder: mb-2 w-full p-8  text-2xl placeholder:text-2xl placeholder:font-semibold focus:outline-none"
          type="password"
          onChange={handleChange}
          name="password"
          placeholder="Password"
          required
        />

        {/* <div className="w-full px-2 text-end">
          <a
            href="/register"
            className="text-[1.2rem] text-primary-color underline"
          >
            Create an account
          </a>
        </div> */}
        <Button
          className="my-2 block h-[3.5rem] w-[15rem] bg-primary-color text-white hover:border-4 hover:border-primary-color hover:bg-white hover:text-primary-color"
          onClick={handleLogin}
        >
          Login
        </Button>

        {error.length > 0 && (
          <p className="text-red my-2 rounded-md border-2 bg-white p-2 font-semibold text-red-600">
            {error}
          </p>
        )}
        {errorInput && (
          <p className="text-red rounded-md border-2 bg-white p-2 font-semibold text-red-600">
            {errorInput}
          </p>
        )}
      </div>
    </div>
  );
}
