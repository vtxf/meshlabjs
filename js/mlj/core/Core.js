/**
 * MLJLib
 * MeshLabJS Library
 * 
 * Copyright(C) 2015
 * Paolo Cignoni 
 * Visual Computing Lab
 * ISTI - CNR
 * 
 * All rights reserved.
 *
 * This program is free software; you can redistribute it and/or modify it under 
 * the terms of the GNU General Public License as published by the Free Software 
 * Foundation; either version 2 of the License, or (at your option) any later 
 * version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT 
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS 
 * FOR A PARTICULAR PURPOSE. See theGNU General Public License 
 * (http://www.gnu.org/licenses/gpl.txt) for more details.
 * 
 */

/**
 * @file Defines Emscripten Module object, MLJ.core namspace and the basic 
 * classes used to create a Scene
 * @author Stefano Gabriele
 */

/**
 * @global
 * @description Module is a global JavaScript object with attributes that 
 * Emscripten-generated code calls at various points in its execution.
 * Developers can provide an implementation of Module to control 
 * the execution of code. For example, to define how notification 
 * messages from Emscripten are displayed, developers implement the 
 * Module.print attribute.
 * Note that parameter 'memoryInitializerPrefixURL' indicates path of file.js.mem
 */

var Module = {
    memoryInitializerPrefixURL: "js/generated/",
    preRun: [],
    postRun: [],
    print: function (text) {
        var w = MLJ.gui.getWidget("Log");
        w.append(text);
    },
    printErr: function (text) {
        var w = MLJ.gui.getWidget("Log");
        w.append(text);
    }
};


/**
 * MLJ.core namspace
 * @namespace MLJ.core
 * @memberOf MLJ
 * @author Stefano Gabriele
 */
MLJ.core = {
    /**
     * Enum for defaults
     * @readonly
     * @enum {Object}
     * @memberOf MLJ.core     
     * @author Stefano Gabriele
     */
    defaults: {
        /** AmbientLight defaults */
        AmbientLight: {
            color: "#ffffff",
            on: false
        },
        /** Headlight defaults */
        Headlight: {
            color: "#ffffff",
            on: true,
            intensity: 0.5,
            distance: 0
        },
        /** Material defaults */
        Material: {
            specular: '#ffffff',
            color: '#a0a0a0',
            emissive: '#7c7b7b',
            shading: THREE.FlatShading,
            shininess: 50,
            wireframe: false
        }
    }
};

/**         
 * @class Creates a new Ambient light
 * @param {THREE.Scene} scene The scene object
 * @param {THREE.Camera} camera The camera object
 * @param {THREE.WebGLRenderer} renderer The renderer object
 * @memberOf MLJ.core
 * @author Stefano Gabriele 
 */
MLJ.core.AmbientLight = function (scene, camera, renderer) {

    var _on = MLJ.core.defaults.AmbientLight.on;

    var _light = new THREE.AmbientLight(
            MLJ.core.defaults.AmbientLight.color);
    
    /**
     * Sets the ambient light color
     * @param {Object} color Can be a hexadecimal or a CSS-style string for example,
     * "rgb(250, 0,0)", "rgb(100%,0%,0% )", "#ff0000", "#f00", or "red"
     * @author Stefano Gabriele     
     */
    this.setColor = function (color) {
        _light.color = new THREE.Color(color);
        renderer.render(scene, camera);
    };
    
    /**
     * Returns <code>true</code> if this ambient light is on
     * @returns {Boolean} <code>true</code> if this ambient light is on, 
     * <code>false</code> otherwise
     * @author Stefano Gabriele     
     */
    this.isOn = function () {
        return _on;
    };
    
    /**
     * Sets this ambient light on/off
     * @param {Boolean} on If <code>true</code>, this ambient light is enabled; 
     * otherwise this ambient light is disabled
     * @author Stefano Gabriele
     */
    this.setOn = function (on) {
        if (on === true) {
            scene.add(_light);
            _on = true;
        } else {
            scene.remove(_light);
            _on = false;
        }

        renderer.render(scene, camera);
    };

    //Init
    this.setOn(_on);
};


/**         
 * @class Creates a new Headlight
 * @param {THREE.Scene} scene The scene object
 * @param {THREE.Camera} camera The camera object
 * @param {THREE.WebGLRenderer} renderer The renderer object
 * @memberOf MLJ.core
 * @author Stefano Gabriele 
 */
MLJ.core.Headlight = function (scene, camera, renderer) {
    var _on = MLJ.core.defaults.Headlight.on;

    var _light = new THREE.PointLight(
            MLJ.core.defaults.Headlight.color,
            MLJ.core.defaults.Headlight.intensity,
            MLJ.core.defaults.Headlight.distance);
    
    /**
     * Sets the intensity of the headlight
     * @param {Float} Numeric value of the light's strength/intensity
     * @author Stefano Gabriele     
     */
    this.setIntensity = function (value) {
        _light.intensity = value;
        renderer.render(scene, camera);
    };
    
    /**
     * Sets the headlight color
     * @param {Object} color Can be a hexadecimal or a CSS-style string for example, 
     * "rgb(250, 0,0)", "rgb(100%,0%,0% )", "#ff0000", "#f00", or "red"
     * @author Stefano Gabriele     
     */
    this.setColor = function (color) {
        _light.color = new THREE.Color(color);
        renderer.render(scene, camera);
    };
    
    /**
     * Sets this headlight on/off
     * @param {Boolean} on If <code>true</code>, this headlight is enabled; 
     * otherwise this headlight is disabled
     * @author Stefano Gabriele
     */
    this.setOn = function (on) {
        if (on) {
            camera.add(_light);
        } else {
            camera.remove(_light);
        }
        renderer.render(scene, camera);
    };

    //Init
    this.setOn(_on);

};

MLJ.core.Material = function (parameters) {
    
    var _this = this;
    
    /**     
     * Contains this THREE.Material.
     * @type THREE.MeshPhongMaterial
     * @author Stefano Gabriele
     */
       
    this.threeMaterial = null;
    
    /**     
    * Contains this material paramters
    * @type Object
    * @author Stefano Gabriele
    */
    this.parameters = parameters === undefined
            ? $.extend(true, {}, MLJ.core.defaults.Material)
            : parameters;     
              
    /**
    * Sets the diffuse color of the material
    * @param {Object} color Can be a hexadecimal or a CSS-style string for example, 
    * "rgb(250, 0,0)", "rgb(100%,0%,0% )", "#ff0000", "#f00", or "red"
    * @author Stefano Gabriele     
    */
    this.setColor = function (value) {
        this.parameters.color = this.threeMaterial.color = new THREE.Color(value);
        MLJ.core.Scene.render();
    };
            
    /**
     * Indicates that this material need update
     * @author Stefano Gabriele     
     */
    this.needUpdate = function () {
        _this.threeMaterial.needUpdate = true;
    };
    
    /**
     * Removes the object from memory
     * @author Stefano Gabriele     
     */
    this.dispose = function () {
        _this.threeMaterial.dispose();
        _this.threeMaterial = _this.parameters = _this = null;        
    };
    
    this.build = function() {
        _this._build();
    }
    
    //Init
    this.build();
};

MLJ.core.Material.prototype = {
    _build: function () {
    }
};

MLJ.core.BasicMaterial = function (parameters) {               
    
    /**     
     * Build a new THREE.MeshBasicMaterial initialized with <code>this.parameters</code>
     * @author Stefano Gabriele
     */
    this._build = function () {
        this.threeMaterial = new THREE.MeshBasicMaterial(this.parameters);        
    };
            
    MLJ.core.Material.call(this, parameters);
};

MLJ.extend(MLJ.core.Material, MLJ.core.BasicMaterial);

/**         
 * @class Creates a new PhongMaterial 
 * @param {Object} parameters The initial paramters of the material
 * @memberOf MLJ.core
 * @author Stefano Gabriele 
 * @example
 * var material = new PhongMaterial({
 *    specular: '#ffffff',
 *    color: '#a0a0a0',
 *    emissive: '#7c7b7b',
 *    shading: THREE.FlatShading,
 *    shininess: 50, 
 * });
 */
MLJ.core.PhongMaterial = function (parameters) {    
           
    /**     
     * Build a new THREE.MeshPhongMaterial initialized with <code>this.parameters</code>
     * @author Stefano Gabriele
     */
    this._build = function () {
        this.threeMaterial = new THREE.MeshPhongMaterial(this.parameters);        
    };
    
    /**
     * Sets the diffuse color of the material
     * @param {Object} color Can be a hexadecimal or a CSS-style string for example, 
     * "rgb(250, 0,0)", "rgb(100%,0%,0% )", "#ff0000", "#f00", or "red"
     * @author Stefano Gabriele     
     */
    this.setColor = function (value) {
        this.parameters.color = this.threeMaterial.color = new THREE.Color(value);
        MLJ.core.Scene.render();
    };
    
    /**
     * Sets the Emissive (light) color of the material, essentially a solid color unaffected by other lighting
     * @param {Object} color Can be a hexadecimal or a CSS-style string for example, 
     * "rgb(250, 0,0)", "rgb(100%,0%,0% )", "#ff0000", "#f00", or "red"
     * @author Stefano Gabriele     
     */
    this.setEmissive = function (value) {
        this.parameters.emissive = this.threeMaterial.emissive = new THREE.Color(value);
        MLJ.core.Scene.render();
    };

    /**
     * Sets the headlight color
     * @param {Object} color Can be a hexadecimal or a CSS-style string for example, "rgb(250, 0,0)", "rgb(100%,0%,0% )", "#ff0000", "#f00", or "red"
     * @author Stefano Gabriele     
     */
    this.setSpecular = function (value) {
        this.parameters.specular = this.threeMaterial.specular = new THREE.Color(value);
        MLJ.core.Scene.render();
    };

    /**
     * Sets the specular color of the material, i.e., how shiny the material is 
     * and the color of its shine. Setting this the same color as the diffuse 
     * value (times some intensity) makes the material more metallic-looking; 
     * setting this to some gray makes the material look more plastic
     * @param {Object} color Can be a hexadecimal or a CSS-style string 
     * for example, "rgb(250, 0,0)", "rgb(100%,0%,0% )", "#ff0000", "#f00", or "red"
     * @author Stefano Gabriele     
     */
    this.setShininess = function (value) {
        this.parameters.shininess = this.threeMaterial.shininess = value;
        MLJ.core.Scene.render();
    };
    
    MLJ.core.Material.call(this, parameters);
};

MLJ.extend(MLJ.core.Material, MLJ.core.PhongMaterial);

/**         
 * @class Creates a new MeshFile 
 * @param {String} name The name of the mesh file
 * @param {uintptr_t} ptrMesh the pointer returned from a c++ function call
 * @memberOf MLJ.core
 * @author Stefano Gabriele 
 * @example
 * var Opener = new Module.Opener();
 * var resOpen = Opener.openMesh(file.name);
 * if (resOpen != 0) {
 *      // error in opening ...
 * } else {
 *      var ptrMesh = Opener.getMesh(); 
 *      var mf = new MLJ.core.MeshFile(file.name, ptrMesh); 
 * } 
 */
MLJ.core.MeshFile = function (name, ptrMesh) {
    this.name = name;
    this.ptrMesh = ptrMesh;
    this.VN = this.vert = this.FN = this.face = null;
    this.material = new MLJ.core.PhongMaterial();
    this.threeMesh = null;
    var _this = this;

    function buildMeshGeometry() {
        var meshProp = new Module.MeshLabJs(ptrMesh);
        _this.VN = meshProp.getVertexNumber();
        _this.vert = meshProp.getVertexVector();
        _this.FN = meshProp.getFaceNumber();
        _this.face = meshProp.getFaceVector();

        var geometry = new THREE.Geometry();
        for (var i = 0; i < _this.VN * 3; i++) {
            var v1 = Module.getValue(_this.vert + parseInt(i * 4), 'float');
            i++;
            var v2 = Module.getValue(_this.vert + parseInt(i * 4), 'float');
            i++;
            var v3 = Module.getValue(_this.vert + parseInt(i * 4), 'float');
            geometry.vertices.push(new THREE.Vector3(v1, v2, v3));
        }
        for (var i = 0; i < _this.FN * 3; i++) {
            var a = Module.getValue(_this.face + parseInt(i * 4), '*');
            i++;
            var b = Module.getValue(_this.face + parseInt(i * 4), '*');
            i++;
            var c = Module.getValue(_this.face + parseInt(i * 4), '*');
            geometry.faces.push(new THREE.Face3(a, b, c));
        }

        geometry.dynamic = true;

        return geometry;
    }

    function buildThreeMesh() {
        console.time("Time to create mesh: ");
        _this.threeMesh = new THREE.Mesh(buildMeshGeometry(),
                _this.material.threeMaterial);
        console.timeEnd("Time to create mesh: ");
    }

    function geometryNeedUpdate() {
        _this.threeMesh.geometry.verticesNeedUpdate = true;
        _this.threeMesh.geometry.elementsNeedUpdate = true;
        _this.threeMesh.geometry.normalsNeedUpdate = true;
        _this.threeMesh.geometry.computeFaceNormals();
        _this.threeMesh.geometry.computeVertexNormals();
    }
    
    /**
     * Sets the mesh shading: Smooth, Flat, None
     * @param {Number} shading The shading type: <code>THREE.FlatShading (default), 
     * THREE.SmoothShading, THREE.NoShading</code>
     * @author Stefano Gabriele 
     */
    this.setShading = function (shading) {        
        //Set material shading parameter
        this.material.parameters.shading = shading;

        //Rebuild material
        this.material.build();

        //Change mesh old material with new one
        _this.threeMesh.material = this.material.threeMaterial;

        //Update geometry
        geometryNeedUpdate();

        MLJ.core.Scene.render();
    };
    
    /**
     * Returns this THREE.Mesh object
     * @returns {THREE.Mesh} this THREE.Mesh object
     * @author Stefano Gabriele     
     */
    this.getThreeMesh = function () {
        return this.threeMesh;
    };

    /**
     * Update (rebuild) this THREE.Mesh geometry
     * @author Stefano Gabriele        
     */
    this.updateThreeMesh = function () {

        //Free memory
        _this.threeMesh.geometry.dispose();

        //Rebuild mesh geometry
        this.threeMesh.geometry = buildMeshGeometry();

        geometryNeedUpdate();
    };
    
    /**
     * Removes the object from memory
     * @author Stefano Gabriele     
     */
    this.dispose = function () {
        _this.threeMesh.geometry.dispose();
        _this.material.dispose();

        if (_this.threeMesh.texture) {
            _this.threeMesh.texture.dispose();
        }

        _this.threeMesh = _this.name = _this.ptrMesh = _this.VN = _this.vert =
                _this.FN = _this.face = _this.material = _this = null;
    };

    buildThreeMesh();
};
