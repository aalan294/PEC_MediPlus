import React from 'react'
import { Routes, Route} from 'react-router-dom';
import Home from './PAGES/Home'

//admin
import AdminLogin from './PAGES/admin/AdminLogin'
import AdminDashBoard from './PAGES/admin/AdminDashBoard'
import NewHospital from './PAGES/admin/NewHospital';
import NewPharmacy from './PAGES/admin/NewPharmacy'

//hospital
import HospitalLogin from './PAGES/hospital/HospitalLogin';
import HospitalDashBoard from './PAGES/hospital/HospitalDashBoard';
import HospitalRequest from './PAGES/hospital/HospitalRequest';
import NewDoctor from './PAGES/hospital/NewDoctor';
import NewReceptionist from './PAGES/hospital/NewReceptionist';
import UnverifiedH from './PAGES/hospital/UnverifiedH';

//reception
import ReceptionLogin from './PAGES/reception/ReceptionLogin'
import ReceptionSearch from './PAGES/reception/ReceptionSearch'
import NewPatient from './PAGES/reception/NewPatient'
import NewPrescription from './PAGES/reception/NewPrescription'

//doctor
import DoctorLogin from './PAGES/doctor/DoctorLogin'
import DoctorDashboard from './PAGES/doctor/DoctorDashboard'
import DoctorSearch from './PAGES/doctor/PatientSearch'
import DoctorAnalysis from './PAGES/doctor/PatientAnalysis'

//pharmacy
import PharmacyRequest from './PAGES/pharmacy/PharmacyRequest';
import PharmacyLogin from './PAGES/pharmacy/PharmacyLogin'
import PharmacyDashboard from './PAGES/pharmacy/PharmacyDashboard'
import ScannerLogin from './PAGES/pharmacy/ScannerLogin'
import UpdatePrescription from './PAGES/pharmacy/UpdatePrescription'
import UnverifiedP from './PAGES/pharmacy/UnverifiedP';
import PatientLogin from './PAGES/patient/PatientLogin';
import PatientDashboard from './PAGES/patient/PatientDashboard';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>} ></Route>

        {/* admin Routes */}
         <Route path='/admin/login' element={<AdminLogin/>}/> {/* done */}
        <Route path='/admin/dashboard' element={<AdminDashBoard/>} />  {/* done */}

        <Route path='/admin/new-hos' element={<NewHospital/>} />  {/* done */}

        <Route path='/admin/new-pharm' element={<NewPharmacy/>} />   {/* done */}


        {/* hospital routes */}
        <Route path='/hospital/request' element={<HospitalRequest/>} />  {/* done */}
        <Route path='/hospital/login' element={<HospitalLogin/>} />      {/*done */}                                        
        <Route path='/hospital/dashboard' element={<HospitalDashBoard/>} />{/*done */}
        <Route path='/hospital/new-doc' element={<NewDoctor/>} /> {/* done */}
        <Route path='/hospital/new-recep' element={<NewReceptionist/>} /> {/* done */}
        <Route path='/hospital/unverified' element={<UnverifiedH/>} />  {/* done */}

        {/* Reception Routes */}
        <Route path='/reception/login' element={<ReceptionLogin/>} /> {/* done */}
        <Route path='/reception/dashboard' element={<ReceptionSearch/>} /> {/* done */}
        <Route path='/reception/new-case' element={<NewPatient/>} /> {/* done */}
        <Route path='/reception/old-case/:id' element={<NewPrescription/>} /> {/* done */}

        {/* Doctor Routes */}
        <Route path='/doctor/login' element={<DoctorLogin/>} /> {/* done */}
        <Route path='/doctor/dashboard' element={<DoctorDashboard/>} /> {/* done */}
        <Route path='/doctor/search' element={<DoctorSearch/>} /> {/* done */}
        <Route path='/doctor/analyse/:id' element={<DoctorAnalysis/>} /> {/* done */}

        {/* Pharmacy Routes */}
        <Route path='/pharm/request' element={<PharmacyRequest/>} />  {/* done */}
        <Route path='/pharm/login' element={<PharmacyLogin/>} />                {/*done */}                           
        <Route path='/pharm/dashboard' element={<PharmacyDashboard/>} />        {/*done */}                             
        <Route path='/pharm/scanner/:id' element={<ScannerLogin/>} />  {/* done */}

        <Route path='/pharm/complete-pres' element={<UpdatePrescription/>} />  {/* done */}
        <Route path='/pharm/unverified' element={<UnverifiedP/>} /> {/* done */}


        {/*Patient Router */}

        <Route path='/patient-login' element={<PatientLogin/>} />
        <Route path='/patient/dashboard' element={<PatientDashboard/>} />

      </Routes>
    </div>
  )
}

export default App