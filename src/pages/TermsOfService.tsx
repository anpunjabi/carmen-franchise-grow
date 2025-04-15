
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import PrivacyPolicyEditor from '@/components/PrivacyPolicyEditor';

const TermsOfService = () => {
  const [termsContent, setTermsContent] = useState<string>('Loading Terms of Service...');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        const { data } = await supabase
          .from('users')
          .select('"Carmen Admin"')
          .eq('user_id', user.id)
          .single();
          
        setIsAdmin(data && data['Carmen Admin'] === true);
      }
    };

    checkAdminStatus();
  }, [user]);

  useEffect(() => {
    const fetchTermsOfService = async () => {
      try {
        const response = await fetch(
          `https://wfseyqycafobpolltezw.supabase.co/rest/v1/rpc/get_terms_of_service`,
          {
            headers: {
              'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indmc2V5cXljYWZvYnBvbGx0ZXp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyNDA2NDksImV4cCI6MjA1NTgxNjY0OX0.Qcx6-wRNPIScaAfoYQ1fMEUyWN1hgcuaRIG66uINUe8',
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (response.ok) {
          const content = await response.text();
          setTermsContent(content);
        } else {
          const { data, error } = await supabase
            .from('terms_of_service')
            .select('content')
            .eq('id', '00000000-0000-0000-0000-000000000001')
            .single();

          if (error) {
            throw error;
          }
          
          setTermsContent(data.content);
        }
      } catch (error) {
        console.error('Error fetching Terms of Service:', error);
        toast({
          title: 'Error',
          description: 'Could not load the Terms of Service. Please try again later.',
          variant: 'destructive',
        });
        setTermsContent('# Terms of Service\n\nTerms of service content is being updated.');
      } finally {
        setLoading(false);
      }
    };

    fetchTermsOfService();
  }, [toast]);

  const handleGoBack = () => {
    navigate('/');
  };

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async (newContent: string) => {
    try {
      const response = await fetch(
        `https://wfseyqycafobpolltezw.supabase.co/rest/v1/rpc/update_terms_of_service`,
        {
          method: 'POST',
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indmc2V5cXljYWZvYnBvbGx0ZXp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyNDA2NDksImV4cCI6MjA1NTgxNjY0OX0.Qcx6-wRNPIScaAfoYQ1fMEUyWN1hgcuaRIG66uINUe8',
            'Authorization': `Bearer ${supabase.auth.getSession().then(({ data }) => data.session?.access_token)}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            new_content: newContent,
            terms_id: '00000000-0000-0000-0000-000000000001'
          })
        }
      );

      if (!response.ok) {
        const { error } = await supabase
          .from('terms_of_service')
          .update({ 
            content: newContent,
            updated_at: new Date().toISOString(),
            updated_by: user?.id,
          })
          .eq('id', '00000000-0000-0000-0000-000000000001');

        if (error) {
          throw error;
        }
      }

      setTermsContent(newContent);
      setIsEditing(false);
      toast({
        title: 'Success',
        description: 'Terms of Service have been updated successfully.',
      });
    } catch (error) {
      console.error('Error updating Terms of Service:', error);
      toast({
        title: 'Error',
        description: 'Could not update the Terms of Service. Please try again later.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink>Terms of Service</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="outline" 
            onClick={handleGoBack}
            className="flex items-center gap-2"
          >
            <ChevronLeft size={16} />
            Back to Home
          </Button>

          {isAdmin && (
            <Button 
              onClick={handleToggleEdit}
              variant={isEditing ? "outline" : "default"}
            >
              {isEditing ? 'Cancel Editing' : 'Edit Terms of Service'}
            </Button>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6 md:p-8">
          {loading ? (
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
            </div>
          ) : isEditing ? (
            <PrivacyPolicyEditor 
              initialContent={termsContent} 
              onSave={handleSave}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <MarkdownRenderer content={termsContent} />
          )}
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
