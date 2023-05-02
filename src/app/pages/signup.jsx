import React, { useState } from 'react'
import Head from 'next/head'
import Router from 'next/router'
import CardHeader from '../components/CardHeader'
import InputField from '../components/InputField'

/* middleware */
import {
    absoluteUrl,
    getAppCookies,
    verifyToken,
    setLogout,
} from '../middleware/utils';

export default function Signup(props) {
    const { baseApiUrl, profile } = props;
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const submitCreateAccount = async () => {
        if (password !== confirmPassword) {
            alert('Passwords do not match')
            return
        }
        
        // verify passwords match
        let newAccountData = {
            first_name: firstName, 
            last_name: lastName, 
            email: email,
            password: password
        }
        console.log(newAccountData)
        try {
            let response = await fetch(`${baseApiUrl}/create-user`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newAccountData),
            })
            console.log(response)
            await Router.push('/login')
        } catch (error) {
            console.error(error)
        }
    }

    function handleOnClickLogout(e) {
        setLogout(e);
    }

    return (
        <div className="w-full h-screen flex justify-center items-center bg-slate-100">
            <Head>
                <title>Signup | TurboGPT</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {!profile ? (
                <div className="flex flex-col sm:w-full w-10/12 max-w-md px-4 py-8 bg-white rounded-lg shadow dark:bg-gray-800 sm:px-6 md:px-8 lg:px-10">
                    <CardHeader
                        title={"Create a new account"}
                        subtitle={"Already have an account ?"}
                        subtitleHrefText={"Sign in"}
                        subtitleHref={"/login"}
                    />
                    <div className="p-6 mt-8">
                        <div className="form">
                            <div className="flex gap-4 mb-2">
                                <InputField
                                    type={"text"}
                                    id={"create-account-first-name"}
                                    required={true}
                                    name={"First Name"}
                                    placeholder={"First Name"}
                                    onChange={e => setFirstName(e.target.value)}
                                />
                                <InputField
                                    type={"text"}
                                    id={"create-account-last-name"}
                                    required={true}
                                    name={"Last Name"}
                                    placeholder={"Last Name"}
                                    onChange={e => setLastName(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col mb-2">
                                <InputField
                                    type={"email"}
                                    id={"create-account-email"}
                                    required={true}
                                    placeholder={"Email"}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col mb-2 mt-5">
                                <InputField
                                    type={"password"}
                                    id={"create-password"}
                                    required={"false"}
                                    placeholder={"Enter Password"}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col mb-2">
                                <InputField
                                    type={"password"}
                                    id={"confirm-password"}
                                    required={"false"}
                                    placeholder={"Enter Password"}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center justify-center">
                                <span className="ml-2 inline-flex items-center text-xs font-thin text-center text-gray-500 dark:text-gray-100">
                                    Passwords must be minimum 8 characters and contain 1 number and 1 special character
                                </span>
                            </div>
                            <div className="flex items-center justify-start mt-6">
                                <div>
                                    <label className="flex items-start mb-3 space-x-3">
                                        <input type="checkbox" name="checked-demo" required className="form-tick appearance-none bg-white bg-check h-6 w-6 border border-gray-300 rounded-md checked:bg-blue-500 checked:border-transparent focus:outline-none"/>
                                        <span className="font-normal text-gray-700 dark:text-white">
                                            I agree to the <a href="#" target="_blank" className="text-sm text-blue-500 underline hover:text-blue-700">Terms and Policy</a>
                                        </span>
                                    </label>
                                </div>
                            </div>
                            <div className="flex w-full my-4">
                                <button 
                                    onClick={() => submitCreateAccount()} 
                                    type="submit" 
                                    className="py-2 px-4  bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 focus:ring-offset-purple-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
                                >
                                    Create Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <a href="#" onClick={e => handleOnClickLogout(e)}>
                        &bull; Logout
                    </a>
                </div>
            )}
        </div>
    )
}


export async function getServerSideProps(context) {
    const { req } = context;
    const { origin } = absoluteUrl(req);
  
    const baseApiUrl = `${origin}/api`;
  
    const { turbogpt_session_token } = getAppCookies(req);
    const profile = turbogpt_session_token ? verifyToken(turbogpt_session_token.split(' ')[1]) : '';
    return {
        props: {
            baseApiUrl,
            profile,
        },
    };
}