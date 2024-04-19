import axios from 'axios';
import React, { useEffect, useState } from 'react';
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
import { Link } from 'react-router-dom';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { FiEdit3 } from 'react-icons/fi';
import { StudentTypes } from '@/types/types';
import AddStudentsModal from '../components/students/AddStudents';
import QRCode from 'react-qr-code';
import PageHeader from '../utils/PageHeaders';
import UpdateStudentsModal from '../components/students/UpdateStudent';

const Students = () => {
  const [students, setStudents] = useState<StudentTypes[]>([]);

  const [showAddStudents, setShowAddStudents] = useState(false);
  const [searchStudents, setSearchStudents] = useState('');
  const [studentId, setStudentId] = useState(0);
  const [showUpdate, setShowUpdate] = useState(false);

  const handleDelete = (id: number) => {
    axios
      .delete(`${import.meta.env.VITE_MINI_HACKATHON}/student.php`, {
        data: { student_id: id },
      })
      .then((res) => {
        if (res.data) {
          fetchStudents();
        }
      });
  };

  const fetchStudents = async () => {
    await axios
      .get(`${import.meta.env.VITE_MINI_HACKATHON}/student.php`)
      .then((res) => {
        console.log(res.data);
        setStudents(res.data);
      });
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleUpdateStudent = (id: number) => {
    console.log(id);
    setStudentId(id);
    setShowUpdate(true);
  };

  return (
    <div className="relative ml-[6rem] mt-[2rem] h-full">
      <PageHeader style="" title="Students" />

      {showUpdate && (
        <UpdateStudentsModal
          setShowAddStudents={setShowUpdate}
          studentId={studentId}
        />
      )}

      {showAddStudents ? (
        <AddStudentsModal setShowAddStudents={setShowAddStudents} />
      ) : (
        <div className="mt-[1rem] w-full rounded-lg bg-white p-2">
          <div className="my-2 flex w-full items-center justify-between">
            <Input
              onChange={(e) => setSearchStudents(e.target.value)}
              className="w-[20rem]"
              placeholder="search Student.."
            />

            <Button
              onClick={() => setShowAddStudents(!showAddStudents)}
              className="block h-[3.5rem] w-[10rem] self-end bg-primary-color text-white hover:border-4 hover:border-primary-color hover:bg-white hover:text-primary-color"
            >
              {showAddStudents ? 'Close' : 'Add Student'}
            </Button>
          </div>

          <Table>
            <TableCaption>A list of Student added.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center font-bold "></TableHead>
                <TableHead className="font-bold text-black">
                  Student Code
                </TableHead>
                <TableHead className="font-bold text-black">Name</TableHead>
                <TableHead className="font-bold text-black">Course</TableHead>
                <TableHead className="font-bold text-black">
                  Year and Block
                </TableHead>

                <TableHead className="w-[15rem] font-bold text-black">
                  QR
                </TableHead>

                <TableHead className="font-bold text-black ">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students
                .filter((stud) => stud.student_name.includes(searchStudents))
                .map((stud) => {
                  return (
                    <TableRow
                      className="border-b-2 text-start"
                      key={stud.student_id}
                    >
                      <TableCell className="flex justify-center">
                        <img
                          className="w-[8rem]"
                          src={stud.student_profile}
                          alt={stud.student_name}
                        />{' '}
                      </TableCell>

                      <TableCell> {stud.student_id_code} </TableCell>
                      <TableCell> {stud.student_name} </TableCell>
                      <TableCell> {stud.student_course} </TableCell>
                      <TableCell> {stud.year_block} </TableCell>

                      <TableCell>
                        <QRCode
                          size={256}
                          style={{
                            height: 'auto',
                            maxWidth: '40%',
                            width: '40%',
                          }}
                          value={stud.student_id_code}
                          viewBox={`0 0 256 256`}
                        />{' '}
                      </TableCell>

                      <TableCell>
                        <span className="flex gap-2">
                          <AlertDialog>
                            <AlertDialogTrigger className="cursor-pointer">
                              <RiDeleteBin5Line className="h-[1.5rem] w-[2rem] " />
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
                                  onClick={() => handleDelete(stud.student_id)}
                                >
                                  Continue
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>

                          <FiEdit3
                            onClick={() => handleUpdateStudent(stud.student_id)}
                            className="h-[1.5rem] w-[2rem] cursor-pointer"
                          />
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Students;
