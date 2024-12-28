import React from 'react';
import './home.css'
import landingImage from '../ASSETS/home3.jpg';
import consultantImage1 from '../ASSETS/wp2655111-medical-doctor-wallpaper.jpg';
import consultantImage2 from '../ASSETS/wp2968626-medical-doctor-wallpaper-hd.jpg';
import consultantImage3 from '../ASSETS/wp2655110-medical-doctor-wallpaper.jpg';
import consultantImage4 from '../ASSETS/wp11422571-doctor-girl-wallpapers.jpg';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
     
      <nav className="nav2">
        <h2>MediSphere</h2>
        <ul>
          <li><Link to={'/doctor/login'} >DOCTOR</Link></li>
          <li><Link to={'/hospital/login'} >HOSPITAL</Link></li>
          <li><Link to={'/reception/login'} >RECEPTIONIST</Link></li>
          <li><Link to={'/pharm/login'} >PHARMACIST</Link></li>
          <li><Link to={'/hospital/request'} >RegisterHospital</Link></li>
          <li><Link to={'/pharm/request'} >RegisterPharmacy</Link></li>
          <li><Link to={'/patient-login'} >Patient</Link></li>
        </ul>
      </nav>
      <section>
        <img src={landingImage} alt="" className="landingimg" />
        <div className="details">
          <h1>Hospitals Providing total HealthCare <span>Solutions</span></h1>
          <p>Denouncing pleasure and praising pain was born and we will give you a complete account of the system</p>
        </div>
      </section>
      {/* <footer className="footer1">
        <div className="about">
          <h1>About Us</h1>
          <p>The relentless service of Hospitals in the past 25 years taken health care to the most modern levels in the region catering to urban & rural.</p>
          <br />
          <p>A Health Care Provider of Western Approach, Hospitals is the most trusted multispecialty hospital.</p>
        </div>
        <div className="links">
          <h1>Reference Links</h1>
          <div className="lists">
            <ul>
              <li>About Us</li>
              <li>Consultants</li>
              <li>Working Hours</li>
              <li>FAQ's</li>
              <li>Services</li>
              <li>Appointments</li>
            </ul>
          </div>
        </div>
        <div className="contact">
          <h1>Contact Details</h1>
          <li>SRM University, Ramapuram, Chennai-600089</li>
          <li>+91 8524889202</li>
        </div>
      </footer> */}
      <footer className="footer2">
        <p>Copyrights © 2024 All Rights Reserved, Powered by <span>MediSphere</span>.</p>
      </footer>
    </div>
  );
};

export default Home;
