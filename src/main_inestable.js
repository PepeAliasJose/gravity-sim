import { OrbitControls } from 'three/examples/jsm/Addons.js'
import '../src/style.css'
import * as THREE from 'three'

import { MassObject } from '../src/mass_object'

function main () {
  //SCENE
  const G = 6.6743e-11

  const scene = new THREE.Scene()

  const object = new MassObject(
    { x: 0, y: 0, z: 0 },
    2 * 10 ** 30,
    2,
    {
      x: 0,
      y: 0,
      z: 0
    },
    0xffff00,
    false,
    'am'
  )

  const earth = new MassObject(
    { x: 0, y: 0, z: -100 },
    5.972 * 10 ** 24,
    1,
    {
      x: 0.05,
      y: 0,
      z: 0
    },
    0x0000ff,
    true,
    'a'
  )

  const mars = new MassObject(
    { x: 0, y: 1, z: 130 },
    6.39 * 10 ** 23,
    1,
    {
      x: -0.05,
      y: 0,
      z: 0
    },
    0xff00ff,
    true,
    'm'
  )

  const vertical = new MassObject(
    { x: -80, y: 0, z: -80 },
    6.39 * 10 ** 28,
    1,
    {
      x: 0,
      y: 0.06,
      z: 0.05
    },
    0x00ffff,
    true,
    'c'
  )

  const objects = [object, earth, mars, vertical]

  document.getElementById('masaSolar').addEventListener('change', e => {
    if (!isNaN(e.target.value)) {
      object.mass = 2 * 10 ** e.target.value
    }
  })

  function initObjects () {
    objects.map(o => {
      o.draw(scene)
    })
  }
  initObjects()

  let dx = 0,
    dy = 0,
    dz = 0,
    distance = 0,
    direction = 0,
    Gforce = 0,
    col = 0

  function updateObjects () {
    objects.forEach(obj => {
      objects.forEach(obj2 => {
        if (obj == obj2) return

        dx = obj.pos.x - obj2.pos.x
        dy = obj.pos.y - obj2.pos.y
        dz = obj.pos.z - obj2.pos.z

        distance = (dx ** 2 + dy ** 2 + dz ** 2) ** 0.5 * 100000
        direction = new THREE.Vector3(
          -dx / distance,
          -dy / distance,
          -dz / distance
        )
        Gforce = (G * obj.mass * obj2.mass) / distance ** 2 / obj.mass
        //console.log('Gforce: ', Gforce)
        obj.accelerate(
          direction.x * Gforce,
          direction.y * Gforce,
          direction.z * Gforce
        )

        col = obj.checkCollision(obj2)
        obj.velocity.x *= col
        obj.velocity.y *= col
        obj.velocity.z *= col

        obj.step()
      })
    })
  }

  function updateCamera () {
    camera.updateProjectionMatrix()
  }

  function render () {
    updateCamera()
    updateObjects()
    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }

  //Camara
  const size = {
    width: 800,
    heigth: 600
  }
  const camera = new THREE.PerspectiveCamera(90, size.width / size.heigth)

  //Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(size.width, size.heigth)
  document.body.appendChild(renderer.domElement)
  camera.position.set(80, 40, 0)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.target.set(0, 0, 0)
  controls.update()

  //GRID
  const gridHelper = new THREE.GridHelper(100, 30)
  gridHelper.position.set(0, -10, 0)
  scene.add(gridHelper)

  requestAnimationFrame(render)
}

main()
