import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './components/Home/Home'
import Bank from './components/Banks/Bank'
import Hotels from './components/Hotels/Hotels'
import Restaurent from './components/Restaurent/Restaurent'
import Login from './components/Login/Login'
import Signup from './components/Signup/Signup'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import Layout from './components/Layout/Layout'
import Writereview from './components/Writereview/Writereview';
import Detail from './components/Imageslider/Detail';
import ScrollToTop from './components/ScrolllToTop/ScrollToTop';
import EditProfile from './components/Setting/EditProfile';
import Overview from './components/Setting/Overview';
import Postreview from './components/Postreview/Postreview';
import Review from './components/Review/Review';
import Reviews from './components/Reviews/Reviews';
import HotelDetail from './components/Hotels/HotelDetail';
import BankDetail from './components/Banks/BankDetail';
import RestaurentDetail from './components/Restaurent/RestaurentDetail';
import Hospital from './components/Hospitals/Hospital';
import HospitalDetail from './components/Hospitals/HospitalDetail';
import Homeservices from './components/Homeservices/Homeservices';
import HomeserviceDetail from './components/Homeservices/HomeserviceDetail';
import Institutions from './components/Institutions/Institutions';
import Feedback from './components/Feedback/Feedback';
import Service from './components/Feedback/Service';
import Rate from './components/Feedback/Rate';
import Scale from './components/Feedback/Scale';
import Last from './components/Feedback/Last';
import VerifyEmail from './components/VerifyEmail/VerifyEmail';
import Detailsinstitution from './components/Institutions/Detailsinstitution';


const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path='/verified' element={<VerifyEmail />} />
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='navbar' element={<Navbar />} />
          <Route path='footer' element={<Footer />} />
          <Route path='/institutions/:id' element={<Institutions />} />
          <Route path='/banks' element={<Bank />} />
          <Route path='/banks/:id' element={<BankDetail />} />
          <Route path='/hotels' element={<Hotels />} />
          <Route path='/hotels/:id' element={<HotelDetail />} />
          <Route path='/restaurents' element={<Restaurent />} />
          <Route path='restaurents/:id' element={<RestaurentDetail />} />
          <Route path='/hospitals' element={<Hospital />} />
          <Route path='/hospitals/:id' element={<HospitalDetail />} />
          <Route path='/homeservices' element={<Homeservices />} />
          <Route path='/homeservices/:id' element={<HomeserviceDetail />} />
          <Route path='login' element={<Login />} />
          <Route path='signup' element={<Signup />} />
          <Route path='review' element={<Writereview />} />
          <Route path='detail' element={<Detail />} />
          <Route path='overview' element={<Overview />} />
          <Route path='profile' element={<EditProfile />} />
          <Route path='/postreview/:id' element={<Postreview />} />
          <Route path='view' element={<Review />} />
          <Route path='Reviews' element={<Reviews />} />
          <Route path='feedback' element={<Feedback />} />
          <Route path='service' element={<Service />} />
          <Route path='rate' element={<Rate />} />
          <Route path='scale' element={<Scale />} />
          <Route path='last' element={<Last />} />
          <Route path='/detailsinstitution' element={<Detailsinstitution />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App
