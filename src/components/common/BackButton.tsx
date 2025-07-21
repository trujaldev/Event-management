import { Button } from '@mantine/core'
import { FaArrowLeftLong } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom'

const BackButton = () => {
  const navigate = useNavigate()

  return (
    <Button
      leftSection={<FaArrowLeftLong />}
      className="rounded-full"
      onClick={() => navigate(-1)}
    >
      Back
    </Button>
  )
}

export default BackButton
