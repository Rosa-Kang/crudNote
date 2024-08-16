import React from 'react'
import Navbar from '../../components/Navbar/Navbar';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div>
      <Navbar  />

      <div className='flex items-center justify-center mt-28'>
        <div>
          <form onSubmit={()=> {}}>
            <h4 className="text-2xl mb-7">Login</h4>

            <input type="text" className="input-box" placeholder='Email' />

            <button type="submit" className="btn-primary">
                Login
            </button>

            <p className="text-sm text-center mt-4">
              Not registerred yet?{" "}

              <Link to="/signup" className=""> Create an Account</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login