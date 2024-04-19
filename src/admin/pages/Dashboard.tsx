import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { EventTypes } from '@/types/types';
import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../utils/PageHeaders';
import { IoCloseSharp } from 'react-icons/io5';

const Dashboard = () => {
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [event, setEvent] = useState({});
  const [eventType, setEventType] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const { toast } = useToast();

  const [events, setEvents] = useState<EventTypes[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const name = e.target.name;
    setEvent((values) => ({ ...values, [name]: value }));
  };

  const handleChangeType = (e: string) => {
    const selectedEvent = e;
    setEventType(selectedEvent);
  };

  const handleTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setEventDescription(value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    axios
      .post(`${import.meta.env.VITE_MINI_HACKATHON}/events.php`, {
        ...event,
        event_type: eventType,
        status: 'Ongoing',
        description: eventDescription,
      })
      .then((res) => {
        console.log(res.data);

        if (res.data.status === 'success') {
          toast({
            title: 'Sucessfully added an event',
            description: moment().format('LLL'),
          });

          fetchEvents();
          setShowAddEvent(false);
        }
      });
  };

  const fetchEvents = async () => {
    await axios
      .get(`${import.meta.env.VITE_MINI_HACKATHON}/events.php`)
      .then((res) => {
        console.log(res.data);
        setEvents(res.data);
      });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="relative ml-[6rem] mt-[2rem] h-full">
      <div className="flex w-full justify-between pr-4">
        <PageHeader style="" title="Events" />

        <div className="flex flex-col gap-2">
          <div className="w-[8rem] rounded-md bg-yellow-600 p-2 text-center text-white">
            Ongoing
          </div>
          <div className="w-[8rem] rounded-md bg-green-600 p-2 text-center text-white">
            Completed
          </div>
          <div className="w-[8rem] rounded-md bg-red-600  p-2 text-center text-white">
            Cancelled
          </div>
        </div>
      </div>

      <div className="grid w-full grid-cols-5">
        {events.map((event, index) => (
          <div
            key={index}
            className={`
          ${
            event.status === 'Ongoing'
              ? 'border-4 border-yellow-600 '
              : event.status === 'Completed'
                ? 'border-4 border-green-600 '
                : 'border-4 border-red-600 '
          }
          flex h-[10rem] w-[20rem]  cursor-pointer flex-col items-start justify-between rounded-3xl bg-white p-4 hover:bg-primary-bg
        `}
          >
            <Link
              className="flex h-full w-full flex-col justify-between"
              to={`/admin/events/${event.event_id}`}
            >
              <h1
                className={`text-3xl font-bold ${
                  event.status === 'Ongoing'
                    ? ' text-yellow-600 '
                    : event.status === 'Completed'
                      ? ' text-green-600 '
                      : ' text-red-600 '
                }`}
              >
                {event.event_title}
              </h1>
              <div className="flex w-full items-center justify-between">
                <span className="text-sm">
                  {moment(event.event_deadline).format('LLL')}
                </span>

                <div className="flex items-end">
                  <span className="flex items-center text-5xl font-semibold">
                    {event.record_count}
                    <Label className="text-xs">Entries</Label>
                  </span>
                </div>
              </div>
            </Link>
          </div>
        ))}

        <div
          onClick={() => setShowAddEvent(true)}
          className="flex h-[10rem] w-[20rem] cursor-pointer flex-col items-center justify-center rounded-lg border-4 border-dashed border-gray-500 bg-white p-4 text-center hover:bg-primary-bg"
        >
          <p className="text-7xl  font-light">+</p>
        </div>
      </div>

      {showAddEvent && (
        <div className="absolute top-0 flex h-full w-full flex-col items-center justify-center bg-primary-bg bg-opacity-90">
          <div className="relative mt-[-10rem] flex h-[50%] w-[50%] flex-col items-center justify-center rounded-lg border-2 bg-white">
            <IoCloseSharp
              onClick={() => setShowAddEvent(false)}
              className="absolute right-5 top-5 h-[5rem] w-[4rem] cursor-pointer hover:text-red-500"
            />

            <h1 className="my-2 text-lg font-semibold">SET AN EVENT</h1>
            <form
              onSubmit={handleSubmit}
              className="flex w-[25rem] flex-col items-center justify-center"
            >
              <Select value={eventType} onValueChange={handleChangeType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="registration-payment">
                    Registration + Payment
                  </SelectItem>
                  <SelectItem value="payment">Payment</SelectItem>
                  <SelectItem value="registration">Registration</SelectItem>
                  <SelectItem value="attendance">
                    Attendance (Unavailable)
                  </SelectItem>
                </SelectContent>
              </Select>

              <div className="w-full">
                <Label className="my-[1rem] block">Title</Label>
                <Input
                  onChange={handleChange}
                  className="w-full"
                  type="text"
                  name="event_title"
                />
              </div>

              <div className="w-full">
                <Label className="my-[1rem] block">Description</Label>

                <Textarea
                  onChange={handleTextArea}
                  className="w-full"
                  name="description"
                />
              </div>

              <div className="w-full">
                <Label className="my-[1rem] block">Deadline</Label>
                <Input
                  onChange={handleChange}
                  className="w-full"
                  type="datetime-local"
                  name="event_deadline"
                />
              </div>

              <Button
                className="mt-[2rem] block h-[3.5rem] w-[15rem] bg-primary-color text-white hover:border-4 hover:border-primary-color hover:bg-white hover:text-primary-color"
                type="submit"
              >
                Submit
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
