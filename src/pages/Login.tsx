import Logo from '@/assets/Logo';
import LoginForm from '@/modules/Authentication/LoginForm';
import loginImage from '@/assets/l.jpg'
import { Link } from 'react-router';

const Login = () => {
      return (
           <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
          <Link to="/" className="flex items-center gap-2 font-medium">
         <Logo/>
          </Link>
        <div className="flex justify-center gap-2 md:justify-start">
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src={loginImage}
          alt="Image"
          className=" inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
      );
};

export default Login;