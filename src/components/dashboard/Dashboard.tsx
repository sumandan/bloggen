import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Navbar } from './Navbar';
import { BlogList } from './BlogList';
import { Settings } from './Settings';
import { BlogForm } from './BlogForm';
import { BlogGenerator } from './BlogGenerator';
import { fetchUserBlogs, createBlog, updateBlog, deleteBlog } from '../../lib/blogs';
import type { Database } from '../../types/supabase';

type Blog = Database['public']['Tables']['blogs']['Row'];

export function Dashboard() {
  const { session, isLoading } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [blogMode, setBlogMode] = useState<'create' | 'edit' | 'generate' | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSettingsClick = () => {
    setIsSettingsOpen(true);
  };

  useEffect(() => {
    if (session?.user.id) {
      fetchUserBlogs(session.user.id)
        .then(blogs => {
          if (Array.isArray(blogs)) {
            setBlogs(blogs);
          }
        })
        .catch(error => {
          console.error('Error loading blogs:', error);
        });
    }
  }, [session?.user.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/" replace />;
  }

  const handleCreateBlog = async (data: { title: string; content: string }) => {
    try {
      setIsSubmitting(true);
      if (!session?.user?.id) return;
      
      const newBlog = await createBlog({
        user_id: session.user.id,
        title: data.title,
        content: data.content,
        featured_image: data.featured_image
      });
      
      if (newBlog) {
        setBlogs(prevBlogs => [newBlog, ...prevBlogs]);
      }
      
      setBlogMode(null);
    } catch (error) {
      console.error('Error creating blog:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditBlog = async (data: { title: string; content: string }) => {
    if (!selectedBlog) return;
    
    try {
      setIsSubmitting(true);
      const updatedBlog = await updateBlog(selectedBlog.blog_id, {
        title: data.title,
        content: data.content,
        featured_image: data.featured_image
      });
      setBlogs(blogs.map(blog => 
        blog.blog_id === updatedBlog.blog_id ? updatedBlog : blog
      ));
      setSelectedBlog(null);
      setBlogMode(null);
    } catch (error) {
      console.error('Error updating blog:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBlog = async (blogId: string) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;
    
    try {
      await deleteBlog(blogId);
      setBlogs(blogs.filter(blog => blog.blog_id !== blogId));
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onSettingsClick={handleSettingsClick} />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-1 text-sm text-gray-600">
                Welcome back, {session.user.email}
              </p>
            </div>
            
            <button
              onClick={() => setBlogMode('generate')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              style={{ marginLeft: '0.5rem' }}
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Create New Blog
            </button>
          </div>

          <nav className="mb-5">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li>Dashboard</li>
              <li>•</li>
              <li>My Blogs</li>
            </ol>
          </nav>

          <BlogList
            blogs={blogs}
            onEdit={(blogId) => {
              const blog = blogs.find(b => b.blog_id === blogId);
              if (blog) {
                setSelectedBlog(blog);
                setBlogMode('edit');
              }
            }}
            onDelete={handleDeleteBlog}
          />
        </div>
      </main>

      <Settings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
      
      <BlogForm
        isOpen={blogMode === 'create' || blogMode === 'edit'}
        mode={blogMode}
        onClose={() => {
          setBlogMode(null);
          setSelectedBlog(null);
        }}
        onSubmit={selectedBlog ? handleEditBlog : handleCreateBlog}
        isSubmitting={isSubmitting}
        initialData={selectedBlog ? {
          title: selectedBlog.title,
          content: selectedBlog.content,
          featured_image: selectedBlog.featured_image
        } : undefined}
      />
      
      {blogMode === 'generate' && !selectedBlog && (
        <BlogGenerator
          onGenerated={async (title, content) => {
            try {
              setIsSubmitting(true);
              if (!session?.user?.id) return;
              
              const newBlog = await createBlog({
                user_id: session.user.id,
                title,
                content
              });
              
              if (newBlog) {
                setBlogs(prevBlogs => [newBlog, ...prevBlogs]);
              }
            } catch (error) {
              console.error('Error creating generated blog:', error);
            } finally {
              setIsSubmitting(false);
              setBlogMode(null);
            }
          }}
          onClose={() => setBlogMode(null)}
        />
      )}
    </div>
  );
}