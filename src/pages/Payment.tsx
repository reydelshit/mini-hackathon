import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import Gcash from '@/assets/gcash.png';
import PayMaya from '@/assets/paymaya.png';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import moment from 'moment';

const Payment = () => {
  const [image, setImage] = useState<string | null>(null);
  const [gcashImage, setGcashImage] = useState<string | null>(null);
  const [paymayaImage, setPaymayaImage] = useState<string | null>(null);

  const [studentCode, setStudentCode] = useState('');
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [reference, setReference] = useState('');
  const { toast } = useToast();
  const { event_id } = useParams() as { event_id: string };

  const id = atob(event_id).replace(/[^0-9]/g, '');

  const fetchImages = async () => {
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

  useEffect(() => {
    fetchImages();
  }, []);

  const handleSubmitProof = (e: React.FormEvent<HTMLFormElement>) => {
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
              payment_type: 'wire-transfer',
              event_id: id,
              phone_number: phoneNumber,
              reference_no: reference,
              proof_image: image,
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

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const data = new FileReader();
    data.readAsDataURL(e.target.files![0]);

    data.onloadend = () => {
      const base64 = data.result;
      if (base64) {
        setImage(base64.toString());
      }
    };
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="absolute top-0  flex h-full w-[100%]  justify-center overflow-x-hidden bg-white bg-opacity-85">
        <div className="my-[5rem] h-fit w-[40rem] rounded-md border-2 bg-white p-2">
          <h1 className="my-4 text-center text-4xl font-bold">PAY NOW!</h1>
          <Tabs defaultValue="gcash" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger className="w-[50%]" value="gcash">
                Gcash
              </TabsTrigger>
              <TabsTrigger className="w-[50%]" value="paymaya">
                Paymaya
              </TabsTrigger>
            </TabsList>
            <TabsContent value="gcash">
              <img
                className="mb-2 h-[25rem] w-full object-contain"
                src={gcashImage ? gcashImage : Gcash}
                alt="gcash"
              />

              <form onSubmit={handleSubmitProof}>
                <div>
                  <div>
                    <Label className="text-md my-2 block text-start">
                      Fullname
                    </Label>
                    <Input type="text" className="w-full" />
                  </div>
                </div>
                <div>
                  <Label className="text-md my-2 block text-start">
                    Course / Year and Block
                  </Label>
                  <Input type="text" className="w-full" />
                </div>

                <div>
                  <Label className="text-md my-2 block text-start">
                    Student ID Code (makita sa id eg. 2021-0001)
                  </Label>
                  <Input
                    onChange={(e) => setStudentCode(e.target.value)}
                    type="text"
                    className="w-full"
                    required
                  />
                </div>

                <div>
                  <Label className="text-md my-2 block text-start">
                    Amount
                  </Label>
                  <Input
                    onChange={(e) => setPaymentAmount(parseInt(e.target.value))}
                    type="number"
                    className="w-full"
                    required
                  />
                </div>

                <div>
                  <Label className="text-md my-2 block text-start">
                    Phone No. (used in sending the payment)
                  </Label>
                  <Input
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    type="text"
                    className="w-full"
                    required
                  />
                </div>
                <Label className="text-md my-2 block text-start">
                  Upload proof of payment
                </Label>

                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleChangeImage}
                  className="cursor-pointer"
                  required
                />

                <div>
                  <Label className="text-md my-2 block text-start">
                    Gcash Reference No.
                  </Label>
                  <Input
                    onChange={(e) => setReference(e.target.value)}
                    type="text"
                    className="w-full"
                    required
                  />
                </div>

                <div className="mt-2 flex justify-center gap-4">
                  <Button type="submit">Submit</Button>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="paymaya">
              <img
                className="mb-2 h-[25rem] w-full object-contain"
                src={paymayaImage ? paymayaImage : PayMaya}
                alt="paymaya"
              />

              <form onSubmit={handleSubmitProof}>
                <div>
                  <div>
                    <Label className="text-md my-2 block text-start">
                      Fullname
                    </Label>
                    <Input type="text" className="w-full" required />
                  </div>
                </div>
                <div>
                  <Label className="text-md my-2 block text-start">
                    Course / Year and Block
                  </Label>
                  <Input type="text" className="w-full" required />
                </div>
                <div>
                  <Label className="text-md my-2 block text-start">
                    Student ID Code (makita sa id eg. 2021-0001)
                  </Label>
                  <Input
                    onChange={(e) => setStudentCode(e.target.value)}
                    type="text"
                    className="w-full"
                    required
                  />
                </div>

                <div>
                  <Label className="text-md my-2 block text-start">
                    Amount
                  </Label>
                  <Input
                    onChange={(e) => setPaymentAmount(parseInt(e.target.value))}
                    type="number"
                    className="w-full"
                    required
                  />
                </div>

                <div>
                  <Label className="text-md my-2 block text-start">
                    Phone No. (used in sending the payment)
                  </Label>
                  <Input
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    type="text"
                    className="w-full"
                    required
                  />
                </div>
                <Label className="text-md my-2 block text-start">
                  Upload proof of payment
                </Label>

                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleChangeImage}
                  className="cursor-pointer"
                  required
                />

                <div>
                  <Label className="text-md my-2 block text-start">
                    Paymaya Reference No.
                  </Label>
                  <Input
                    onChange={(e) => setReference(e.target.value)}
                    type="text"
                    className="w-full"
                    required
                  />
                </div>
                <div className="mt-2 flex justify-center gap-4">
                  <Button type="submit">Submit</Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Payment;
