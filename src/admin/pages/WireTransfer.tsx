import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useToast } from '@/components/ui/use-toast';
import { EventRecordsType } from '@/types/types';
import moment from 'moment';

export default function WireTransfer() {
  const [events, setEvents] = useState<EventRecordsType[]>([]);
  const [seachEventName, setSearchEventName] = useState('');
  const [eventStatus, setEventStatus] = useState('Pending');

  const { toast } = useToast();

  const { id } = useParams<{ id: string }>();

  const [showImage, setShowImage] = useState(false);
  const [proofImage, setProofImage] = useState('');
  const [showDuplicate, setShowDuplicate] = useState(false);

  const [duplicate, setDuplicate] = useState<EventRecordsType[]>([]);

  const fetchEventsRecords = async () => {
    await axios
      .get(`${import.meta.env.VITE_MINI_HACKATHON}/wire-transfer-check.php`, {
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

  const handleCheckDuplicate = (reference: string) => {
    setShowDuplicate(true);

    const duplicate = events.filter((eve) => eve.reference_no === reference);

    setDuplicate(duplicate);
  };

  const handleShowImage = (image: string) => {
    setProofImage(image);
    setShowImage(true);
  };

  const handleChangeStatus = async (id: string, status: string) => {
    await axios
      .put(`${import.meta.env.VITE_MINI_HACKATHON}/wire-transfer-check.php`, {
        event_records_id: id,
        payment_status: status,
      })
      .then((res) => {
        console.log(res.data);

        toast({
          title: 'Status Updated',
          description: moment().format('LLL'),
        });

        fetchEventsRecords();
      });
  };

  const handleStatus = (status: string) => {
    const selectedStatus = status;

    setEventStatus(selectedStatus);
  };

  return (
    <div className="relative ml-[6rem] mr-[1.5rem] mt-[2rem] h-full">
      <h1>Wire Transfer</h1>

      <div className="flex w-full flex-col-reverse gap-10 md:flex-row">
        <div className="mt-[1rem] w-full rounded-lg bg-white p-2">
          <div className="my-2 flex w-full items-center justify-between">
            <Input
              onChange={(e) => setSearchEventName(e.target.value)}
              className="w-[20rem]"
              placeholder="search Student.."
            />

            <Select value={eventStatus} onValueChange={handleStatus}>
              <SelectTrigger className="w-[15rem]">
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

          <Table className="w-full">
            <TableCaption>A list of payment entries added.</TableCaption>
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

                <TableHead className="font-bold text-black">Action</TableHead>
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
                      <TableCell>
                        <div className="flex gap-2">
                          {even.payment_type === 'wire-transfer' && (
                            <Button
                              onClick={() =>
                                handleCheckDuplicate(even.reference_no)
                              }
                            >
                              Check
                            </Button>
                          )}

                          <Button
                            onClick={() =>
                              handleChangeStatus(
                                String(even.event_records_id),
                                'Approved',
                              )
                            }
                          >
                            Approve
                          </Button>
                          <Button
                            onClick={() =>
                              handleChangeStatus(
                                String(even.event_records_id),
                                'Rejected',
                              )
                            }
                          >
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
      </div>

      {showDuplicate && (
        <div className="bg-primary-bg absolute top-0 flex h-full w-full flex-col items-center justify-center bg-opacity-90">
          <div className="relative mt-[-10rem] flex h-[40%] w-[50%] flex-col items-center justify-center rounded-lg border-2 bg-white">
            <Button
              onClick={() => setShowDuplicate(false)}
              className="absolute right-5 top-5"
            >
              Close
            </Button>
            <h1 className="my-4 text-[1.5rem] font-semibold">
              Duplicate Reference No
            </h1>

            {duplicate.length > 0 ? (
              <div className="flex w-full flex-col items-start justify-center gap-4 p-4">
                <h1>Matched Entries</h1>
                {duplicate.map((dup, index) => {
                  return (
                    <div
                      key={index}
                      className="flex w-full items-center justify-around gap-4 border-2 p-2"
                    >
                      <h1 className="font-semibold">{dup.student_name}</h1>

                      <span className="">
                        Reference no.{' '}
                        <p className="font-semibold">{dup.reference_no}</p>
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex w-full items-center justify-center">
                <span className="bg-primary-color w-fit rounded-lg border-2 p-4 text-white">
                  No duplicate reference no
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {showImage && (
        <div className="bg-primary-bg absolute bottom-0 top-[-10rem] flex h-screen w-dvw items-center justify-center bg-opacity-85">
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
}
