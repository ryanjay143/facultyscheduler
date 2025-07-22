import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";


const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <div className='flex items-center justify-center w-screen h-screen bg-background '>
      <div className='min-w-[300px] w-[50%] flex flex-col items-center'>
        <div className='flex items-center gap-3 '>
          <h1 className='text-4xl font-bold md:text-[30px] text-secondary-foreground'>404 not Found</h1>
        </div>
        <p className='mt-3 text-lg font-medium text-accent-foreground'>Oops! The page you are looking for does not exist.</p>
        <p className='font-light text-accent-foreground'>It might have been moved or deleted, or perhaps you mistyped the URL.</p>
        <Button onClick={handleGoBack} className="my-3 animate-pulse">
          <div className="flex gap-2 items-center">
          <ArrowLeftIcon className="h-4 w-4" /> Go Back
          </div>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;