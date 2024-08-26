import React, { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import PasswordInput from '../../components/Input/PasswordInput';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../api/index'
import { validateEmail } from '../../utils/helper';

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

  const handleSignup = async (e) => {
    e.preventDefault();

    if(!name){
      setError("Please enter the name.");
      return;
    }

    if(!validateEmail(email)){
      setError("Please enter a valid Email address.");
      return;
    }

    if(!password){
      setError("Please enter the password.");
      return;
    }

    setError("");

    // SignUp API call
    try {
      console.log(name, email, password); // 요청 내용 확인
      const response = await API.post("/user/signup", {
        fullName : name,
        email: email,
        password: password,
      });

      if(response.data && response.data.error) {
        setError(response.data.message)
        return
      }

      if(response.data && response.data.accessToken){
        localStorage.setItem("token", response.data.accessToken)
        navigate('/');
      }
    } catch (error) {
      if(error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occured. Please try again.")
      }
    }
  }
  return (
    <div>
      <Navbar  />

      <div className='flex items-center justify-center mt-28'>
        <div className='w-96 border rounded bg-white px-7 py-10'>
          <form onSubmit={handleSignup}>
            <h4 className="text-2xl mb-7">Sign up</h4>

            <input 
              type="text" 
              className="input-box" 
              placeholder='Name'
              value={name}
              onChange={(e)=> setName(e.target.value)}
             />

            <input 
              type="text" 
              className="input-box" 
              placeholder='Email'
              value={email}
              onChange={(e)=> setEmail(e.target.value)}
             />

            <PasswordInput
              value= {password}
              onChange={(e) => setPassword(e.target.value)}
             />


            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

            <button type="submit" className="btn-primary">
                Create an Account
            </button>

            <p className="text-sm text-center mt-4">
              Already have an account?{" "}

              <Link to="/login" className="font-medium text-primary underline"> Login </Link>
            </p>
            
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignUp