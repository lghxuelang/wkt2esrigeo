/*
import React, { useEffect, useRef } from 'react';
import styles from './index.less';
import * as THREE from 'three';


const SnowThree = (props) => {
  const canvas1Div = useRef('');
  useEffect(() => {
    function randomRange(t, i) {
      return Math.random() * (i - t) + t
    }
    Particle3D = function (t) {
      THREE.Particle.call(this, t), this.velocity = new THREE.Vector3(0, -2, 0), this.velocity.rotateX(randomRange(-
        45, 45)), this.velocity.rotateY(randomRange(0, 360)), this.gravity = new THREE.Vector3(0, 0, 0), this
        .drag = 1
    }, Particle3D.prototype = new THREE.Particle, Particle3D.prototype.constructor = Particle3D, Particle3D.prototype
      .updatePhysics = function () {
      this.velocity.multiplyScalar(this.drag), this.velocity.addSelf(this.gravity), this.position.addSelf(this
        .velocity)
    };
    var TO_RADIANS = Math.PI / 180;
    THREE.Vector3.prototype.rotateY = function (t) {
      cosRY = Math.cos(t * TO_RADIANS), sinRY = Math.sin(t * TO_RADIANS);
      var i = this.z,
        o = this.x;
      this.x = o * cosRY + i * sinRY, this.z = o * -sinRY + i * cosRY
    }, THREE.Vector3.prototype.rotateX = function (t) {
      cosRY = Math.cos(t * TO_RADIANS), sinRY = Math.sin(t * TO_RADIANS);
      var i = this.z,
        o = this.y;
      this.y = o * cosRY + i * sinRY, this.z = o * -sinRY + i * cosRY
    }, THREE.Vector3.prototype.rotateZ = function (t) {
      cosRY = Math.cos(t * TO_RADIANS), sinRY = Math.sin(t * TO_RADIANS);
      var i = this.x,
        o = this.y;
      this.y = o * cosRY + i * sinRY, this.x = o * -sinRY + i * cosRY
    };
    // $(function () {
    var container = canvas1Div.current;
    var particle;
    var camera;
    var scene;
    var renderer;
    var mouseX = 0;
    var mouseY = 0;
    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;
    var particles = [];
    var particleImage = new Image();
    particleImage.src = "img/snow.png";
    var snowNum = 500;

    function init() {
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
      camera.position.z = 1000;
      scene = new THREE.Scene();
      scene.add(camera);
      renderer = new THREE.CanvasRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      var material = new THREE.ParticleBasicMaterial({
        map: new THREE.Texture(particleImage)
      });
      for (var i = 0; i < snowNum; i++) {
        particle = new Particle3D(material);
        particle.position.x = Math.random() * 2000 - 1000;
        particle.position.y = Math.random() * 2000 - 1000;
        particle.position.z = Math.random() * 2000 - 1000;
        particle.scale.x = particle.scale.y = 1;
        scene.add(particle);
        particles.push(particle)
      }
      container.appendChild(renderer.domElement);
      document.addEventListener("mousemove", onDocumentMouseMove, false);
      document.addEventListener("touchstart", onDocumentTouchStart, false);
      document.addEventListener("touchmove", onDocumentTouchMove, false);
      setInterval(loop, 1000 / 40)
    }

    function onDocumentMouseMove(event) {
      mouseX = event.clientX - windowHalfX;
      mouseY = event.clientY - windowHalfY
    }

    function onDocumentTouchStart(event) {
      if (event.touches.length == 1) {
        event.preventDefault();
        mouseX = event.touches[0].pageX - windowHalfX;
        mouseY = event.touches[0].pageY - windowHalfY
      }
    }

    function onDocumentTouchMove(event) {
      if (event.touches.length == 1) {
        event.preventDefault();
        mouseX = event.touches[0].pageX - windowHalfX;
        mouseY = event.touches[0].pageY - windowHalfY
      }
    }

    function loop() {
      for (var i = 0; i < particles.length; i++) {
        var particle = particles[i];
        particle.updatePhysics();
        with(particle.position) {
          if (y < -1000) {
            y += 2000
          }
          if (x > 1000) {
            x -= 2000
          } else {
            if (x < -1000) {
              x += 2000
            }
          }
          if (z > 1000) {
            z -= 2000
          } else {
            if (z < -1000) {
              z += 2000
            }
          }
        }
      }
      camera.position.x += (mouseX - camera.position.x) * 0.005;
      camera.position.y += (-mouseY - camera.position.y) * 0.005;
      camera.lookAt(scene.position);
      renderer.render(scene, camera)
    }
    init()
  }, []);

  return (
    <div className={styles.rainWrapper} ref={canvas1Div}>
    </div>
  );
};
export default SnowThree;
*/
