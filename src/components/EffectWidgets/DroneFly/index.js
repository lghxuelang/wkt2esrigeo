/**
 * 无人机沿路线飞行
 * @author  liugh  2020/04/26
 * @param {object} view  三维场景
 */
import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OBJLoader, MTLLoader } from 'three-obj-mtl-loader';
import { Tooltip } from 'antd'
import { jsapi } from '@/utils/arcgis';
import dronePaths from './data/droneline'
import styles from './index.less'

let currentPointIndex = 0;
let flyFlag = true; //默认飞行
let speed = 3;  //默认三倍速
const DroneFlay = ({ view, paths = dronePaths }) => {
    const droneRender = useRef(null);
    const [flyFlagText, setFlyFlagText] = useState('暂停');
    const [speedText, setSpeedText] = useState(`X${0.5 * speed}`);

    useEffect(() => {
        droneFly(view);
        return () => {
            clearDroneFly(view);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // 飞行调用
    function droneFly(view) {
        currentPointIndex = 0;
        speed = 3;
        setSpeedText(`X${0.5 * speed}`);
        if (!view) return;
        const lineData = paths.features[0].geometry.coordinates.map(p => {
            return [p[0], p[1], 3000 + Math.random() * 1000]
        });
        loadFlyRoute(view, lineData);
    }
    // 加载飞行路线
    async function loadFlyRoute(view, paths) {
        let defaultLineSymbol = {
            type: "simple-line",
            color: [73, 221, 221],
            width: 2,
            style: "short-dash"
        };
        const [Graphic, GraphicsLayer] = await jsapi.load(['esri/Graphic', 'esri/layers/GraphicsLayer']);
        const routeLayer = new GraphicsLayer({ id: 'droneRouteLayer' });
        view.map.add(routeLayer);
        const lineGra = new Graphic({
            geometry: {
                type: 'polyline',
                hasZ: true,
                hasM: false,
                paths: paths,
                // spatialReference: view.spatialReference
                spatialReference: { wkid: 102100 }  //此处坐标系根据航线坐标系调整
            },
            symbol: defaultLineSymbol
        });
        routeLayer.graphics = [lineGra];
        view.goTo(lineGra.geometry).then(() => {
            const droneMesh = loadDrone();
            laodDroneRender(view, droneMesh, paths);
        });
    }
    //预加载无人机模型
    function loadDrone() {
        const dronePartList = ["无人机主体", "机翅1", "机翅2", "机翅3", "机翅4"];
        const mtlLoader = new MTLLoader();
        const droneMesh = new THREE.Object3D();
        dronePartList.map((dronepart, index) => {
            mtlLoader.load('./drone/' + dronepart + '.mtl', function (materials) {
                materials.preload();
                const objLoader = new OBJLoader();
                objLoader.setMaterials(materials);
                objLoader.load('./drone/' + dronepart + '.obj', function (object) {
                    console.log(object)
                    // object.position.y = 0;
                    // object.rotation.y = 0.5;
                    object.scale.set(0.1, 0.1, 0.1);    //设置模型大小比例
                    // object.scale.set(10000, 10000, 10000);

                    if (dronepart.indexOf("机翅") > -1) {
                        object.castShadow = false
                        object.receiveShadow = false

                        // dummy = new THREE.Object3D();
                        object.children[0].geometry.computeBoundingBox();
                        object.children[0].geometry.center()
                        const dummy = new THREE.Object3D();
                        const plane = object;
                        dummy.add(plane);

                        if (index === 1) {
                            dummy.name = "jc1";
                            // dummy.position.set(5900, 4710, 4900);
                        } else if (index === 2) {
                            dummy.name = "jc2";
                            // dummy.position.set(-7250, 4710, 4900);
                        } else if (index === 3) {
                            dummy.name = "jc3";
                            // dummy.position.set(5900, 4710, -4900);
                        } else if (index === 4) {
                            dummy.name = "jc4";
                            // dummy.position.set(-7250, 4710, -4900);
                        }

                        droneMesh.add(dummy);
                    } else {
                        droneMesh.add(object);
                    }
                });
                return ''
            });
            return ''
        });
        return droneMesh;
    }
    // 动态飞行效果
    async function laodDroneRender(view, droneMesh, paths) {
        const [externalRenderers, SpatialReference] = await jsapi.load(['esri/views/3d/externalRenderers', 'esri/geometry/SpatialReference']);

        let lastTime = Date.now();
        let sumTime = 0;

        droneRender.current = {
            renderer: null, // three.js renderer
            camera: null, // three.js camera
            webglScene: null, // three.js scene

            ambient: null, // three.js ambient light source
            sun: null, // three.js sun light source

            iss: null, // ISS model
            issScale: 40000, // scale for the iss model
            issMaterial: new THREE.MeshLambertMaterial({
                color: 0xe03110
            }), // material for the ISS model

            cameraPositionInitialized: false, // we focus the view on the ISS once we receive our first data point
            positionHistory: [], // all ISS positions received so far

            markerMaterial: null, // material for the markers left by the ISS
            markerGeometry: null, // geometry for the markers left by the ISS
            /**
             * Setup function, called once by the ArcGIS JS API.
             */
            setup: function (context) {

                // initialize the three.js renderer
                //////////////////////////////////////////////////////////////////////////////////////
                this.renderer = new THREE.WebGLRenderer({
                    context: context.gl,
                    premultipliedAlpha: false
                });
                this.renderer.setPixelRatio(window.devicePixelRatio);
                this.renderer.setViewport(0, 0, view.width, view.height);
                this.renderer.shadowMap.enabled = true;

                // prevent three.js from clearing the buffers provided by the ArcGIS JS API.
                this.renderer.autoClearDepth = false;
                this.renderer.autoClearStencil = false;
                this.renderer.autoClearColor = false;

                // The ArcGIS JS API renders to custom offscreen buffers, and not to the default framebuffers.
                // We have to inject this bit of code into the three.js runtime in order for it to bind those
                // buffers instead of the default ones.
                var originalSetRenderTarget = this.renderer.setRenderTarget.bind(this.renderer);
                this.renderer.setRenderTarget = function (target) {
                    originalSetRenderTarget(target);
                    if (target === null) {
                        context.bindRenderTarget();
                    }
                }

                // setup the three.js scene
                this.webglScene = new THREE.Scene();

                // setup the camera
                this.camera = new THREE.PerspectiveCamera();

                // setup scene lighting
                this.ambient = new THREE.AmbientLight(0xffffff, 0.5);
                this.webglScene.add(this.ambient);

                this.sun = new THREE.DirectionalLight(0xffffff, 0.5);
                this.sun.position.set(-600, 300, 60000);
                this.webglScene.add(this.sun);

                //scene中加载无人机模型
                var renderPos = [0, 0, 0];
                var pointMesh;


                var routePointList = paths;
                var pos = [routePointList[0][0] - 0.00004, routePointList[0][1], routePointList[0][2]];
                externalRenderers.toRenderCoordinates(view, pos, 0, SpatialReference.WebMercator, renderPos, 0, 1);
                pointMesh = {
                    mesh: droneMesh //.clone()
                };
                pointMesh.setPosition = function (x, y, z) {
                    this.mesh.position.set(x, y, z)
                }.bind(pointMesh);
                pointMesh.setPosition(renderPos[0], renderPos[1], renderPos[2] - 3);

                // 亲测可用
                pointMesh.mesh.rotation.x = 0.25 * Math.PI
                pointMesh.mesh.rotation.y = 0.6 * Math.PI // 角度
                pointMesh.mesh.rotation.z = 0.143 * Math.PI

                var v1 = new THREE.Vector3(0, 1, 0);
                pointMesh.mesh.rotateOnAxis(v1, -65.5 * 2 / 360 * Math.PI); //摆正

                this.webglScene.add(pointMesh.mesh);

                // cleanup after ourselfs
                context.resetWebGLState();
            },


            render: function (context) {

                sumTime += Date.now() - lastTime;
                lastTime = Date.now();

                // update camera parameters

                var cam = context.camera;

                this.camera.position.set(cam.eye[0], cam.eye[1], cam.eye[2]);
                this.camera.up.set(cam.up[0], cam.up[1], cam.up[2]);
                this.camera.lookAt(new THREE.Vector3(cam.center[0], cam.center[1], cam.center[2]));

                // // Projection matrix can be copied directly
                this.camera.projectionMatrix.fromArray(cam.projectionMatrix);
                if (droneRender.current) {
                    let l = context.sunLight;
                    this.sun.position.set(
                        l.direction[0],
                        l.direction[1],
                        l.direction[2]
                    );
                    this.sun.intensity = l.diffuse.intensity;
                    this.sun.color = new THREE.Color(l.diffuse.color[0], l.diffuse.color[1], l.diffuse.color[2]);
                    this.ambient.intensity = l.ambient.intensity;
                    this.ambient.color = new THREE.Color(l.ambient.color[0], l.ambient.color[1], l.ambient.color[2]);

                    this.renderer.resetGLState();
                    this.renderer.render(this.webglScene, this.camera);

                    // as we want to smoothly animate the ISS movement, immediately request a re-render
                    // externalRenderers.requestRender(view);

                    // cleanup
                    context.resetWebGLState();

                }



                var currentRoute = paths;
                if (currentPointIndex < currentRoute.length && flyFlag) {
                    var renderPos = [0, 0, 0];

                    var z = currentRoute[currentPointIndex][2];
                    var x = currentRoute[currentPointIndex][0];
                    var y = currentRoute[currentPointIndex][1];
                    var pos = [x, y, z];

                    externalRenderers.toRenderCoordinates(view, pos, 0, SpatialReference.WebMercator, renderPos, 0, 1);
                    const pointMesh = {
                        mesh: droneMesh //.clone()
                    };
                    pointMesh.setPosition = function (x, y, z) {
                        this.mesh.position.set(x, y, z)
                    }.bind(pointMesh);
                    pointMesh.setPosition(renderPos[0], renderPos[1], renderPos[2]);

                    // 亲测可用
                    pointMesh.mesh.rotation.x = 0.25 * Math.PI;
                    pointMesh.mesh.rotation.y = 0.6 * Math.PI; //角度
                    pointMesh.mesh.rotation.z = 0.143 * Math.PI;


                    var v1 = new THREE.Vector3(0, 1, 0);
                    pointMesh.mesh.rotateOnAxis(v1, -65.5 * 2 / 360 * Math.PI); //将车身摆正

                    this.webglScene.add(pointMesh.mesh);
                    //鸡翅转动
                    if (pointMesh.mesh.getObjectByName('jc1')) {
                        pointMesh.mesh.getObjectByName('jc1').rotation.y -= 0.1 * 100;
                    }
                    if (pointMesh.mesh.getObjectByName('jc2')) {
                        pointMesh.mesh.getObjectByName('jc2').rotation.y -= 0.1 * 100;
                    }
                    if (pointMesh.mesh.getObjectByName('jc3')) {
                        pointMesh.mesh.getObjectByName('jc3').rotation.y -= 0.1 * 100;
                    }
                    if (pointMesh.mesh.getObjectByName('jc4')) {
                        pointMesh.mesh.getObjectByName('jc4').rotation.y -= 0.1 * 100;
                    }
                    if (sumTime > 700 - 100 * speed) { //speedTimeGap
                        currentPointIndex = currentPointIndex + 1;
                        sumTime = 0;
                    }
                } else if (currentPointIndex >= currentRoute.length && flyFlag) {
                    currentPointIndex = 0;
                }


                let l = context.sunLight;
                this.sun.position.set(
                    l.direction[0],
                    l.direction[1],
                    l.direction[2]
                );
                this.sun.intensity = l.diffuse.intensity;
                this.sun.color = new THREE.Color(l.diffuse.color[0], l.diffuse.color[1], l.diffuse.color[2]);
                this.ambient.intensity = l.ambient.intensity;
                this.ambient.color = new THREE.Color(l.ambient.color[0], l.ambient.color[1], l.ambient.color[2]);

                this.renderer.resetGLState();
                this.renderer.render(this.webglScene, this.camera);

                // as we want to smoothly animate the ISS movement, immediately request a re-render
                externalRenderers.requestRender(view);

                // cleanup
                context.resetWebGLState();
            }
        }


        // register the external renderer
        externalRenderers.add(view, droneRender.current);
    }


    //清除飞行效果
    const clearDroneFly = async (view) => {
        const [externalRenderers] = await jsapi.load(['esri/views/3d/externalRenderers']);
        const layer = view.map.findLayerById('droneRouteLayer');
        view.map.remove(layer);
        externalRenderers.remove(view, droneRender.current);
    }



    const getSpeedDiv = () => {
        const speeds = [];
        for (let i = 1; i < 8; i++) {
            speeds.push(
                <Tooltip title={`X ${i * 0.5}`}>
                    <div className={styles.item}
                        style={{ background: speed >= i ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.5)' }}
                        // eslint-disable-next-line no-loop-func
                        onClick={(e) => {
                            e.stopPropagation();
                            speed = i;
                            setSpeedText(`X${i * 0.5}`);
                        }}
                    ></div>
                </Tooltip>
            );
        }
        return speeds.reverse()
    }

    return <div className={styles.wrap}>
        <div className={styles.playBtn} onClick={(e) => {
            e.stopPropagation();
            flyFlag = !flyFlag;
            let text = '无人机加载中';
            if (droneRender.current && flyFlag) {
                text = '暂停'
            } else {
                text = '继续飞行'
            }
            setFlyFlagText(text);
        }}>
            {flyFlagText}

        </div>
        <div className={styles.speedWrap}>
            {getSpeedDiv()}
            <div className={styles.speed}>{speedText}</div>
        </div>
    </div>
}
export default DroneFlay
