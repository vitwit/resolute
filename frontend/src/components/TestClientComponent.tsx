'use client'
import { Button } from '@mui/material';
import { useTestContext } from '../provider/TestProvider'

export default function TestClientComponent() {
  
  const {userId, setUserId, data, setData} = useTestContext();
  console.log("user: ", userId, ", data: ", data);
  return (
    <div>client!
    <Button onClick={() => {setUserId("teja"); setData([{firstName:"sai"}])}}>click</Button>
    </div>
  )
}
