class Camera {
    constructor() {
        this.eye = new Vector3([0, 0, 3]);
        this.at = new Vector3([0, 0, -100]);
        this.up = new Vector3([0, 1, 0]);
    }

    moveForward() {
        var f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        f.normalize();
        f.mul(1);
        this.eye.add(f);
        this.at.add(f);
    }

    moveBackwards() {
        var f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        f.normalize();
        f.mul(1);
        this.eye.sub(f);
        this.at.sub(f);
    }

    moveLeft() {
        var f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        f.normalize();
        var s = Vector3.cross(this.up, f);
        s.normalize();
        s.mul(1);
        this.eye.add(s);
        this.at.add(s);
    }

    moveRight() {
        var f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        f.normalize();
        var s = Vector3.cross(f, this.up);
        s.normalize();
        s.mul(1);
        this.eye.add(s);
        this.at.add(s);
    }

    panLeft() {
        var f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        var rotationMatrix = new Matrix4();
        var alpha = 15;
        rotationMatrix.setRotate(alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        var f_prime = rotationMatrix.multiplyVector3(f);
        this.at.set(this.eye);
        this.at.add(f_prime);
    }

    panRight() {
        var f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        var rotationMatrix = new Matrix4();
        var alpha = -15;
        rotationMatrix.setRotate(alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        var f_prime = rotationMatrix.multiplyVector3(f);
        this.at.set(this.eye);
        this.at.add(f_prime);
    }

    moveUp() {
        let upVector = new Vector3([0, 1, 0]);
        this.eye.add(upVector);
        this.at.add(upVector);
    }

    moveDown() {
        let downVector = new Vector3([0, -1, 0]);
        this.eye.add(downVector);
        this.at.add(downVector);
    }

    lr(angle) {
        let rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(angle * 180 / Math.PI, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        let forward = new Vector3();
        forward.set(this.at);
        forward.sub(this.eye);
        forward = rotationMatrix.multiplyVector3(forward);
        this.at.set(this.eye);
        this.at.add(forward);
    }

    ud(angle) {
        let forward = new Vector3();
        forward.set(this.at);
        forward.sub(this.eye);
        let right = Vector3.cross(forward, this.up);
        right.normalize();
        let rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(angle * 180 / Math.PI, right.elements[0], right.elements[1], right.elements[2]);
        forward = rotationMatrix.multiplyVector3(forward);
        this.at.set(this.eye);
        this.at.add(forward);
    }
}
