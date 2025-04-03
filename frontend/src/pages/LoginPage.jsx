
import React from 'react';
import { Navigate } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import LoginForm from '@/components/Auth/LoginForm';
import { useAuth } from '@/context/AuthContext';

const LoginPage = () => {
  const { currentUser } = useAuth();

  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  return (
    <MainLayout>
      <section className="container py-12 md:py-16">
        <div className="max-w-md mx-auto">
          <LoginForm />
        </div>
      </section>
    </MainLayout>
  );
};

export default LoginPage;
