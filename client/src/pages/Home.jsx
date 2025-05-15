import React from 'react'
import Navbar from '../components/frontend/Navbar'
import Hero from '../components/frontend/Hero'
import Featured from '../components/frontend/Featured'
import Footer from '../components/frontend/Footer'
import Nav from '../components/frontend/Nav'
import FrontendLayout from '../layouts/FrontendLayout'
import Products from '../components/frontend/Products'

const Home = () => {
    return (
        <FrontendLayout>
            <div className=''>

            <Hero />
            </div>
            <Products />

        </FrontendLayout>

    )
}

export default Home