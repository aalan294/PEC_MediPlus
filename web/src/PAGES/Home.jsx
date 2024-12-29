import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import * as THREE from 'three';

const Home = () => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const { scrollYProgress } = useScroll();
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 500]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.6]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);

  useEffect(() => {
    // Three.js setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    rendererRef.current = renderer;
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    const bgElement = document.getElementById('bg');
    if (bgElement && !bgElement.contains(renderer.domElement)) {
      bgElement.appendChild(renderer.domElement);
    }

    // Create animated background
    const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
    const material = new THREE.MeshStandardMaterial({ 
      color: 0x4A90E2,
      wireframe: true
    });
    const torus = new THREE.Mesh(geometry, material);
    scene.add(torus);

    // Add lighting
    const pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(5, 5, 5);
    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(pointLight, ambientLight);

    camera.position.z = 30;

    // Animation loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      torus.rotation.x += 0.01;
      torus.rotation.y += 0.005;
      torus.rotation.z += 0.01;
      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      
      const bgElement = document.getElementById('bg');
      if (bgElement && renderer.domElement && bgElement.contains(renderer.domElement)) {
        bgElement.removeChild(renderer.domElement);
      }
      
      // Dispose of Three.js resources
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  const styles = {
    container: {
      minHeight: '100vh',
      background: '#121212',
      color: '#ffffff',
      position: 'relative',
    },
    bgCanvas: {
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 0,
    },
    nav: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1.5rem 3rem',
      background: 'rgba(18, 18, 18, 0.95)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 2px 20px rgba(0, 0, 0, 0.3)',
      zIndex: 1000,
    },
    logo: {
      fontSize: '2rem',
      fontWeight: 'bold',
      background: 'linear-gradient(45deg, #4A90E2, #63B3ED)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    navLinks: {
      display: 'flex',
      gap: '2rem',
      listStyle: 'none',
    },
    navLink: {
      textDecoration: 'none',
      color: '#ffffff',
      fontWeight: '500',
      transition: 'color 0.3s ease',
      padding: '0.5rem 1rem',
      borderRadius: '4px',
      ':hover': {
        color: '#4A90E2',
        background: 'rgba(74, 144, 226, 0.1)',
      }
    },
    heroSection: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '8rem 4rem',
      position: 'relative',
      zIndex: 1,
    },
    heroContent: {
      maxWidth: '800px',
      textAlign: 'center',
    },
    heroTitle: {
      fontSize: '4rem',
      fontWeight: 'bold',
      marginBottom: '1.5rem',
      background: 'linear-gradient(45deg, #ffffff, #4A90E2)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginTop: '-200px',
    },
    heroSubtitle: {
      fontSize: '1.2rem',
      color: '#999',
      marginBottom: '2rem',
      lineHeight: 1.6,
    },
    ctaButtons: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
    },
    primaryBtn: {
      background: 'linear-gradient(45deg, #4A90E2, #63B3ED)',
      color: 'white',
      padding: '1rem 2rem',
      borderRadius: '8px',
      textDecoration: 'none',
      fontWeight: '500',
      transition: 'transform 0.3s ease',
      ':hover': {
        transform: 'translateY(-2px)',
      }
    },
    secondaryBtn: {
      background: 'transparent',
      border: '2px solid #4A90E2',
      color: '#4A90E2',
      padding: '1rem 2rem',
      borderRadius: '8px',
      textDecoration: 'none',
      fontWeight: '500',
      transition: 'transform 0.3s ease',
      ':hover': {
        transform: 'translateY(-2px)',
      }
    },
    featuresSection: {
      padding: '6rem 4rem',
      background: 'rgba(26, 26, 26, 0.9)',
      position: 'relative',
      zIndex: 1,
    },
    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '2rem',
    },
    featureCard: {
      background: 'rgba(36, 36, 36, 0.9)',
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
    },
    featureIcon: {
      fontSize: '2.5rem',
      marginBottom: '1rem',
    },
    blogSection: {
      padding: '6rem 4rem',
      background: 'rgba(18, 18, 18, 0.9)',
      position: 'relative',
      zIndex: 1,
    },
    blogPost: {
      background: 'rgba(36, 36, 36, 0.9)',
      padding: '2rem',
      borderRadius: '12px',
      marginTop: '2rem',
    },
    footer: {
      background: 'rgba(26, 26, 26, 0.9)',
      padding: '3rem 4rem',
      color: '#999',
      position: 'relative',
      zIndex: 1,
    },
    footerContent: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    blockchainStats: {
      display: 'flex',
      gap: '3rem',
    },
    stat: {
      textAlign: 'center',
    },
    statNumber: {
      display: 'block',
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#4A90E2',
    },
  };

  return (
    <div style={styles.container} ref={containerRef}>
      <div id="bg" style={styles.bgCanvas}></div>
      <nav style={styles.nav}>
        <h2 style={styles.logo}>MediPlus</h2>
        <ul style={styles.navLinks}>
          <li><Link to={'/doctor/login'} style={styles.navLink}>DOCTOR</Link></li>
          <li><Link to={'/hospital/login'} style={styles.navLink}>HOSPITAL</Link></li>
          <li><Link to={'/reception/login'} style={styles.navLink}>RECEPTIONIST</Link></li>
          <li><Link to={'/pharm/login'} style={styles.navLink}>PHARMACIST</Link></li>
          <li><Link to={'/hospital/request'} style={styles.navLink}>REGISTER HOSPITAL</Link></li>
          <li><Link to={'/pharm/request'} style={styles.navLink}>REGISTER PHARMACY</Link></li>
        </ul>
      </nav>

      <section style={styles.heroSection}>
        <motion.div 
          style={{
            ...styles.heroContent,
            y,
            opacity,
            scale
          }}
        >
          <h1 style={styles.heroTitle}>
            Next-Gen Healthcare on Blockchain
          </h1>
          <p style={styles.heroSubtitle}>
            Secure, Transparent, and Efficient Healthcare Solutions Powered by Blockchain Technology
          </p>
          <div style={styles.ctaButtons}>
            <Link to="/patient-login" style={styles.primaryBtn}>Connect Wallet</Link>
            <Link to="/learn-more" style={styles.secondaryBtn}>Learn More</Link>
          </div>
        </motion.div>
      </section>

      <section style={styles.featuresSection}>
        <motion.div 
          style={styles.featuresGrid}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🔒</div>
            <h3>Secure Health Records</h3>
            <p>Your medical data protected by blockchain technology</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>⚡</div>
            <h3>Instant Access</h3>
            <p>Quick and seamless appointment booking</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🔄</div>
            <h3>Smart Contracts</h3>
            <p>Automated and transparent healthcare processes</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>📱</div>
            <h3>Digital Identity</h3>
            <p>Secure digital healthcare identity management</p>
          </div>
        </motion.div>
      </section>

      <section style={styles.blogSection}>
        <h2>Understanding Blockchain in Healthcare</h2>
        <motion.div 
          style={styles.blogPost}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h3>How Blockchain Revolutionizes Healthcare Data Management</h3>
          <p>Blockchain technology provides a secure, decentralized way to store and manage healthcare records. 
             Through its immutable ledger system, patient data remains tamper-proof while being accessible to 
             authorized healthcare providers. Smart contracts automate compliance and consent management, 
             ensuring HIPAA compliance and patient privacy.</p>
          <div style={{marginTop: '2rem', display: 'flex', gap: '2rem'}}>
            <div>
              <h4>🔗 Decentralized Storage</h4>
              <p>Distributed ledger technology ensures data integrity and availability</p>
            </div>
            <div>
              <h4>📋 Smart Contracts</h4>
              <p>Automated execution of healthcare protocols and agreements</p>
            </div>
            <div>
              <h4>🔐 Cryptographic Security</h4>
              <p>Advanced encryption protecting sensitive medical information</p>
            </div>
          </div>
        </motion.div>
      </section>

      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <p>Copyrights © 2024 All Rights Reserved, Powered by <span style={{color: '#4A90E2'}}>MediPlus</span>.</p>
          <div style={styles.blockchainStats}>
            <div style={styles.stat}>
              <span style={styles.statNumber}>100K+</span>
              <span>Secure Transactions</span>
            </div>
            <div style={styles.stat}>
              <span style={styles.statNumber}>50+</span>
              <span>Partner Hospitals</span>
            </div>
            <div style={styles.stat}>
              <span style={styles.statNumber}>1M+</span>
              <span>Patient Records</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
