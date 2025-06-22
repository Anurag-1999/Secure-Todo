
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock } from 'lucide-react';

interface PinEntryProps {
  onPinVerified: (pin: string,user_name:string) => void;
}

export const PinEntry = ({ onPinVerified }: PinEntryProps) => {
  const [pin, setPin] = useState('');
  const [user_name, setUserName] = useState('')
  const [loading, setLoading] = useState(false);
  const [isVisibleUserNameInput,setIsVisibleUserNameInput] = useState(false)

  useEffect(()=>{

  },[isVisibleUserNameInput])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (pin.length < 4) {
      return;
    }

    setLoading(true);
    await onPinVerified(pin,user_name);
    setLoading(false);
    setPin('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Enter Your PIN</CardTitle>
          <CardDescription>
            Enter your PIN to access your Todo list
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
               {isVisibleUserNameInput && <Input
              type="user_name"
              value={user_name}
              onChange={(e) => setUserName(e.target.value.trim())}
              placeholder="Enter your UserName"
              maxLength={20}
              className="text-center text-2xl tracking-widest h-14"
              autoFocus
            />}
            <Input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter your PIN"
              maxLength={8}
              className="text-center text-2xl tracking-widest h-14"
              autoFocus
            />
            
            <Button 
              type="submit" 
              className="w-full h-12"
              disabled={loading || pin.length < 4}
            >
              {loading ? 'Verifying...' : 'Unlock'}
            </Button>
{!isVisibleUserNameInput &&  <Button 
              type="button" 
              className="w-full h-12"
              onClick={()=>{
                setIsVisibleUserNameInput(true)
              }}
             
            >Want to use UserName?</Button>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
