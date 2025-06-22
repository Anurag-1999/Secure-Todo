
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Lock } from 'lucide-react';

interface PinSetupProps {
  onPinCreated: (pin: string, accessTime: number) => void;
}

export const PinSetup = ({ onPinCreated }: PinSetupProps) => {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [accessTime, setAccessTime] = useState('60');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (pin.length < 4) {
      alert('PIN must be at least 4 digits');
      return;
    }
    
    if (pin !== confirmPin) {
      alert('PINs do not match');
      return;
    }

    setLoading(true);
    await onPinCreated(pin, parseInt(accessTime));
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Set Up Your PIN</CardTitle>
          <CardDescription>
            Create a PIN to secure your Todo list
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="pin">PIN (4+ digits)</Label>
              <Input
                id="pin"
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter your PIN"
                maxLength={8}
                className="text-center text-lg tracking-widest"
              />
            </div>
            
            <div>
              <Label htmlFor="confirmPin">Confirm PIN</Label>
              <Input
                id="confirmPin"
                type="password"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                placeholder="Confirm your PIN"
                maxLength={8}
                className="text-center text-lg tracking-widest"
              />
            </div>

            <div>
              <Label htmlFor="accessTime">Auto-lock after</Label>
              <Select value={accessTime} onValueChange={setAccessTime}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                  <SelectItem value="240">4 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={loading || pin.length < 4 || pin !== confirmPin}
            >
              {loading ? 'Creating...' : 'Create PIN'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
