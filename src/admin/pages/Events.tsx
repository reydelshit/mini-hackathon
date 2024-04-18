import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { EventTypes } from '@/types/types';
import { FiEdit3 } from 'react-icons/fi';
import { RiDeleteBin5Line } from 'react-icons/ri';

const Events = () => {
  const [events, setEvents] = useState<EventTypes[]>([]);
  const [seachEventName, setSearchEventName] = useState('');

  const [showUploadWireTransfer, setShowUploadWireTransfer] = useState(false);
  const [generatePaymentLink, setGeneratePaymentLink] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleDelete = (id: number) => {
    axios
      .delete(`${import.meta.env.VITE_MINI_HACKATHON}/student.php`, {
        data: { event_id: id },
      })
      .then((res) => {
        if (res.data) {
          fetchEvents();
        }
      });
  };

  const fetchEvents = async () => {
    await axios
      .get(`${import.meta.env.VITE_MINI_HACKATHON}/events.php`, {
        params: { event_id: 4 },
      })
      .then((res) => {
        console.log(res.data);
        setEvents(res.data);
      });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="relative ml-[6rem] mr-[1.5rem] mt-[2rem] h-full">
      <h1 className="my-4 text-2xl font-bold">Students</h1>

      <div className="flex w-full flex-col-reverse gap-10 md:flex-row">
        <div className="mt-[1rem] w-full rounded-lg bg-white p-2">
          <div className="my-2 flex w-full items-center justify-between">
            <Input
              onChange={(e) => setSearchEventName(e.target.value)}
              className="w-[20rem]"
              placeholder="search Student.."
            />
          </div>

          <Table className="w-full">
            <TableCaption>A list of Student added.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center font-bold "></TableHead>
                <TableHead className="font-bold text-black">
                  Student Code
                </TableHead>
                <TableHead className="font-bold text-black">Name</TableHead>
                <TableHead className="w-[15rem] font-bold text-black">
                  QR
                </TableHead>

                <TableHead className="font-bold text-black ">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events
                .filter((eve) => eve.event_title.includes(seachEventName))
                .map((stud) => {
                  return (
                    <TableRow
                      className="border-b-2 text-start"
                      key={stud.event_id}
                    >
                      <TableCell className="flex justify-center">
                        {/* <img
                        className="w-[8rem]"
                        src={stud.student_profile}
                        alt={stud.student_name}
                      />{' '} */}
                      </TableCell>

                      <TableCell> {stud.event_title} </TableCell>
                      <TableCell> {stud.event_date} </TableCell>

                      <TableCell>
                        <span className="flex gap-2">
                          <AlertDialog>
                            <AlertDialogTrigger className="cursor-pointer">
                              <RiDeleteBin5Line className="h-[1.5rem] w-[2rem] text-[#5d383a]" />
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete the Student and remove the
                                  data from the server.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(stud.event_id)}
                                >
                                  Continue
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          <Link to={`/admin/student/update/${stud.event_id}`}>
                            {' '}
                            <FiEdit3 className="h-[1.5rem] w-[2rem] text-[#5d383a]" />
                          </Link>
                          {/* <Link to={`/shop/${stud.event_id}`}>
                          {' '}
                          <AiOutlineEye className="h-[1.5rem] w-[2rem] text-[#5d383a]" />
                        </Link> */}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>

        <div className="bg-primary-bg flex w-full flex-col items-center gap-4 md:w-[30%]">
          <Button onClick={() => setShowRegister(true)} className="w-full">
            Register Student
          </Button>

          <Button
            onClick={() => setGeneratePaymentLink(true)}
            className="w-full"
          >
            Generate Payment Link
          </Button>
          <Button
            onClick={() => setShowUploadWireTransfer(true)}
            className="w-full"
          >
            Wire Transfer (Gcash, Payment)
          </Button>
        </div>
      </div>

      {showRegister && (
        <div className="bg-primary-bg absolute top-0 flex h-full w-full flex-col items-center justify-center bg-opacity-90">
          <div className="relative mt-[-10rem] flex h-[40%] w-[50%] flex-col items-center justify-center rounded-lg border-2 bg-white">
            <Button
              onClick={() => setShowRegister(false)}
              className="absolute right-5 top-5"
            >
              Close
            </Button>

            <h1 className="my-2 text-lg font-semibold">Register</h1>
          </div>
        </div>
      )}

      {generatePaymentLink && (
        <div className="bg-primary-bg absolute top-0 flex h-full w-full flex-col items-center justify-center bg-opacity-90">
          <div className="relative mt-[-10rem] flex h-[40%] w-[50%] flex-col items-center justify-center rounded-lg border-2 bg-white">
            <Button
              onClick={() => setGeneratePaymentLink(false)}
              className="absolute right-5 top-5"
            >
              Close
            </Button>

            <h1 className="my-2 text-lg font-semibold">Generate Payment</h1>
          </div>
        </div>
      )}

      {showUploadWireTransfer && (
        <div className="bg-primary-bg absolute top-0 flex h-full w-full flex-col items-center justify-center bg-opacity-90">
          <div className="relative mt-[-10rem] flex h-[40%] w-[50%] flex-col items-center justify-center rounded-lg border-2 bg-white">
            <Button
              onClick={() => setShowUploadWireTransfer(false)}
              className="absolute right-5 top-5"
            >
              Close
            </Button>

            <h1 className="my-2 text-lg font-semibold">Wire Transfer</h1>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
