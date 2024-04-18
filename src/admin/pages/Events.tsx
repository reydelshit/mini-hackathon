import { EventTypes } from '@/types/types';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PaymentRegister from '../components/PaymentRegister';

const Events = () => {
  const [events, setEvents] = useState<EventTypes[]>([]);
  const [eventType, setEventType] = useState<string>('');

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
        setEvents(res.data);
      });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="relative ml-[6rem] mr-[1.5rem] mt-[2rem] h-full">
      <h1 className="my-4 text-2xl font-bold">Students</h1>

      {eventType === 'registration-payment' || eventType === 'registration' ? (
        <PaymentRegister />
      ) : (
        <div>
          Event type other than registration-payment or registration is not
          available {eventType}
        </div>
      )}
    </div>
  );
};

export default Events;
