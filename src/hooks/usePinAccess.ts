
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const usePinAccess = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [hasPin, setHasPin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Check if a PIN exists
  const checkPinExists = async () => {
    try {
      const { data, error } = await supabase
        .from('todo_pins')
        .select('id')
        .eq('user_id', 'default_user')
        .limit(1);

      if (error) throw error;
      setHasPin(data && data.length > 0);
    } catch (error) {
      console.error('Error checking PIN:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create a new PIN
  const createPin = async (pin: string, accessTime: number) => {
    try {
      // Simple hash function for demo purposes (in production, use proper hashing)
      const pinHash = btoa(pin);
      
      const { error } = await supabase
        .from('todo_pins')
        .insert([
          {
            user_id: 'default_user',
            pin_hash: pinHash,
            access_time: accessTime
          }
        ]);

      if (error) throw error;

      setHasPin(true);
      setIsUnlocked(true);
      
      toast({
        title: "Success",
        description: "PIN created successfully!",
      });

      // Auto-lock after specified time
      setTimeout(() => {
        setIsUnlocked(false);
      }, accessTime * 60 * 1000);

      return true;
    } catch (error) {
      console.error('Error creating PIN:', error);
      toast({
        title: "Error",
        description: "Failed to create PIN. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Verify PIN
  const verifyPin = async (pin: string) => {
    try {
      const pinHash = btoa(pin);
      
      const { data, error } = await supabase
        .from('todo_pins')
        .select('access_time')
        .eq('user_id', 'default_user')
        .eq('pin_hash', pinHash)
        .single();

      if (error || !data) {
        toast({
          title: "Error",
          description: "Invalid PIN. Please try again.",
          variant: "destructive",
        });
        return false;
      }

      setIsUnlocked(true);
      
      toast({
        title: "Success",
        description: "Access granted!",
      });

      // Auto-lock after specified time
      setTimeout(() => {
        setIsUnlocked(false);
      }, data.access_time * 60 * 1000);

      return true;
    } catch (error) {
      console.error('Error verifying PIN:', error);
      toast({
        title: "Error",
        description: "Failed to verify PIN. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Lock the app
  const lock = () => {
    setIsUnlocked(false);
  };

  useEffect(() => {
    checkPinExists();
  }, []);

  return {
    isUnlocked,
    hasPin,
    loading,
    createPin,
    verifyPin,
    lock
  };
};
