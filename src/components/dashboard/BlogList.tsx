import React from 'react';
import { Edit2, Trash2, Eye } from 'lucide-react';
import { formatDate, decodeHtmlEntities } from '../../lib/utils';
import type { Database } from '../../types/supabase';

type Blog = Database['public']['Tables']['blogs']['Row'];

interface BlogListProps {
  blogs: Blog[];
  onEdit: (blogId: string) => void;
  onDelete: (blogId: string) => void;
}

export function BlogList({ blogs, onEdit, onDelete }: BlogListProps) {
  if (!blogs.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No blogs yet. Create your first blog post!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {blogs.map((blog) => (
        <article
          key={blog.blog_id}
          className="w-full text-left bg-white rounded-lg shadow-sm hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 group relative cursor-pointer"
          onClick={() => onEdit(blog.blog_id)}
          role="article"
          tabIndex={0}
        >
            {blog.featured_image && (
              <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                <img
                  src={blog.featured_image}
                  alt={blog.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-200"
                />
              </div>
            )}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                {blog.title}
              </h3>
              <div className="mt-4">
                <p className="text-gray-600 line-clamp-3">
                  {decodeHtmlEntities(blog.content).replace(/<[^>]*>/g, '').substring(0, 150)}...
                </p>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {formatDate(blog.created_at)}
                </span>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(blog.blog_id);
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    aria-label="Delete blog post"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
        </article>
      ))}
    </div>
  );
}