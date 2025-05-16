import React from 'react'
import Navbar from '../components/frontend/Navbar'
import Hero from '../components/frontend/Hero'
import Featured from '../components/frontend/Featured'
import Footer from '../components/frontend/Footer'
import Nav from '../components/frontend/Nav'
import FrontendLayout from '../layouts/FrontendLayout'
import Products from '../components/frontend/Products'
import { useSelector } from 'react-redux'
import { PersonalRecommendations } from '../components/frontend/PersonalRecommendations'
import { PopularProducts } from '../components/frontend/PopularProducts'

const Home = () => {
     const { isAuthenticated,user,isLoading } = useSelector((state) => state.auth);
     if(isLoading) return <div>Loading...</div>
    return (
        <FrontendLayout>
            <div className=''>

            <Hero />
            </div>
            <Products />
            {console.log({isAuthenticated,user,id:user?.userId})}
{isAuthenticated &&user?.userId && <PersonalRecommendations userId={user?.userId} />}
{isAuthenticated &&user?.userId && <PopularProducts userId={user?.userId} />}
        </FrontendLayout>

    )
}

export default Home