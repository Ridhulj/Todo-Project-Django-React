import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Login() {

    const [formdata, setFormData ]=useState({})
    const navigate= useNavigate()

    const handleInput = (e)=>{
        const {name, value}=e.target;
        setFormData({
            ...formdata,
            [name]:value,
        })
    }

    const handleSubmit = async(e)=>{
        e.preventDefault();
        console.log(formdata)

        try{
            const response= await fetch('http://127.0.0.1:8000/user_login/',{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify(formdata)
            })
            if (response.ok){
                toast.success('Login Succesfull' +formdata.username,{
                    position: toast.POSITION.TOP_CENTER,
                    theme: 'colored'
                })
                navigate('/dash')

            }else{
                toast.error('Invalid Credentials',{
                    position:toast.POSITION.TOP_CENTER,
                    theme:'colored'
                })
            }
        }catch(error){
    }
    
    }
  return (

    <>
    <h2 className='text-center'>Login Here</h2>

    <div className='container shadow' style={{width: '30%', marginBottom: 50}}>
        <form onSubmit={handleSubmit}><div className='form-group p-3'>

                <label>Username</label>
                <input type='text' name='username' className='form-control' onChange={handleInput}></input>
            </div>

            <div className='form-group p-3'>
                <label>Password</label>
                <input type='password' name='password' className='form-control' onChange={handleInput}></input>

                <button type='submit' className='btn btn-primary' style={{marginBottom: 20, marginLeft:150}}>submit</button>
            </div>
        </form>
        <p style={{paddingBottom:20,paddingLeft:60}} ><b>Don't have an acccount</b><Link to={'/register'}>Register Here</Link></p>
    </div>
    </>
  )
}
