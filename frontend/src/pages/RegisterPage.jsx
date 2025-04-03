
import React from 'react';
import { Navigate } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import RegisterForm from '@/components/Auth/RegisterForm';
import { useAuth } from '@/context/AuthContext';

const RegisterPage = () => {
  const { currentUser } = useAuth();

  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  return (
    <MainLayout>
      <section className="container py-12 md:py-16">
        <div className="max-w-md mx-auto">
          <RegisterForm />
        </div>
      </section>
    </MainLayout>
  );
};

export default RegisterPage;
