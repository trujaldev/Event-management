import { Button } from '@mantine/core'
import { useNavigate } from 'react-router-dom'

import LeftArrow from '@/assets/svg/LeftArrow'

const BackButton = () => {
  const navigate = useNavigate()

  return (
    <Button
      leftSection={<LeftArrow />}
      className="rounded-full"
      onClick={() => navigate(-1)}
    >
      Back
    </Button>
  )
}

export default BackButton
