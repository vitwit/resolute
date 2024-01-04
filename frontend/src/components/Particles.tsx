import { useCallback } from 'react';
import Particles from 'react-particles';
import { Engine } from 'tsparticles-engine';
import { loadSlim } from 'tsparticles-slim';

const CustomParticles = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        particles: {
          number: {
            value: 20,
            density: {
              enable: false,
              value_area: 800,
            },
          },
          color: {
            value: '#fff',
          },
          shape: {
            type: 'circle',
            options: {},
          },
          opacity: {
            value: 0.8,
            random: false,
            anim: {
              enable: false,
              speed: 1,
              opacity_min: 0.1,
              sync: false,
            },
          },
          size: {
            value: 4,
            random: false,
            anim: {
              enable: false,
              speed: 40,
              size_min: 0.1,
              sync: false,
            },
          },
          rotate: {
            value: 0,
            random: true,
            direction: {
              enable: true,
              speed: 5,
              sync: false,
            },
          },
          line_linked: {
            enable: true,
            distance: 400,
            color: '#ffffff',
            opacity: 0.4,
            width: 2,
          },
          move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            attract: {
              enable: false,
              rotateX: 600,
              rotateY: 1200,
            },
          },
        },
        interactivity: {
          events: {
            onhover: {
              enable: true,
              mode: ['grab'],
            },
            onclick: {
              enable: false,
              mode: 'bubble',
            },
            resize: true,
          },
          modes: {
            grab: {
              distance: 400,
              line_linked: {
                opacity: 1,
              },
            },
            bubble: {
              distance: 400,
              size: 40,
              duration: 2,
              opacity: 8,
              speed: 3,
            },
            remove: {
              particles_nb: 2,
            },
          },
        },
        retina_detect: true,
        background: {
          color: '',
          image: '',
          position: '50% 50%',
          repeat: 'no-repeat',
          size: 'cover',
        },
      }}
    />
  );
};

export default CustomParticles;
