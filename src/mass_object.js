import {
  BufferGeometry,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  SphereGeometry,
  Vector3
} from 'three'

export class MassObject {
  constructor (
    pos,
    mass,
    radius,
    initialVelocity,
    color = 0xffffff,
    canMove = true,
    name
  ) {
    this.pos = new Vector3(pos.x, pos.y, pos.z)
    this.mass = mass
    this.radius = radius
    this.canMove = canMove
    this.name = name

    this.velocity = new Vector3(
      initialVelocity.x,
      initialVelocity.y,
      initialVelocity.z
    )

    const geometry = new SphereGeometry(this.radius, 20, 20)
    const material = new MeshBasicMaterial({
      color: color,
      wireframe: true
    })

    const lineMaterial = new LineBasicMaterial({
      color: 0xffffff
    })

    const lineGeometry = new BufferGeometry().setFromPoints([
      new Vector3(0, 0, 0),
      new Vector3(2, 2, 2)
    ])

    this.line = new Line(lineGeometry, lineMaterial)
    this.mesh = new Mesh(geometry, material)
  }

  draw (scene) {
    this.mesh.position.set(...this.pos)
    this.line.position.set(...this.pos)
    if (scene) {
      scene.add(this.mesh)
      scene.add(this.line)
    } else {
      return this.mesh
    }
  }

  step () {
    if (this.canMove) {
      this.pos.x += this.velocity.x
      this.pos.y += this.velocity.y
      this.pos.z += this.velocity.z

      this.line.geometry.setFromPoints([
        new Vector3(0, 0, 0),
        new Vector3(
          this.velocity.x * 30,
          this.velocity.y * 30,
          this.velocity.z * 30
        )
      ])
    }

    //Actualizar la posicion
    this.mesh.position.set(...this.pos)
    this.line.position.set(...this.pos)
  }

  accelerate (x, y, z) {
    //Limit velocity to 2 to slow down things
    this.velocity.x = Math.max(Math.min(this.velocity.x + x / 100000, 2), -2)
    this.velocity.y = Math.max(Math.min(this.velocity.y + y / 100000, 2), -2)
    this.velocity.z = Math.max(Math.min(this.velocity.z + z / 100000, 2), -2)

    document.getElementById(this.name + '.x').innerHTML =
      'X: ' + this.velocity.x.toFixed(4)
    document.getElementById(this.name + '.y').innerHTML =
      'Y: ' + this.velocity.y.toFixed(4)
    document.getElementById(this.name + '.z').innerHTML =
      'Z: ' + this.velocity.z.toFixed(4)
  }

  checkCollision (object) {
    const dx = object.pos.x - this.pos.x
    const dy = object.pos.y - this.pos.y
    const dz = object.pos.z - this.pos.z

    const distance = (dx ** 2 + dy ** 2 + dz ** 2) ** 0.5

    if (distance < object.radius + this.radius) {
      return -0.95
    }
    return 1
  }
}
