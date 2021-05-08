// 引入模块
import { Camera, WebGLEngine, PrimitiveMesh, BlinnPhongMaterial, DirectLight, Vector3, Vector4, Script, Color, MeshRenderer } from 'oasis-engine';

// 创建画布 
const engine = new WebGLEngine("canvas");
// 设置屏幕适配
engine.canvas.resizeByClientSize();

// 获取场景根实体
const scene = engine.sceneManager.activeScene;
const rootEntity = scene.createRootEntity('root');

// 创建一个相机实体
let cameraEntity = rootEntity.createChild('camera_entity');
cameraEntity.transform.position = new Vector3(0, 5, 10);
cameraEntity.transform.lookAt(new Vector3(0, 0, 0));
let camera = cameraEntity.addComponent(Camera);
camera.backgroundColor = new Vector4(1,1,1,1)

// 创建一个实体用来挂载方向光
let lightEntity = rootEntity.createChild('light');

// 创建一个方向光组件
let directLight = lightEntity.addComponent(DirectLight)
directLight.color = new Color( 1.0, 1.0, 1.0 );
directLight.intensity = 0.5;

// 通过灯光实体的旋转角度控制光线方向
lightEntity.transform.rotation = new Vector3(45, 45, 45);

// 创建立方体实体
let cubeEntity = rootEntity.createChild('cube');
let cube = cubeEntity.addComponent(MeshRenderer);
cube.mesh = PrimitiveMesh.createCuboid(engine, 2, 2, 2);
cube.setMaterial(new BlinnPhongMaterial(engine));

// 旋转脚本组件
class Rotate extends Script {
  private _tempVector = new Vector3(0, 1, 0);
  onUpdate() {
    this.entity.transform.rotate(this._tempVector);
  }
}

// 添加旋转脚本组件
cubeEntity.addComponent(Rotate);

// 启动引擎
engine.run();