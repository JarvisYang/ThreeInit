require.config({
	shim: {
		'three.min': { exports: 'THREE' },
		'Stats':{exports:'Stats'},
		'TrackballControls':['three.min']
	}
});

define(['three.min','Stats','TrackballControls'],
	function(THREE,Stats){
		var m = {
			scene:null,
			camera:null,
			renderer:null,
			stats:null,
			controls:null,
			width:0,
			height:0
		};

		m.initParam =  function(Parent){
			//get Parent element
			if(Parent){
				this.parent = document.getElementById(Parent);
				this.parent = this.parent?this.parent:document.getElementsByClassName(Parent)[0];
			}
			else{
				this.parent = document.getElementsByTagName('body')[0];
			}

			//get Perent's width and height
			this.width  = this.parent.clientWidth;
			this.height = this.parent.clientHeight;

			return this;
		};

		m.initScene = function(){
			this.scene = new THREE.Scene();
			return this;
		};

		m.initCamera = function(Camera){
			this.camera = new THREE.PerspectiveCamera( 45, this.width/this.height, 1, 100000 );

			if(Camera&&Camera.pos){
				this.camera.position.set(Camera.pos[0],Camera.pos[1],Camera.pos[2]);
			}
			else{
				this.camera.position.set(250,50,300);
			}

			if(Camera&&Camera.up){
				this.camera.up.set(Camera.up[0],Camera.up[1],Camera.up[2]);
			}
			else{
				this.camera.up.set(0,0,1);
			}

			return this;
		};

		m.initRenderer = function(color){
			this.renderer = new THREE.WebGLRenderer( {antialias:true} );
			this.renderer.setSize(this.width,this.height);
			this.renderer.setClearColor(color?color:0xFFFFFF,1);

			this.parent.appendChild(this.renderer.domElement);

			return this;
		};

		m.initStat = function(){
			this.stats = new Stats();
			this.stats.domElement.style.position = 'absolute';
			this.stats.domElement.style.left = '0px';
			this.stats.domElement.style.top = '0px';
			this.parent.appendChild(this.stats.domElement);

			return this;
		};

		m.initController = function(){
			this.controls = new THREE.TrackballControls(this.camera);
			this.controls.rotateSpeed = 1.0;
			this.controls.zoomSpeed = 1.0;
			this.controls.panSpeed = 0.8;
			this.controls.noZoom = false;
			this.controls.noPan = false;
			this.controls.staticMoving = false;
			this.controls.dynamicDampingFactor = 0.3;
			this.controls.keys = [ 65, 83, 68 ];
			return this;
		};

		m.autoResize = function(){
			window.addEventListener( 'resize', function(){
				m.width  = m.parent.clientWidth;
				m.height = m.parent.clientHeight;
				m.camera.aspect = m.width / m.height;
				m.camera.updateProjectionMatrix();
				m.renderer.setSize( m.width, m.height );
			}, false );

			return this;
		};

		m.animation = function(Callback){
			var callback = Callback;
			render();
			function render(){
				callback.call(this);
				m.renderer.render(m.scene,m.camera);
				m.controls.update();
				m.stats.update();
				requestAnimationFrame(render);
			};
			
		};

		return function(args){
			if(args&&args.Parent){
				m.initParam(args.Parent);
			}
			else{
				m.initParam();
			}

			m.initScene();

			if(args&&args.Color){
				m.initRenderer(args.Color);
			}
			else{
				m.initRenderer();
			}

			if(args&&args.Camera){
				m.initCamera(args.Camera);
			}
			else{
				m.initCamera();
			}

			m.initStat().initController().autoResize();
			console.log(m);
			return m;
		};
	});