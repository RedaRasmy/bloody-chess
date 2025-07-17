
// import { signIn } from 'next-auth/react';
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';

import { getServerSession } from "next-auth";
import RegisterForm from './register-form'
import {redirect} from 'next/navigation'

export default async function RegisterPage() {
  const session = await getServerSession()

  if (session?.user) {
    redirect('/')
  }

  return (
    <RegisterForm/>
  );
}