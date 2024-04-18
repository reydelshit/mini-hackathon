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
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

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

import { useToast } from '@/components/ui/use-toast';
import { Label } from '@radix-ui/react-label';
import { Scanner } from '@yudiel/react-qr-scanner';
import moment from 'moment';

const PaymentRegister = () => {
  const [events, setEvents] = useState<EventTypes[]>([]);
  const [seachEventName, setSearchEventName] = useState('');

  const [showUploadWireTransfer, setShowUploadWireTransfer] = useState(false);
  const [generatePaymentLink, setGeneratePaymentLink] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const [studentCode, setStudentCode] = useState('');
  const [paymentAmount, setPaymentAmount] = useState(0);

  const { toast } = useToast();

  const { id } = useParams<{ id: string }>();

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

  const handleShowRegister = () => {
    setShowRegister(true);
  };

  const handleSubmitRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    axios
      .post(`${import.meta.env.VITE_MINI_HACKATHON}/payment.php`, {
        student_code_id: studentCode,
        amount: paymentAmount,
        payment_type: 'cash',
        event_id: id,
      })
      .then((res) => {
        if (res.data.status === 'success') {
          console.log(res.data);

          toast({
            title: 'Sucessfully registered the student ' + studentCode,
            description: moment().format('LLL'),
          });

          setStudentCode('');
          setPaymentAmount(0);
        }
      });
  };

  //   const handleSetScanResult = (text: string, result: any) => {
  //     console.log(text, result);
  //     setScanResult(result);
  //   };

  return (
    <div>
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
          <Button onClick={handleShowRegister} className="w-full">
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
        <div className="bg-primary-bg absolute top-0 flex h-full w-full flex-col items-center justify-center bg-opacity-90 md:w-full">
          <div className="mt-[-10rem]flex relative flex h-fit w-full flex-col items-center  rounded-lg border-2 bg-white md:h-[40%] md:w-[50%]">
            <Button
              onClick={() => setShowRegister(false)}
              className="absolute right-5 top-5"
            >
              Close
            </Button>

            <div className="mt-[5rem] flex h-[15rem] w-full md:h-[15rem] md:w-[15rem]">
              <Scanner
                onResult={(text, result) => setStudentCode(text)}
                onError={(error) => console.log(error?.message)}
              />
            </div>

            {studentCode.length > 0 && studentCode !== '0' && (
              <div className="flex h-full flex-col items-center justify-center p-2">
                <div className="my-2 flex flex-col justify-center">
                  <h1 className="my-2 text-center text-lg font-semibold">
                    Student Details
                  </h1>
                  <form onSubmit={handleSubmitRegister}>
                    <h1 className="bg-primary-color h-[2rem] rounded-md p-2 text-center text-white">
                      {studentCode.replace(/[^0-9-]/g, '')}
                    </h1>
                    <Label className="my-2">Amount</Label>
                    <Input
                      type="number"
                      onChange={(e) =>
                        setPaymentAmount(parseInt(e.target.value))
                      }
                      className="my-2"
                      placeholder="Enter payment amount"
                    />

                    <Button type="submit" className="w-full">
                      Submit
                    </Button>
                  </form>
                </div>
              </div>
            )}
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

export default PaymentRegister;
