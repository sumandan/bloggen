import React, { useState } from 'react';
import { X, Check, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { supabase } from '../../lib/supabase';
import { AVAILABLE_MODELS } from '../../lib/constants';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Settings({ isOpen, onClose }: SettingsProps) {
  const [apiKey, setApiKey] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('mixtral-8x7b-32768');
  const [isLoading, setIsLoading] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    async function loadApiKey() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user.id) return;

      const { data, error } = await supabase
        .from('user_profiles')
        .select('groq_api_key, preferred_model')
        .eq('user_id', session.user.id)
        .single();

      if (!error && data?.groq_api_key) {
        setApiKey(data.groq_api_key);
        if (data.preferred_model) {
          setSelectedModel(data.preferred_model);
        }
      }
    }

    if (isOpen) {
      loadApiKey();
    }
  }, [isOpen]);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user.id) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('user_profiles')
        .update({ 
          groq_api_key: apiKey,
          preferred_model: selectedModel 
        })
        .eq('user_id', session.user.id);

      if (error) throw error;
      onClose();
    } catch (err) {
      setError('Failed to save API key');
      console.error('Error saving API key:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTestStatus('idle');
    setError(null);
    
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          model: 'mixtral-8x7b-32768',
          messages: [{ role: 'user', content: 'test' }],
          max_tokens: 1
        })
      });

      if (response.ok) {
        setTestStatus('success');
      } else {
        const data = await response.json();
        throw new Error(data.error?.message || 'Invalid API key');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to validate API key';
      setError(message);
      setTestStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-hidden">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
            aria-label="Close settings"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4">
          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
                Groq API Key
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  id="apiKey"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Enter your API key"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Your API key is securely stored and encrypted
              </p>
              
              <div className="mt-4">
                <label htmlFor="model" className="block text-sm font-medium text-gray-700">
                  Default AI Model
                </label>
                <select
                  id="model"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  {AVAILABLE_MODELS.map(model => (
                    <option 
                      key={model.id} 
                      value={model.id}
                      disabled={model.deprecated}
                    >
                      {model.id} {model.deprecated ? '(Deprecated)' : ''} - {model.developer}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  Select your preferred AI model for content generation
                </p>
              </div>
            </div>
            
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={!apiKey || isLoading}
                className={cn(
                  "flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white",
                  isLoading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700",
                  "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                )}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : testStatus === 'success' ? (
                  <Check className="h-4 w-4 mr-2" />
                ) : null}
                Test Connection
              </button>
              
              {testStatus === 'success' && (
                <span className="text-green-600 text-sm">Connection successful!</span>
              )}
              {testStatus === 'error' && (
                <span className="text-red-600 text-sm">Connection failed</span>
              )}
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving || !apiKey}
                className={cn(
                  "px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700",
                  (isSaving || !apiKey) && "opacity-50 cursor-not-allowed"
                )}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}