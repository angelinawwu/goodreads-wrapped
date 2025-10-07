import React, { useRef, useEffect } from 'react';
import './1_WelcomePage.css';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// 3D Book Component
const BookModel: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationRef = useRef<number | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    
    // Check if canvas already exists
    if (mountRef.current.querySelector('canvas')) {
      console.log('Canvas already exists, skipping initialization');
      return;
    }

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, 400 / 500, 0.1, 1000);
    camera.position.z = 3;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(400, 500);
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;
    
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Overhead light
    const overheadLight = new THREE.DirectionalLight(0xffffff, 0.8);
    overheadLight.position.set(0, 5, 2);
    scene.add(overheadLight);

    // Optional: Add a subtle point light for highlights
    const pointLight = new THREE.PointLight(0xffffff, 0.4);
    pointLight.position.set(-2, 2, 3);
    scene.add(pointLight);

    // Animation loop
    const animate = () => {
      if (modelRef.current) {
        modelRef.current.rotation.y += 0.01;
      }
      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };

    // Load GLTF model
    const loader = new GLTFLoader();
    loader.load(
      '/src/assets/old_book_(GLTF).gltf',
      (gltf) => {
        console.log('GLTF model loaded successfully:', gltf);
        const model = gltf.scene;
        model.scale.set(5, 5, 5);
        model.position.y = -0.5;
        scene.add(model);
        modelRef.current = model;
      },
      (progress) => {
        console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
      },
      (error) => {
        console.error('Error loading GLTF model:', error);
        // Fallback: create a simple book geometry
        const geometry = new THREE.BoxGeometry(2, 3, 0.6);
        const material = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const book = new THREE.Mesh(geometry, material);
        book.position.y = -0.5;
        scene.add(book);
        modelRef.current = book;
      }
    );

    // Start animation loop
    animate();

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (mountRef.current && renderer.domElement && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      modelRef.current = null;
      rendererRef.current = null;
      sceneRef.current = null;
    };
  }, []);

  return <div ref={mountRef} className="book-model" />;
};

interface WelcomePageProps {
  username: string;
  loading: boolean;
  onUsernameChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({
  username,
  loading,
  onUsernameChange,
  onSubmit
}) => {
  return (
    <div className="page-container">
      <div className="welcome-layout">
        {/* Left Side - Content */}
        <div className="welcome-content">
          <motion.h1 className="welcome-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Goodreads Wrapped 2025
          </motion.h1>
          <motion.p className="subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Discover your reading year in review!
          </motion.p>
            
          <form onSubmit={onSubmit} className="username-form">
            <motion.div className="input-group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <label htmlFor="username">Goodreads Username:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => onUsernameChange(e.target.value)}
                placeholder="Enter your Goodreads username"
                disabled={loading}
              />
            </motion.div>
            <motion.button className="submit-button"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              type="submit"
              disabled={loading || !username.trim()}
            >
              {loading ? 'Analyzing...' : 'Get My Reading Stats'}
            </motion.button>
          </form>
        </div>

        {/* Right Side - 3D Book Model */}
        <div className="welcome-book">
          <motion.div 
            className="book-container"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <BookModel />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
