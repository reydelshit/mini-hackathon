import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StudentTypes } from '@/types/student';
import axios from 'axios';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

type ChangeEvent =
  | React.ChangeEvent<HTMLInputElement>
  | React.ChangeEvent<HTMLTextAreaElement>;

export default function AddStudentsModal({
  setShowAddStudents,
}: {
  setShowAddStudents: (value: boolean) => void;
}) {
  const [students, setStudents] = useState<StudentTypes[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('' as string);
  const [selectedSlot, setSelectedSlot] = useState('' as string);

  const [isVip, setIsVip] = useState(false);

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
    <div className="absolute top-0 flex h-fit w-full flex-col items-center justify-center p-4 text-center">
      <div className="w-[70rem] ">
        <div className="mt-[5rem] flex w-full items-center justify-between gap-[4rem] rounded-md bg-white p-4">
          <div className="mb-2 mt-[2rem] flex flex-col">
            <img
              className="mb-4 h-[25rem] w-[30rem] rounded-lg object-contain "
              src={image! ? image! : ''}
            />
            <Label className="mb-2 text-start">Primary image</Label>

            <Input
              type="file"
              accept="image/*"
              onChange={handleChangeImage}
              className="cursor-pointer"
            />
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col text-[#5d383a]"
          >
            <div className="flex w-full gap-2">
              <div className="item-start flex w-[50%] flex-col p-4">
                <Label className="mb-2 text-start">Student Fullname</Label>
                <Input
                  name="student_name"
                  className="mb-2"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex w-full items-center gap-2">
              <div className="item-start flex w-[50%] flex-col  p-4">
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
                className="w-[40%] self-center bg-[#5d383a]"
                type="submit"
              >
                Register
              </Button>

              <Button
                onClick={() => setShowAddStudents(false)}
                className="w-[40%] self-center bg-[#5d383a]"
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
