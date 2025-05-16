import React from 'react'
import hero from "../../assets/hero.png"
import { Link } from 'react-router-dom'

const Hero = () => {
    return (
        // <main className="dark:bg-gray-800 bg-white relative overflow-hidden h-screen">
      
        // <div className="bg-white dark:bg-gray-800 flex relative z-20 items-center overflow-hidden">
        <div className=" flex flex-col-reverse items-center max-w-screen-xl  mx-auto md:flex-row ">
   
        <div className="flex items-center py-5 md:w-1/2 md:pb-20 md:pt-10 md:pr-10">
            <div className="text-left">
                <h2 className="text-4xl font-extrabold leading-10 tracking-tight text-gray-800 sm:text-5xl sm:leading-none md:text-6xl">
                    Sneaker <span className="font-bold text-blue-500">Head</span>
                </h2>
                <p className="max-w-md mx-auto mt-3 text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
             Lace Up. Stand Out.
                </p>
                <div className="mt-5 sm:flex md:mt-8">
                    <div className="rounded-md shadow">
                        <Link to="/products" className="flex items-center justify-center w-full px-8 py-3 text-base font-medium leading-6 text-white transition duration-150 ease-in-out bg-blue-500 border border-transparent rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue md:py-4 md:text-lg md:px-10">
                          Shop Now
                        </Link>
                    </div>
                    
                </div>
            </div>
        </div>

        <div className="flex items-center py-5 md:w-1/2 md:pb-20 md:pt-10 md:pl-10">
            <div className="relative w-full p-3 rounded md:p-8">
                <div className="rounded-lg bg-white text-black w-full">
                    <img src={hero} alt="Hero Image" />
                </div>
            </div>
        </div>
    </div>

    )
}

export default Hero