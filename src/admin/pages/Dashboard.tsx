import { Label } from '@/components/ui/label';
import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import moment from 'moment';

const Dashboard = () => {
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [event, setEvent] = useState({});
  const [eventType, setEventType] = useState('');
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const name = e.target.name;
    setEvent((values) => ({ ...values, [name]: value }));
  };

  const handleChangeType = (e: string) => {
    const selectedEvent = e;
    setEventType(selectedEvent);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    axios
      .post(`${import.meta.env.VITE_MINI_HACKATHON}/events.php`, {
        ...event,
        event_type: eventType,
      })
      .then((res) => {
        console.log(res.data);

        if (res.data.status === 'success') {
          toast({
            title: 'Sucessfully added an event',
            description: moment().format('LLL'),
          });
        }
      });
  };

  return (
    <div className="relative ml-[6rem] mt-[2rem] h-full">
      <h1 className="my-4 text-2xl font-bold">Dashboard</h1>

      <div className="grid w-full grid-cols-4">
        <div className="hover:bg-primary-bg flex h-[10rem] w-[20rem] cursor-pointer flex-col items-start justify-between rounded-lg border-4 border-dashed border-green-600 bg-white p-4">
          <h1 className="text-2xl font-bold">HACKATHON PAYMENTS</h1>
          <div className="flex w-full items-center justify-between">
            <span className="text-sm">April 19, 2024</span>

            <div className="flex flex-col">
              {/* <Label>Subs</Label> */}
              <span className="text-lg font-semibold">100</span>
            </div>
          </div>
        </div>

        <div
          onClick={() => setShowAddEvent(true)}
          className="hover:bg-primary-bg flex h-[10rem] w-[20rem] cursor-pointer flex-col items-center justify-center rounded-lg border-4 border-dashed border-gray-500 bg-white p-4 text-center"
        >
          <p className="text-7xl  font-light">+</p>
        </div>
      </div>

      {showAddEvent && (
        <div className="bg-primary-bg absolute top-0 flex h-full w-full flex-col items-center justify-center bg-opacity-90">
          <div className="relative mt-[-10rem] flex h-[40%] w-[50%] flex-col items-center justify-center rounded-lg border-2 bg-white">
            <Button
              onClick={() => setShowAddEvent(false)}
              className="absolute right-5 top-5"
            >
              Close
            </Button>

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
                  <SelectItem value="attendance">Attendance</SelectItem>
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
                <Label className="my-[1rem] block">Date</Label>
                <Input
                  onChange={handleChange}
                  className="w-full"
                  type="datetime-local"
                  name="event_date"
                />
              </div>

              <Button className="my-[2rem]" type="submit">
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
