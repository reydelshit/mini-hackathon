import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EventTypes } from '@/types/types';
import axios from 'axios';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PaymentRegister from '../components/PaymentRegister';
import { toast } from '@/components/ui/use-toast';
import PageHeader from '../utils/PageHeaders';

const Events = () => {
  const [eventType, setEventType] = useState<string>('');
  const [eventStatus, setEventStatus] = useState('Ongoing' as string);

  const [event, setEvent] = useState({} as EventTypes);

  const { id } = useParams<{ id: string }>();

  const fetchEvents = async () => {
    await axios
      .get(`${import.meta.env.VITE_MINI_HACKATHON}/events.php`, {
        params: { event_id: id },
      })
      .then((res) => {
        console.log(res.data);
        if (res.data[0].event_type.length > 0) {
          setEventType(res.data[0].event_type);
        }
        setEvent(res.data[0]);
      });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleStatus = (status: string) => {
    const selectedStatus = status;

    setEventStatus(selectedStatus);

    axios
      .put(`${import.meta.env.VITE_MINI_HACKATHON}/events.php`, {
        event_id: id,
        status: status,
      })
      .then((res) => {
        console.log(res.data);

        if (res.data.status === 'success') {
          toast({
            title: 'Event status updated',
            description: moment().format('LLL'),
          });
        }
      });
  };

  return (
    <div className="relative ml-[6rem] mt-[2rem] h-full bg-primary-bg md:mr-[1.5rem]">
      <div className="flex w-[81%] items-center justify-between md:flex-row">
        <div>
          <PageHeader style="text-[3rem]" title={String(event.event_title)} />
          <h4 className="my-4 text-xl font-bold">{event.description}</h4>

          <p>Deadline: {moment(event.event_deadline).format('LLL')}</p>
        </div>

        <div className="flex flex-col">
          <Label className="my-2  block">Status</Label>

          <Select value={eventStatus} onValueChange={handleStatus}>
            <SelectTrigger className="w-[15rem] bg-white text-black">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Ongoing">Ongoing</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        {eventType === 'registration-payment' ||
        eventType === 'registration' ||
        eventType === 'payment' ? (
          <PaymentRegister eventTitle={event.event_title} />
        ) : (
          <div>
            Event type other than registration-payment or registration is not
            available {eventType}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
