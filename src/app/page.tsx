import { Button } from '@/components/ui/button'
import { UserButton } from '@clerk/nextjs'
const page = () => {
  return (
    <div>
      <Button variant={"destructive"}>
        Click me
      </Button>
      <UserButton/>
    </div>
  )
}

export default page