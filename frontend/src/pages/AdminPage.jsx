
import React from 'react';
import { Navigate } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import { useAuth } from '@/context/AuthContext';
import FeedbackList from '@/components/Feedback/FeedbackList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, MessageCircle, ShieldAlert } from 'lucide-react';

const AdminPage = () => {
  const { currentUser, isAdmin } = useAuth();
  
  if (!currentUser || !isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  const mockUsers = [
    { id: 'user1', name: 'Demo User', email: 'user@example.com', role: 'user', joinDate: '2023-05-15' },
    { id: 'admin1', name: 'Admin User', email: 'admin@mushroom.com', role: 'admin', joinDate: '2023-04-10' },
  ];

  return (
    <MainLayout>
      <section className="container py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <ShieldAlert className="h-7 w-7 text-mushroom-primary" />
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>
          
          <Tabs defaultValue="feedback" className="space-y-6">
            <TabsList>
              <TabsTrigger value="feedback">
                <MessageCircle className="h-4 w-4 mr-2" />
                Review Feedback
              </TabsTrigger>
              <TabsTrigger value="users">
                <User className="h-4 w-4 mr-2" />
                Manage Users
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="feedback">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">User Feedback</CardTitle>
                  <CardDescription>
                    Review and manage feedback submitted by users.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FeedbackList isAdmin={true} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">User Management</CardTitle>
                  <CardDescription>
                    View and manage registered users.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <div className="grid grid-cols-5 bg-muted p-3">
                      <div className="font-medium">Name</div>
                      <div className="font-medium">Email</div>
                      <div className="font-medium">Role</div>
                      <div className="font-medium">Join Date</div>
                      <div className="font-medium">Actions</div>
                    </div>
                    {mockUsers.map((user) => (
                      <div key={user.id} className="grid grid-cols-5 p-3 border-t">
                        <div>{user.name}</div>
                        <div className="text-muted-foreground">{user.email}</div>
                        <div>
                          <span className={`capitalize px-2 py-1 rounded-full text-xs ${
                            user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'
                          }`}>
                            {user.role}
                          </span>
                        </div>
                        <div className="text-muted-foreground">
                          {new Date(user.joinDate).toLocaleDateString()}
                        </div>
                        <div>
                          <button className="text-sm text-mushroom-primary hover:underline">
                            Edit
                          </button>
                        </div>
                      </div>
                    ))}
                    {mockUsers.length === 0 && (
                      <div className="p-4 text-center text-muted-foreground">
                        No users found
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </MainLayout>
  );
};

export default AdminPage;
