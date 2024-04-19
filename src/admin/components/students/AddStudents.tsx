import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StudentTypes } from '@/types/types';
import axios from 'axios';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import User from '@/assets/user.png';

type ChangeEvent =
  | React.ChangeEvent<HTMLInputElement>
  | React.ChangeEvent<HTMLTextAreaElement>;

export default function AddStudentsModal({
  setShowAddStudents,
}: {
  setShowAddStudents: (value: boolean) => void;
}) {
  const [students, setStudents] = useState<StudentTypes[]>([]);

  const [image, setImage] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent) => {
    const value = e.target.value;
    const name = e.target.name;
    setStudents((values) => ({ ...values, [name]: value }));
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(image);

    axios
      .post(`${import.meta.env.VITE_MINI_HACKATHON}/student.php`, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        ...students,
        student_profile: image,
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.status === 'success') {
          window.location.reload();
          //   setShowAddStudents(false);
          // navigate('/');
        }
      });
  };

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const data = new FileReader();
    data.readAsDataURL(e.target.files![0]);

    data.onloadend = () => {
      const base64 = data.result;
      if (base64) {
        setImage(base64.toString());

        // console.log(base64.toString());
      }
    };
  };

  return (
    <div className="absolute top-0 flex h-fit w-full flex-col items-center justify-center bg-primary-bg p-4 text-center">
      <div className="w-[60rem] ">
        <div className="mt-[5rem] flex w-full items-center justify-between gap-[4rem] rounded-md bg-white p-4">
          <div className="mb-2 mt-[2rem] flex w-[40rem] flex-col">
            <img
              className="mb-4 h-[25rem] w-full rounded-lg object-contain "
              src={image! ? image! : User}
            />
            <Label className="mb-2 text-start">Primary image</Label>

            <Input
              type="file"
              accept="image/*"
              onChange={handleChangeImage}
              className="cursor-pointer"
            />
          </div>

          <form onSubmit={handleSubmit} className="flex w-full flex-col">
            <div className="flex w-full gap-2">
              <div className="item-start flex w-full flex-col p-4">
                <Label className="mb-2 text-start">Student Fullname</Label>
                <Input
                  name="student_name"
                  className="mb-2"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex w-full gap-2">
              <div className="item-start flex w-full flex-col p-4">
                <Label className="mb-2 text-start">Course</Label>
                <Input
                  name="student_course"
                  className="mb-2"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex w-full gap-2">
              <div className="item-start flex w-full flex-col p-4">
                <Label className="mb-2 text-start">Year / Block</Label>
                <Input
                  name="year_block"
                  className="mb-2"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex w-full items-center gap-2">
              <div className="item-start flex w-full flex-col  p-4">
                <Label className="mb-2 text-start">Student Code</Label>
                <Input
                  name="student_id_code"
                  className="mb-2"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                className="block h-[3.5rem] w-[10rem] bg-primary-color text-white hover:border-4 hover:border-primary-color hover:bg-white hover:text-primary-color"
                type="submit"
              >
                Register
              </Button>

              <Button
                onClick={() => setShowAddStudents(false)}
                className="block h-[3.5rem] w-[10rem] bg-primary-color text-white hover:border-4 hover:border-primary-color hover:bg-white hover:text-primary-color"
              >
                Close
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
