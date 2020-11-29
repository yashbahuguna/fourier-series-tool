from flask import Flask, request
from flask_cors import CORS, cross_origin
import sympy as sym
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

def calculate(func):
    x = sym.symbols('x')
    n = sym.symbols('n',positive=True)
    f,an,bn = sym.symbols('f an bn',cls=sym.Function)
    func = func.replace("sin", "sym.sin").replace("cos", "sym.cos").replace("exp","sym.exp").replace("u","sym.Heaviside")
    f = eval(func)

    dc = sym.integrate(f,(x,(-1*sym.pi),sym.pi)) /(2*sym.pi)
    an = sym.integrate(f*sym.cos(n*x),(x,(-1*sym.pi),sym.pi))
    bn = sym.integrate(f*sym.sin(n*x),(x,-1*sym.pi,sym.pi))
    return str(dc), str(an), str(bn)


@app.route('/',methods = ['POST'])
@cross_origin()
def index(): 
    if request.method == 'POST':
        inp = request.get_json(force=True).get("input")
        r1,r2,r3 = calculate(inp)
        return {"r1":r1,"r2":r2,"r3":r3}

