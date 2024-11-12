"use client";
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation';
import { ORCHESTRATOR_URL } from '@/lib/utils';

export default function Component() {
  const [classCode, setClassCode] = useState('')
  const navigator = useRouter();

  const handleJoin = async () => {
    const code_res = await fetch(`${ORCHESTRATOR_URL}/class/resolve/${classCode}`);
    const code_data = await code_res.json();
    if(code_data.error){
      alert(code_data.msg);
      return;
    }
    navigator.push(`/join/${classCode}`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Join a Class</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="classCode" className="text-sm font-medium text-gray-700">
                Class Code
              </label>
              <Input
                id="classCode"
                placeholder="Enter class code"
                value={classCode}
                onChange={(e) => setClassCode(e.target.value)}
              />
            </div>
            <Button 
              className="w-full" 
              onClick={handleJoin}
              disabled={!classCode.trim()}
            >
              Join
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}