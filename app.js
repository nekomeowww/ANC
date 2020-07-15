// Dependencies
const Koa = require('koa')
const KoaStatic = require('koa-static')

const config = require('./config.json')

const app = new Koa()
app.proxy = true

app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.get('X-Response-Time');
    console.log(`${ctx.request.ips} ${ctx.method} ${ctx.url} - ${rt}`);
});

app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
});

app.use(KoaStatic("./public"))

// Error Handling
app.on('error', (err, ctx) => {
    console.error("Server Error: " + err + JSON.stringify(ctx))
})
app.listen(config.port, () => {
    console.log("listening on http://127.0.0.1:" + config.port)
})