import { supabase } from './supabase';
import type { Database } from '../types/supabase';

type Blog = Database['public']['Tables']['blogs']['Row'];
type NewBlog = Database['public']['Tables']['blogs']['Insert'];

export async function fetchUserBlogs(userId: string): Promise<Blog[]> {
  if (!userId) {
    console.error('No user ID provided to fetchUserBlogs');
    return [];
  }

  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('user_id', userId)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }

  return data || [];
}

export async function createBlog(blog: NewBlog) {
  const { data, error } = await supabase
    .from('blogs')
    .insert(blog)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateBlog(blogId: string, updates: Partial<Blog>) {
  const { data, error } = await supabase
    .from('blogs')
    .update(updates)
    .eq('blog_id', blogId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteBlog(blogId: string) {
  const { error } = await supabase
    .from('blogs')
    .delete()
    .eq('blog_id', blogId);

  if (error) throw error;
}