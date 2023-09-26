/**
 * @title Compressed Texture
 * @category Texture
 */
import * as dat from "dat.gui";
import {
  AssetType,
  Camera,
  DirectLight,
  Logger,
  MeshRenderer,
  PrimitiveMesh,
  Texture2D,
  UnlitMaterial,
  Vector3,
  WebGLEngine,
} from "@galacean/engine";
import { OrbitControl } from "@galacean/engine-toolkit";
Logger.enable();
WebGLEngine.create({ canvas: "canvas", ktx2Loader: { workerCount: 4 } }).then(
  (engine) => {
    engine.canvas.resizeByClientSize();

    const scene = engine.sceneManager.activeScene;
    const rootEntity = scene.createRootEntity();

    // Create camera
    const cameraNode = rootEntity.createChild("camera_node");
    cameraNode.transform.position = new Vector3(0, 0, 3);
    cameraNode.addComponent(Camera);
    cameraNode.addComponent(OrbitControl);

    const lightEntity = rootEntity.createChild();
    lightEntity.addComponent(DirectLight).intensity = 0.5;
    lightEntity.transform.setPosition(-5, 5, 5);
    lightEntity.transform.lookAt(new Vector3(0, 0, 0));

    // material ball
    const ball = rootEntity.createChild("ball");
    const ballRender = ball.addComponent(MeshRenderer);
    const material = new UnlitMaterial(engine);
    ball.transform.setRotation(90, 0, 0);
    ballRender.mesh = PrimitiveMesh.createPlane(engine, 1, 1);
    ballRender.setMaterial(material);

    // debug
    const gui = new dat.GUI();

    const fileList = {
      etc1s:
        "https://mdn.alipayobjects.com/rms/afts/img/A*ONENTaxi-LAAAAAAAAAAAAAAARQnAQ/2d_etc1s.ktx2",
      uastc:
        "https://mdn.alipayobjects.com/rms/afts/img/A*aP4mRJcGi6AAAAAAAAAAAAAAARQnAQ/2d_uastc.ktx2",
    };

    const formats: string[] = [];
    const debugInfo = {
      format: "",
    };
    for (let format in fileList) {
      formats.push(format);
      debugInfo.format = "etc1s";
    }

    function loadTexture(formatDes: string) {
      const url = fileList[formatDes];
      engine.resourceManager
        .load<Texture2D>({
          type: AssetType.KTX2,
          url,
        })
        .then((res) => {
          const compressedTexture = res;
          material.baseTexture = compressedTexture;
        });
    }

    if (debugInfo.format) {
      loadTexture(debugInfo.format);
    }
    gui.add(debugInfo, "format", formats).onChange((v) => {
      loadTexture(v);
    });

    engine.run();
  }
);
