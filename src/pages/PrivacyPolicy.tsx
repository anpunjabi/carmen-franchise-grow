
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import PrivacyPolicyEditor from '@/components/PrivacyPolicyEditor';
import MarkdownRenderer from '@/components/MarkdownRenderer';

const PrivacyPolicy = () => {
  const [policyContent, setPolicyContent] = useState<string>('Loading privacy policy...');
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
    const fetchPrivacyPolicy = async () => {
      try {
        // Use a generic approach to fetch from the table
        const { data, error } = await supabase
          .rpc('get_privacy_policy');

        if (error) {
          // Fallback if RPC doesn't exist - this is for development only
          const { data: directData, error: directError } = await supabase
            .from('privacy_policy')
            .select('*')
            .eq('id', '00000000-0000-0000-0000-000000000001')
            .single();

          if (directError) {
            throw directError;
          }
          
          // Access content property after verifying it exists
          if (directData && 'content' in directData) {
            setPolicyContent(directData.content as string);
          } else {
            setPolicyContent('# Privacy Policy\n\nPrivacy policy content is being updated.');
          }
        } else if (data) {
          setPolicyContent(data);
        }
      } catch (error) {
        console.error('Error fetching privacy policy:', error);
        toast({
          title: 'Error',
          description: 'Could not load the privacy policy. Please try again later.',
          variant: 'destructive',
        });
        setPolicyContent('# Privacy Policy\n\nPrivacy policy content is being updated.');
      } finally {
        setLoading(false);
      }
    };

    fetchPrivacyPolicy();
  }, [toast]);

  const handleGoBack = () => {
    navigate('/');
  };

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async (newContent: string) => {
    try {
      // Use the RPC function for updating with proper typing
      const { error } = await supabase.rpc('update_privacy_policy', {
        new_content: newContent,
        policy_id: '00000000-0000-0000-0000-000000000001'
      });

      // Fallback if RPC doesn't exist
      if (error) {
        const { error: directError } = await supabase
          .from('privacy_policy')
          .update({ 
            content: newContent,
            updated_at: new Date().toISOString(),
            updated_by: user?.id,
          })
          .eq('id', '00000000-0000-0000-0000-000000000001');

        if (directError) {
          throw directError;
        }
      }

      setPolicyContent(newContent);
      setIsEditing(false);
      toast({
        title: 'Success',
        description: 'Privacy policy has been updated successfully.',
      });
    } catch (error) {
      console.error('Error updating privacy policy:', error);
      toast({
        title: 'Error',
        description: 'Could not update the privacy policy. Please try again later.',
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
                <BreadcrumbLink>Privacy Policy</BreadcrumbLink>
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
              {isEditing ? 'Cancel Editing' : 'Edit Privacy Policy'}
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
              initialContent={policyContent} 
              onSave={handleSave}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <MarkdownRenderer content={policyContent} />
          )}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
