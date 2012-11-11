from flask import Flask, render_template
from flask.ext.assets import Environment, Bundle

app = Flask(__name__)
assets = Environment(app)

js = Bundle('ext/pouch.alpha.js', 'ext/klass.js', 'replicant.js',
            output='build/replicant.js')

js_min = Bundle('ext/pouch.alpha.js', 'ext/klass.js', 'replicant.js',
            filters='jsmin', output='build/replicant.min.js')

assets.register('js_min_all', js_min)
assets.register('js_all', js)

@app.route('/sample')
def sample():
    return render_template('sample.html')


@app.route('/tests')
def tests():
    return render_template('tests.html')


if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)