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
				
				// 애니메이션이 존재하는지 확인하고 안전하게 처리
				if (this.modelMesh.animations && this.modelMesh.animations.length > 0) {
					this.actions[0] = this.modelMesh.animations[0] 
						? cm1.mixer.clipAction(this.modelMesh.animations[0]) 
						: null;
					this.actions[1] = this.modelMesh.animations[1] 
						? cm1.mixer.clipAction(this.modelMesh.animations[1]) 
						: null;
					this.actions[2] = this.modelMesh.animations[2] 
						? cm1.mixer.clipAction(this.modelMesh.animations[2]) 
						: null;
					
					if (this.actions[2]) {
						this.actions[2].repetitions = 1;
					}
				if (this.actions[0]) {
					this.actions[0].play();
				}
			}

			// 기존 cannonBody가 있으면 제거하고 현재 위치 저장
			if (this.cannonBody) {
				const currentPosition = this.cannonBody.position;
				this.x = currentPosition.x;
				this.y = currentPosition.y;
				this.z = currentPosition.z;
				cm1.world.removeBody(this.cannonBody);
			}

			this.setCannonBody();
			}
		);
	}
	changeModel(type) {
		this.modelName = type;
		this.loadModel(type);
	}
}
