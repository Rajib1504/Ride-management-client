import RegisterForm from "@/modules/Authentication/RegisterForm";
const Register = () => {
  return (
    <div className="place-content-center">
  
      <div className="flex flex-col gap-4 p-6 md:p-10">
    
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <RegisterForm/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
