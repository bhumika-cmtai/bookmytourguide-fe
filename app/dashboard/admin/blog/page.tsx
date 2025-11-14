"use client";

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import Image from 'next/image';
import { AppDispatch, RootState } from '@/lib/store';
// ✅ Corrected Path: Make sure your thunk and type paths are correct
import { fetchBlogs, createBlog } from '@/lib/redux/thunks/blog/blogThunks'; 
import { Blog } from '@/lib/data';
import { toast } from 'react-toastify';

// Import your modal component
import { CreateBlogModal } from '@/components/admin/CreateBlogModal'; // Adjust path if needed

// --- UI Components ---
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusCircle, FilePenLine, Trash2, ExternalLink, Plus } from 'lucide-react';


const TableSkeleton = () => (
  <div className="space-y-3 mt-4">
    {[...Array(5)].map((_, i) => (
      <div className="flex items-center space-x-4" key={i}>
        <Skeleton className="h-12 w-12 rounded-md" />
        <div className="space-y-2 flex-1"><Skeleton className="h-4 w-3/4" /><Skeleton className="h-4 w-1/2" /></div>
        <Skeleton className="h-8 w-24" />
      </div>
    ))}
  </div>
);


export default function ManageBlogsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { blogs, loading, error, currentPage, totalPages } = useSelector((state: RootState) => state.blogs);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // State for modal's loading spinner

  useEffect(() => {
    dispatch(fetchBlogs({ page: 1, limit: 10 }));
  }, [dispatch]);

  // --- ✅ IMPLEMENTED: Function to handle blog creation ---
  const handleCreateBlog = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      // Dispatch the thunk and use .unwrap() to handle success/failure
      await dispatch(createBlog(formData)).unwrap();
      toast.success("Blog post created successfully!");
      setIsModalOpen(false); // Close modal on success
    } catch (err: any) {
      // The thunk's rejectWithValue will be caught here
      toast.error(err || "Failed to create blog post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      dispatch(fetchBlogs({ page: newPage, limit: 10 }));
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl">Manage Blogs</CardTitle>
              <CardDescription>View, create, edit, or delete blog posts.</CardDescription>
            </div>
            <Button className="red-gradient" onClick={() => setIsModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2"/> Add New Blog
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? <TableSkeleton /> : error ? (
            <div className="text-center py-10 text-red-600"><p>An error occurred: {error}</p></div>
          ) : (
            <>
              {blogs.length === 0 ? (
                 <div className="text-center py-12">
                   <h3 className="text-xl font-semibold">No Blogs Found</h3>
                   <p className="text-muted-foreground mt-2">Get started by creating your first blog post.</p>
                 </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    {/* ... Table Header ... */}
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80px] hidden sm:table-cell">Image</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden md:table-cell">Published On</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {blogs.map((blog: Blog) => (
                        <TableRow key={blog._id}>
                          <TableCell className="hidden sm:table-cell">
                            <Image src={blog.thumbnail || '/placeholder-image.png'} alt={blog.title} width={64} height={64} className="rounded-md object-cover aspect-square"/>
                          </TableCell>
                          <TableCell className="font-medium max-w-[250px] truncate">{blog.title}</TableCell>
                          <TableCell><Badge variant={blog.published ? 'default' : 'outline'}>{blog.published ? 'Published' : 'Draft'}</Badge></TableCell>
                          <TableCell className="hidden md:table-cell">{formatDate(blog.publishedAt)}</TableCell>
                          <TableCell className="text-right space-x-2">
                             <Link href={`/blog/${blog.slug}`} target="_blank"><Button variant="outline" size="icon" title="View Post"><ExternalLink className="h-4 w-4" /></Button></Link>
                             <Button variant="outline" size="icon" disabled title="Edit"><FilePenLine className="h-4 w-4" /></Button>
                             <Button variant="destructive" size="icon" disabled title="Delete"><Trash2 className="h-4 w-4" /></Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              {totalPages > 1 && (
                <div className="flex items-center justify-end space-x-2 pt-4">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage <= 1}>Previous</Button>
                  <span className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</span>
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages}>Next</Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* --- ✅ FIX: Conditionally render the modal --- */}
      {/* This prevents hydration issues by only mounting the modal when needed */}
      {isModalOpen && (
        <CreateBlogModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateBlog}
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
}