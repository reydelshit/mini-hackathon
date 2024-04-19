import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

import { useToast } from '@/components/ui/use-toast';
import { EventRecordsType, StudentTypes } from '@/types/types';
import { Label } from '@radix-ui/react-label';
import { Scanner } from '@yudiel/react-qr-scanner';
import moment from 'moment';
import { IoCloseSharp } from 'react-icons/io5';

const PaymentRegister = ({ eventTitle }: { eventTitle: string }) => {
  const [events, setEvents] = useState<EventRecordsType[]>([]);
  const [seachEventName, setSearchEventName] = useState('');

  const [showUploadWireTransfer, setShowUploadWireTransfer] = useState(false);
  const [generatePaymentLink, setGeneratePaymentLink] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const [studentCode, setStudentCode] = useState('');
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [eventStatus, setEventStatus] = useState('Approved' as string);
  const { toast } = useToast();

  const { id } = useParams<{ id: string }>();
  const [gcashImage, setGcashImage] = useState<string | null>(null);
  const [paymayaImage, setPaymayaImage] = useState<string | null>(null);
  const [showImage, setShowImage] = useState(false);
  const [proofImage, setProofImage] = useState('');
  const [studentProfile, setStudentProfile] = useState(
    {} as StudentTypes | null,
  );

  const copyLink = `http://192.168.0.104:5173/pay/${btoa(eventTitle.toString())}/${btoa('event-id=' + id ?? ''.toString())}`;

  const handleDelete = (id: number) => {
    axios
      .delete(`${import.meta.env.VITE_MINI_HACKATHON}/student.php`, {
        data: { event_id: id },
      })
      .then((res) => {
        if (res.data) {
          fetchEventsRecords();
        }
      });
  };

  const fetchEventsRecords = async () => {
    await axios
      .get(`${import.meta.env.VITE_MINI_HACKATHON}/event-records.php`, {
        params: { event_id: id },
      })
      .then((res) => {
        console.log(res.data);
        setEvents(res.data);
      });
  };

  useEffect(() => {
    fetchEventsRecords();
  }, []);

  const handleShowRegister = () => {
    setShowRegister(true);
  };

  const handleSubmitRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    axios
      .get(`${import.meta.env.VITE_MINI_HACKATHON}/event-records.php`, {
        params: { student_code_id: studentCode },
      })
      .then((res) => {
        console.log(res.data);

        if (res.data.length === 0) {
          axios
            .post(`${import.meta.env.VITE_MINI_HACKATHON}/event-records.php`, {
              student_code_id: studentCode,
              amount: paymentAmount,
              payment_type: 'cash',
              event_id: id,
              payment_status: 'Approved',
            })
            .then((res) => {
              if (res.data.status === 'success') {
                console.log(res.data);

                toast({
                  title: 'Sucessfully Registered the student ' + studentCode,
                  description: moment().format('LLL'),
                });

                setStudentCode('');
                setPaymentAmount(0);
              }
            });

          return;
        } else {
          toast({
            title: 'Student already registered',
            description: moment().format('LLL'),
            variant: 'destructive',
          });
        }
      });
  };

  const handleStatus = (status: string) => {
    const selectedStatus = status;

    setEventStatus(selectedStatus);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(copyLink);

    toast({
      title: 'Link copied',
      description: 'Link copied to clipboard',
    });
  };

  const handleChangeImageGcash = (e: React.ChangeEvent<HTMLInputElement>) => {
    const data = new FileReader();
    data.readAsDataURL(e.target.files![0]);

    data.onloadend = () => {
      const base64 = data.result;
      if (base64) {
        setGcashImage(base64.toString());

        // console.log(base64.toString());
      }
    };
  };

  const handleChangeImagePaymaya = (e: React.ChangeEvent<HTMLInputElement>) => {
    const data = new FileReader();
    data.readAsDataURL(e.target.files![0]);

    data.onloadend = () => {
      const base64 = data.result;
      if (base64) {
        setPaymayaImage(base64.toString());

        // console.log(base64.toString());
      }
    };
  };

  const handleUploadQRCode = (type: string) => {
    axios
      .post(`${import.meta.env.VITE_MINI_HACKATHON}/wire-transfer.php`, {
        event_id: id,
        wire_type: type,
        wire_image: type === 'gcash' ? gcashImage : paymayaImage,
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.status === 'success') {
          toast({
            title: 'QR Code uploaded',
            description: 'QR Code uploaded successfully',
          });
        }
      });
  };

  const handleShowWireTransfer = () => {
    setShowUploadWireTransfer(true);

    axios
      .get(`${import.meta.env.VITE_MINI_HACKATHON}/wire-transfer.php`, {
        params: { event_id: id },
      })
      .then((res) => {
        console.log(res.data);

        if (res.data.length > 0) {
          res.data.map((data: any) => {
            if (data.wire_type === 'gcash') {
              setGcashImage(data.wire_image);
            } else {
              setPaymayaImage(data.wire_image);
            }
          });
        }
      });
  };

  const handleShowImage = (image: string) => {
    setProofImage(image);
    setShowImage(true);
  };

  useEffect(() => {
    // Check if studentCode is not empty
    if (studentCode) {
      axios
        .get(`${import.meta.env.VITE_MINI_HACKATHON}/student.php`, {
          params: { student_id_code: studentCode },
        })
        .then((res) => {
          // Check if data is available
          if (res.data.length > 0) {
            console.log(res.data[0]);
            setStudentProfile(res.data[0]);
          } else {
            // Handle case when no data is found
            setStudentProfile(null);
          }
        })
        .catch((error) => {
          console.error('Error fetching student profile:', error);
          // Handle error, e.g., set studentProfile to null
          setStudentProfile(null);
        });
    } else {
      // Handle case when studentCode is empty
      setStudentProfile(null);
    }
  }, [studentCode]);

  return (
    <div>
      <div className="flex w-full flex-col-reverse gap-10 md:flex-row">
        <div className="mt-[1rem] w-full rounded-lg bg-white p-2">
          <div className="my-2 mb-[2rem] flex w-full items-center justify-between">
            <Input
              onChange={(e) => setSearchEventName(e.target.value)}
              className="h-[3.5rem] w-[20rem]"
              placeholder="search Student.."
            />

            <div className="flex h-[3.5rem] gap-4">
              <Button className="block h-[3.5rem] w-fit bg-primary-color text-white hover:border-4 hover:border-primary-color hover:bg-white hover:text-primary-color">
                <Link to={`/admin/events/${id}/check`}>
                  Check Online Payments
                </Link>
              </Button>

              <Select value={eventStatus} onValueChange={handleStatus}>
                <SelectTrigger className="h-full w-[15rem]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Table className="w-full">
            <TableCaption>A list of Student added.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center font-bold "></TableHead>
                <TableHead className="font-bold text-black">Student</TableHead>
                <TableHead className=" font-bold text-black">Amount</TableHead>

                <TableHead className=" font-bold text-black">
                  Payment Type
                </TableHead>
                <TableHead className="w-[10rem] font-bold text-black">
                  Phone Number (used for payment)
                </TableHead>

                <TableHead className=" font-bold text-black">
                  Proof Image
                </TableHead>

                <TableHead className=" font-bold text-black">
                  Reference No
                </TableHead>
                <TableHead className="font-bold text-black">Date</TableHead>
                <TableHead className="font-bold text-black">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events
                .filter(
                  (eve) =>
                    (seachEventName === 'All' ||
                      eve.student_code_id.includes(seachEventName)) &&
                    (eventStatus === 'All' ||
                      eve.payment_status.includes(eventStatus)),
                )
                .map((even, index) => {
                  return (
                    <TableRow className="border-b-2 text-start" key={index}>
                      <TableCell className="flex justify-center">
                        <img
                          className="w-[5rem]"
                          src={even.student_profile}
                          alt={even.student_name}
                        />
                      </TableCell>

                      {/* <TableCell> {even.event_title} </TableCell> */}
                      <TableCell> {even.student_name} </TableCell>
                      <TableCell>₱ {even.amount} </TableCell>
                      <TableCell> {even.payment_type} </TableCell>
                      <TableCell>
                        {even.phone_number.length > 0
                          ? even.phone_number
                          : 'n/a'}
                      </TableCell>

                      <TableCell>
                        {even.proof_image.length > 0 ? (
                          <a
                            onClick={() => handleShowImage(even.proof_image)}
                            className="cursor-pointer text-blue-500 underline"
                          >
                            View proof
                          </a>
                        ) : (
                          'n/a'
                        )}
                      </TableCell>

                      <TableCell>
                        {even.reference_no.length > 0
                          ? even.reference_no
                          : 'n/a'}
                      </TableCell>

                      <TableCell>
                        {' '}
                        {moment(even.created_at).format('LLL')}{' '}
                      </TableCell>

                      <TableCell>
                        {even.payment_status === 'Pending' && (
                          <span className="rounded-md bg-violet-500 p-2 text-white">
                            Pending
                          </span>
                        )}

                        {even.payment_status === 'Approved' && (
                          <span className="rounded-md bg-green-500 p-2 text-white">
                            Approved
                          </span>
                        )}

                        {even.payment_status === 'Rejected' && (
                          <span className="rounded-md bg-red-500 p-2 text-white">
                            Rejected
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>

        <div className="flex w-full flex-col items-center gap-4 bg-primary-bg md:w-[20%]">
          <Button
            className="block h-[3.5rem] w-full bg-primary-color text-white hover:border-4 hover:border-primary-color hover:bg-white hover:text-primary-color"
            onClick={handleShowRegister}
          >
            Register Student
          </Button>

          <Button
            className="block h-[3.5rem] w-full bg-primary-color text-white hover:border-4 hover:border-primary-color hover:bg-white hover:text-primary-color"
            onClick={() => setGeneratePaymentLink(true)}
          >
            Generate Payment Link
          </Button>
          <Button
            className="block h-[3.5rem] w-full bg-primary-color text-white hover:border-4 hover:border-primary-color hover:bg-white hover:text-primary-color"
            onClick={handleShowWireTransfer}
          >
            Online Transfer (Gcash, Payment)
          </Button>
        </div>
      </div>

      {showRegister && (
        <div className="absolute top-0 flex h-full w-full flex-col items-center justify-center bg-primary-bg bg-opacity-90 md:w-full">
          <div className="relative mt-[-15rem] flex h-[85%] w-full flex-col items-center justify-center rounded-lg border-2 bg-white md:h-[60%] md:w-[50%]">
            <IoCloseSharp
              onClick={() => setShowRegister(false)}
              className="absolute right-5 top-5 h-[5rem] w-[4rem] cursor-pointer hover:text-red-500"
            />

            <div className="flex h-fit w-full flex-col items-center justify-around gap-2 p-4 md:flex-row">
              <div className="flex h-[15rem] w-full md:w-[50%]">
                <Scanner
                  onResult={(text, result) =>
                    setStudentCode(text.replace(/[^0-9-]/g, ''))
                  }
                  onError={(error) => console.log(error?.message)}
                />
              </div>

              {studentCode.length > 0 && studentCode !== '0' && (
                <div className="flex h-full w-full flex-col items-center justify-center p-2">
                  <div className="my-2 flex w-[60%] flex-col justify-center">
                    <h1 className="my-2 text-center text-lg font-semibold">
                      Student Details
                    </h1>
                    <form onSubmit={handleSubmitRegister}>
                      <h1 className="my-2 rounded-md bg-primary-color p-4 text-center font-bold text-white">
                        {studentCode.replace(/[^0-9-]/g, '')}
                      </h1>

                      {studentProfile && studentProfile.student_name && (
                        <>
                          <div className="flex w-full items-center justify-center">
                            <img
                              className="w-[5rem] self-center rounded-full object-cover"
                              src={studentProfile.student_profile ?? ''}
                              alt={studentProfile.student_name ?? ''}
                            />
                          </div>

                          <Label className="my-2">Student Name</Label>
                          <h1 className="ml-2 text-center text-xl font-bold">
                            {studentProfile.student_name}
                          </h1>

                          <Label className="my-2">Course Block / Year</Label>
                          <h1 className="ml-2 text-center text-xl font-bold">
                            {studentProfile.student_course ?? ''}{' '}
                            {studentProfile.year_block ?? ''}
                          </h1>
                        </>
                      )}

                      <Label className="my-2">Amount</Label>
                      <Input
                        type="number"
                        onChange={(e) =>
                          setPaymentAmount(parseInt(e.target.value))
                        }
                        className="my-2"
                        placeholder="Enter payment amount"
                      />

                      <Button
                        type="submit"
                        className="mt-[2rem] block h-[3.5rem] w-full bg-primary-color text-white hover:border-4 hover:border-primary-color hover:bg-white hover:text-primary-color"
                      >
                        Submit
                      </Button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {generatePaymentLink && (
        <div className="absolute top-0 flex h-full w-full flex-col items-center justify-center bg-primary-bg bg-opacity-90">
          <div className="relative mt-[-10rem] flex h-[40%] w-[50%] flex-col items-center justify-center rounded-lg border-2 bg-white p-4">
            <Button
              onClick={() => setGeneratePaymentLink(false)}
              className="absolute right-5 top-5"
            >
              Close
            </Button>

            <h1 className="my-4 text-[1.5rem] font-semibold">
              Share this payment link for online transfer
            </h1>

            <div className="flex w-full flex-col items-center text-center">
              <span className="w-fit rounded-lg border-2 bg-primary-color p-4 text-white">
                {copyLink}
              </span>
              <Button onClick={handleCopy} className="my-4 h-[3rem] w-[9rem]">
                Copy Link
              </Button>
            </div>
          </div>
        </div>
      )}

      {showUploadWireTransfer && (
        <div className="absolute top-0 flex h-full w-full flex-col items-center justify-center bg-primary-bg bg-opacity-90">
          <div className="relative mt-[-10rem] flex h-[50%] w-[50%] flex-col items-center justify-center rounded-lg border-2 bg-white">
            <Button
              onClick={() => setShowUploadWireTransfer(false)}
              className="absolute right-5 top-5"
            >
              Close
            </Button>
            <h1 className="my-4 text-[1.5rem] font-semibold">
              QR Code for online transfer
            </h1>

            <div className="flex w-full justify-around">
              <div>
                <Label className="text-md my-2 block text-start">
                  Gcash QR Code
                </Label>

                <Input
                  type="file"
                  className="my-4 w-full"
                  required
                  accept="image/*"
                  onChange={handleChangeImageGcash}
                />

                <Button
                  onClick={() => handleUploadQRCode('gcash')}
                  className="w-full"
                >
                  Submit
                </Button>
              </div>

              <img
                className="w w-[10rem]"
                src={gcashImage! ? gcashImage! : ''}
                alt=""
              />
            </div>

            <div className="mt-[2rem] flex w-full justify-around">
              <div>
                <Label className="text-md my-2 block text-start">
                  Paymaya QR Code
                </Label>

                <Input
                  type="file"
                  className="my-4 w-full"
                  required
                  accept="image/*"
                  onChange={handleChangeImagePaymaya}
                />

                <Button
                  onClick={() => handleUploadQRCode('paymaya')}
                  className="w-full"
                >
                  Submit
                </Button>
              </div>

              <img
                className="w w-[10rem]"
                src={paymayaImage! ? paymayaImage! : ''}
                alt=""
              />
            </div>
          </div>
        </div>
      )}

      {showImage && (
        <div className="absolute bottom-0 top-[-10rem] flex h-screen w-dvw items-center justify-center bg-primary-bg bg-opacity-85">
          <div className="flex h-[80%] w-[80%] flex-col items-center justify-center">
            <Button
              className="my-2 bg-red-500"
              onClick={() => setShowImage(false)}
            >
              {' '}
              Close
            </Button>
            <img
              className="h-[80%] w-[80%] object-contain"
              src={proofImage}
              alt="proof"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentRegister;
