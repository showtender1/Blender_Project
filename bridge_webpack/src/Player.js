import { cm1 } from './common';
import {
	Mesh,
	AnimationMixer,
	BoxGeometry,
	MeshBasicMaterial
} from 'three';
import { Stuff } from './Stuff';

export class Player extends Stuff {
	constructor(info) {
		super(info);

		this.width = 0.5;
		this.height = 0.5;
		this.depth = 0.5;

		this.modelName = info.modelName || 'ilbuni';

		this.loadModel(this.modelName);
	}
	loadModel(name) {
		cm1.gltfLoader.load(
			`/models/${name}.glb`,
			glb => {
				if (this.modelMesh) cm1.scene.remove(this.modelMesh);

				glb.scene.traverse(child => {
					if (child.isMesh) child.castShadow = true;
				});

				this.modelMesh = glb.scene.children[0];
				if (name === 'robot26') {
					this.modelMesh.scale.setScalar(0.7);
				}
				this.modelMesh.position.set(this.x, this.y, this.z);
				this.modelMesh.rotation.set(
					this.rotationX,
					this.rotationY,
					this.rotationZ
				);
				cm1.scene.add(this.modelMesh);

				this.modelMesh.animations = glb.animations;
				cm1.mixer = new AnimationMixer(this.modelMesh);
				this.actions = [];
				this.actions[0] = cm1.mixer.clipAction(this.modelMesh.animations[0]);
				this.actions[1] = cm1.mixer.clipAction(this.modelMesh.animations[1]);
				this.actions[2] = cm1.mixer.clipAction(this.modelMesh.animations[2]);
				this.actions[2].repetitions = 1;
				this.actions[0].play();

				this.setCannonBody();
			}
		);
	}
	changeModel(type) {
		this.modelName = type;
		this.loadModel(type);
	}
}
