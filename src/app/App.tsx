import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, RotateCcw } from 'lucide-react';

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showPalms, setShowPalms] = useState(true);
  const [showClosingPalms, setShowClosingPalms] = useState(false);
  const [showRestart, setShowRestart] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const slides = [
  { id: 1, image: '/photos/foto1.png', duration: 8000 },
  { id: 2, image: '/photos/foto2.png', duration: 8000, hasPhoto: true },
  { id: 3, image: '/photos/foto3.png', duration: 15000 },
  { id: 4, image: '/photos/foto4.png', duration: 12000 },
  { id: 5, image: '/photos/foto5.png', duration: 8000 },
  { id: 6, image: '/photos/foto6.png', duration: 8000 },
];

  useEffect(() => {
    // Intentar reproducir música al cargar
    const tryPlayAudio = () => {
      if (audioRef.current && !audioStarted) {
        audioRef.current.play()
          .then(() => {
            setAudioStarted(true);
          })
          .catch(err => {
            console.log('Autoplay prevented, click to start audio:', err);
          });
      }
    };

    tryPlayAudio();

    // Intentar de nuevo al primer click o touch
    const handleInteraction = () => {
      tryPlayAudio();
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);

    // Ocultar palmeras después de 2 segundos
    const palmsTimer = setTimeout(() => {
      setShowPalms(false);
    }, 2000);

    return () => {
      clearTimeout(palmsTimer);
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, [audioStarted]);

  useEffect(() => {
    if (showPalms || showClosingPalms || showRestart) return;

    // Cambiar slides automáticamente
    if (currentSlide < slides.length - 1) {
      const timer = setTimeout(() => {
        setCurrentSlide(currentSlide + 1);
      }, slides[currentSlide].duration);

      return () => clearTimeout(timer);
    } else {
      // Última imagen terminó, mostrar palmeras cerrándose
      const timer = setTimeout(() => {
        setShowClosingPalms(true);
        // Después de cerrar palmeras, mostrar botón de reinicio
        setTimeout(() => {
          setShowRestart(true);
        }, 2000);
      }, slides[currentSlide].duration);

      return () => clearTimeout(timer);
    }
  }, [currentSlide, showPalms, showClosingPalms, showRestart]);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const restartExperience = () => {
    setShowRestart(false);
    setShowClosingPalms(false);
    setShowPalms(true);
    setCurrentSlide(0);
    
    // Reiniciar audio
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }

    // Ocultar palmeras después de 2 segundos
    setTimeout(() => {
      setShowPalms(false);
    }, 2000);
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-b from-orange-400 via-orange-500 to-orange-600 flex items-center justify-center relative">
      {/* Audio de fondo */}
      <audio ref={audioRef} loop>
        <source src="/music/cumpleanos.mp3" type="audio/mpeg" />
        <source src="/music/cumpleanos.wav" type="audio/wav" />
        <source src="/music/cumpleanos.ogg" type="audio/ogg" />
      </audio>

      {/* Botón de control de audio */}
      {!showPalms && !showRestart && (
        <button
          onClick={toggleMute}
          className="absolute top-4 left-4 z-50 w-12 h-12 bg-white/30 hover:bg-white/50 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
          aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
        >
          {isMuted ? (
            <VolumeX className="w-6 h-6 text-white" />
          ) : (
            <Volume2 className="w-6 h-6 text-white" />
          )}
        </button>
      )}

      {/* Palmeras animadas de apertura */}
      <AnimatePresence>
        {showPalms && (
          <>
            {/* Palmera izquierda */}
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="absolute left-0 top-0 h-full w-1/2 bg-gradient-to-r from-green-900 via-green-800 to-transparent z-50 flex items-start justify-start p-8"
            >
              <svg viewBox="0 0 200 400" className="h-full w-auto">
                {/* Hojas de palmera izquierda */}
                <ellipse cx="100" cy="80" rx="90" ry="15" fill="#2d5016" opacity="0.8" transform="rotate(-30 100 80)" />
                <ellipse cx="100" cy="70" rx="85" ry="14" fill="#3a6b1f" opacity="0.9" transform="rotate(-45 100 70)" />
                <ellipse cx="100" cy="90" rx="88" ry="14" fill="#2d5016" opacity="0.8" transform="rotate(-15 100 90)" />
                <ellipse cx="100" cy="75" rx="92" ry="15" fill="#4a7c2f" transform="rotate(-60 100 75)" />
                <ellipse cx="100" cy="85" rx="87" ry="14" fill="#3a6b1f" opacity="0.85" transform="rotate(0 100 85)" />
                <ellipse cx="100" cy="95" rx="83" ry="13" fill="#2d5016" opacity="0.8" transform="rotate(15 100 95)" />
                {/* Tronco */}
                <rect x="95" y="100" width="10" height="300" fill="#5d4e37" />
                <rect x="93" y="150" width="14" height="4" fill="#4a3c2a" />
                <rect x="93" y="200" width="14" height="4" fill="#4a3c2a" />
                <rect x="93" y="250" width="14" height="4" fill="#4a3c2a" />
                <rect x="93" y="300" width="14" height="4" fill="#4a3c2a" />
              </svg>
            </motion.div>

            {/* Palmera derecha */}
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-green-900 via-green-800 to-transparent z-50 flex items-start justify-end p-8"
            >
              <svg viewBox="0 0 200 400" className="h-full w-auto">
                {/* Hojas de palmera derecha */}
                <ellipse cx="100" cy="80" rx="90" ry="15" fill="#2d5016" opacity="0.8" transform="rotate(30 100 80)" />
                <ellipse cx="100" cy="70" rx="85" ry="14" fill="#3a6b1f" opacity="0.9" transform="rotate(45 100 70)" />
                <ellipse cx="100" cy="90" rx="88" ry="14" fill="#2d5016" opacity="0.8" transform="rotate(15 100 90)" />
                <ellipse cx="100" cy="75" rx="92" ry="15" fill="#4a7c2f" transform="rotate(60 100 75)" />
                <ellipse cx="100" cy="85" rx="87" ry="14" fill="#3a6b1f" opacity="0.85" transform="rotate(0 100 85)" />
                <ellipse cx="100" cy="95" rx="83" ry="13" fill="#2d5016" opacity="0.8" transform="rotate(-15 100 95)" />
                {/* Tronco */}
                <rect x="95" y="100" width="10" height="300" fill="#5d4e37" />
                <rect x="93" y="150" width="14" height="4" fill="#4a3c2a" />
                <rect x="93" y="200" width="14" height="4" fill="#4a3c2a" />
                <rect x="93" y="250" width="14" height="4" fill="#4a3c2a" />
                <rect x="93" y="300" width="14" height="4" fill="#4a3c2a" />
              </svg>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Palmeras cerrándose al final */}
      <AnimatePresence>
        {showClosingPalms && (
          <>
            {/* Palmera izquierda cerrándose */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="absolute left-0 top-0 h-full w-1/2 bg-gradient-to-r from-green-900 via-green-800 to-transparent z-50 flex items-start justify-start p-8"
            >
              <svg viewBox="0 0 200 400" className="h-full w-auto">
                {/* Hojas de palmera izquierda */}
                <ellipse cx="100" cy="80" rx="90" ry="15" fill="#2d5016" opacity="0.8" transform="rotate(-30 100 80)" />
                <ellipse cx="100" cy="70" rx="85" ry="14" fill="#3a6b1f" opacity="0.9" transform="rotate(-45 100 70)" />
                <ellipse cx="100" cy="90" rx="88" ry="14" fill="#2d5016" opacity="0.8" transform="rotate(-15 100 90)" />
                <ellipse cx="100" cy="75" rx="92" ry="15" fill="#4a7c2f" transform="rotate(-60 100 75)" />
                <ellipse cx="100" cy="85" rx="87" ry="14" fill="#3a6b1f" opacity="0.85" transform="rotate(0 100 85)" />
                <ellipse cx="100" cy="95" rx="83" ry="13" fill="#2d5016" opacity="0.8" transform="rotate(15 100 95)" />
                {/* Tronco */}
                <rect x="95" y="100" width="10" height="300" fill="#5d4e37" />
                <rect x="93" y="150" width="14" height="4" fill="#4a3c2a" />
                <rect x="93" y="200" width="14" height="4" fill="#4a3c2a" />
                <rect x="93" y="250" width="14" height="4" fill="#4a3c2a" />
                <rect x="93" y="300" width="14" height="4" fill="#4a3c2a" />
              </svg>
            </motion.div>

            {/* Palmera derecha cerrándose */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-green-900 via-green-800 to-transparent z-50 flex items-start justify-end p-8"
            >
              <svg viewBox="0 0 200 400" className="h-full w-auto">
                {/* Hojas de palmera derecha */}
                <ellipse cx="100" cy="80" rx="90" ry="15" fill="#2d5016" opacity="0.8" transform="rotate(30 100 80)" />
                <ellipse cx="100" cy="70" rx="85" ry="14" fill="#3a6b1f" opacity="0.9" transform="rotate(45 100 70)" />
                <ellipse cx="100" cy="90" rx="88" ry="14" fill="#2d5016" opacity="0.8" transform="rotate(15 100 90)" />
                <ellipse cx="100" cy="75" rx="92" ry="15" fill="#4a7c2f" transform="rotate(60 100 75)" />
                <ellipse cx="100" cy="85" rx="87" ry="14" fill="#3a6b1f" opacity="0.85" transform="rotate(0 100 85)" />
                <ellipse cx="100" cy="95" rx="83" ry="13" fill="#2d5016" opacity="0.8" transform="rotate(-15 100 95)" />
                {/* Tronco */}
                <rect x="95" y="100" width="10" height="300" fill="#5d4e37" />
                <rect x="93" y="150" width="14" height="4" fill="#4a3c2a" />
                <rect x="93" y="200" width="14" height="4" fill="#4a3c2a" />
                <rect x="93" y="250" width="14" height="4" fill="#4a3c2a" />
                <rect x="93" y="300" width="14" height="4" fill="#4a3c2a" />
              </svg>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Botón Volver al Inicio */}
      <AnimatePresence>
        {showRestart && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-50 flex items-center justify-center"
          >
            <button
              onClick={restartExperience}
              className="bg-white hover:bg-gray-100 text-orange-600 px-8 py-4 rounded-full text-xl font-bold shadow-2xl flex items-center gap-3 transition-all duration-300 hover:scale-110"
            >
              <RotateCcw className="w-6 h-6" />
              Volver al Inicio
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenedor de slides */}
      {!showPalms && !showClosingPalms && !showRestart && (
        <div className="w-full h-full flex items-center justify-center px-4 py-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="w-full h-full flex items-center justify-center relative"
            >
              <img
                src={slides[currentSlide].image}
                alt={`Slide ${currentSlide + 1}`}
                className="max-w-full max-h-full w-auto h-auto object-contain"
              />
              
              {/* Foto circular del cumpleañero - solo en la segunda imagen */}
              {slides[currentSlide].hasPhoto && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                  className="absolute top-[8%] left-1/2 transform -translate-x-1/2"
                  style={{ zIndex: 10 }}
                >
                  <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full border-4 border-yellow-400 shadow-2xl overflow-hidden bg-white">
                    <img
                      src="/photos/cumpleanero.jpg"
                      alt="Cumpleañero"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback si no hay foto
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ccircle cx="50" cy="50" r="50" fill="%23FFA500"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" font-size="40" fill="white"%3E👑%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Indicadores de progreso */}
      {!showPalms && !showClosingPalms && !showRestart && (
        <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 md:gap-3 z-10">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 md:h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'w-8 md:w-12 bg-white'
                  : 'w-2 md:w-3 bg-white/50'
              }`}
            />
          ))}
        </div>
      )}

      {/* Partículas flotantes decorativas */}
      {!showPalms && !showClosingPalms && !showRestart && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-yellow-300 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: -20,
                opacity: 0.5,
              }}
              animate={{
                y: window.innerHeight + 20,
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}