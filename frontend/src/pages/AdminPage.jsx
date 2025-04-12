
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Navigate } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import { useAuth } from '@/context/AuthContext';
import FeedbackList from '@/components/Feedback/FeedbackList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { User, MessageCircle, ShieldAlert } from 'lucide-react';
import api from '../services/api';

const AdminPage = () => {
  const { currentUser, isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // For confirmation dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Dialog state
  
  if (!currentUser || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    getAllUsers();
  }, []);

const getAllUsers = async () => {
    try {
      const response = await api.get(`/users`);
      setUsers(response.data);
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch users";
      console.error("Error fetching users:", response);
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const confirmDeleteUser = (user) => {
    setSelectedUser(user); // Set the user to be deleted
    setIsDialogOpen(true); // Open the confirmation dialog
  };

  const handleConfirmDelete = () => {
    if (selectedUser) {
      handleDeleteUser(selectedUser._id); // Call delete function
      setSelectedUser(null); // Clear selected user
      setIsDialogOpen(false); // Close the dialog
    }
  };

const handleDeleteUser = async (userId) => {
    try {
      const response = await api.delete(`/users/${userId}`);
      if (response.status === 200) {
        toast.success("User deleted successfully");
        setUsers(users.filter(user => user._id !== userId));
      } else {
        toast.error("Failed to delete user");
      }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete user";
      console.error("Error deleting user:", error);
      toast.error(message);
    }
  }

  
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
                    {users.map((user) => (
                      <div key={user._id} className="grid grid-cols-5 p-3 border-t">
                        <div>{user.name}</div>
                        <div className="text-muted-foreground text-xs">{user.email}</div>
                        <div>
                          <span className={`capitalize px-2 py-1 rounded-full text-xs ${
                            user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'
                          }`}>
                            {user.role}
                          </span>
                        </div>
                        <div className="text-muted-foreground">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                        <div>
                          <button className="text-sm text-mushroom-accent hover:underline"
                                onClick={() => confirmDeleteUser(user)}
                            >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                    {users.length === 0 && (
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

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete the user <strong>{selectedUser?.name}</strong>? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default AdminPage;
