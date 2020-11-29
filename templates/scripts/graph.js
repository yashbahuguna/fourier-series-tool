/*/A.splice(0,A.length)
var lower = -Math.PI;
var upper = Math.PI;
var l = (upper-lower)/2;
var constant;
var sineArr = [];
var cosineArr = [];
var err = [];
var scatter_x = [];
var N =50;
var expr = "x";

function calculateY(x) {
    return eval(expr);
}

function inner(Num) {
    let cosine = 0, sine = 0, y;
    let dt = 0.01;

    constant = 0;
    t = lower;
    while (t < upper) {
        constant += calculateY(t)*dt; 
        t+=dt
    }
    constant /= 2*l;

    y=calculateY(t);
    for (let n =1; n <= Num; n++) {
        sine = 0;
        cosine = 0;
        t = lower;
        while (t < upper) {
            sine += Math.sin(n*Math.PI*t/l)*y*dt;
            cosine += Math.cos(n*Math.PI*t/l)*y*dt;
            t+=dt;
            y=calculateY(t);
        }
        cosine /= l;
        sine /= l;
        cosineArr.push(cosine);
        sineArr.push(sine);
    }
}

function evaluate(x,Num) {
    let s = constant;
    l = (upper-lower)/2;
    for(let i = 1; i <= Num; i++) {
        s += (Math.cos(i*Math.PI*x/l)*cosineArr[i-1] + Math.sin(i*Math.PI*x/l)*sineArr[i-1]);
    }    
    return s;
}

function error(Num) {
    let dt = 0.01;
    let t;
    let e;
    t = lower;
    for (let k=0; k <Num; k++) {
        e = 0;
        t = lower;
        while (t < upper) {
            e += Math.abs(calculateY(t) - evaluate(t,k))*dt;
            t+=dt
        }
        err.push(e);
        scatter_x.push(k);
    }
}

function redraw() {
    board1.removeObject(curve1);
    N = s.Value();
    curve0 = board0.create('functiongraph', [
        function(x) {
          return calculateY(x);
        }, 
        2*lower, 2*upper
        ]);

    curve1 = board1.create('functiongraph', [
        function(x) {
          return evaluate(x, N);
        }, 
        2*lower, 2*upper
        ]);
}


inner(100);
error(100);


var board0 = JXG.JSXGraph.initBoard("box0", {
    renderer: 'canvas',
    showCopyright:false,
    boundingbox: [-10, 10, 10, -10],
    grid: true,
    axis: true
  });

var curve0 = board0.create('functiongraph', [
    function(x) {
      return calculateY(x);
    }, 
    2*lower, 2*upper
    ]);


var board1 = JXG.JSXGraph.initBoard("box1", {
    renderer: 'canvas',
    showCopyright:false,
    boundingbox: [-10, 10, 10, -10],
    grid: true,
    axis: true
  });

var curve1 = board1.create('functiongraph', [
    function(x) {
      return evaluate(x, N);
    }, 
    2*lower, 2*upper
    ]);

var board2 = JXG.JSXGraph.initBoard("box2", {
    showCopyright:false,
    boundingbox: [30, 10, 70, -10],
    grid: true,
    axis: true
    });

var scatterplot = board2.create('chart', err, {chartStyle:'point',width:0,size:1});
var s = board2.create('slider', [[0, -5], [100, -5], [1, 50, 100]], {snapWidth: 1});
var point = board2.create('point',  [()=>{return s.Value();},()=>{return err[s.Value()-1];}], {name:()=>{return err[s.Value()-1].toPrecision(4).toString()}});


/*
  var ax = board.create('axis', [[0, 0], [1, 0]]);
  ax.removeAllTicks();
  var p1 = board.create("point", [3, 2]);

*/
var el = document.getElementById("calculate");
el.addEventListener("click", function(){
    expr = document.getElementById("function").Value
    inner(100);
    error(100);
}, false);