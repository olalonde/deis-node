import fs from 'fs';
import path from 'path';
import superagent from 'superagent';

const initAuth = (user) => (request) => {
  if (user.token) {
    request.set('Authorization', `token ${user.token}`);
  }
  return request;
};

const initPrefix = (prefix) => (request) => {
  if (request.url[0] === '/') {
    request.url = prefix + request.url;
  }
  return request;
};

const parseError = (_err) => {
  const err = new Error();
  err.status = _err.status;
  const response = _err.response;
  if (response.body) {
    err.body = response.body;
  }
  Object.defineProperty(err, 'lastResponse', {
    enumerable: false,
    value: _err.response,
  });
  return err;
};

const parseResponse = ({ body }) => body;

export default (_opts) => {
  let opts = _opts;
  if (!opts) {
    // load from config file
    const profile = process.env.DEIS_PROFILE || 'client';
    const configPath = path.join(process.env.HOME, '.deis', `${profile}.json`);
    opts = JSON.parse(fs.readFileSync(configPath));
  }
  const { controller } = opts;

  const user = { token: opts.token };
  const prefix = initPrefix(`${controller}/v1`);

  const auth = initAuth(user);

  const request = {};
  ['get', 'post', 'put', 'del'].forEach((method) => {
    request[method] = (urlPath) => {
      const req = superagent[method](urlPath);
      req.use(prefix);
      req.use(auth);
      // Patch to support promise API
      req.result = () => new Promise((resolve, reject) => {
        try {
          req.end((err, response) => {
            if (err) return reject(parseError(err));
            resolve(parseResponse(response));
          });
        } catch (err) {
          reject(err);
        }
      });
      return req;
    };
  });

  const r = request;

  return {
    apps: {
      get: (id) => r.get(`/apps/${id}`).result(),
      del: (id) => r.del(`/apps/${id}`).result(),
      list: () => r.get(`/apps`).result(),
      create: (data) => r.post(`/apps`).send(data).result(),
      config: (appId) => ({
        list: () => r.get(`/apps/${appId}/config`).result(),
        create: (data) => r.post(`/apps/${appId}/config`).send(data).result(),
      }),
      builds: (appId) => ({
        list: () => r.get(`/apps/${appId}/builds`).result(),
        create: (data) => r.post(`/apps/${appId}/builds`).send(data).result(),
        get: (id) => r.post(`/apps/${appId}/builds/${id}`).result(),
      }),
      limits: (appId) => ({
        get: () => r.get(`/apps/${appId}/limits`).result(),
        create: (data) => r.post(`/apps/${appId}/limits`).send(data).result(),
      }),
      releases: (appId) => ({
        get: (id) => r.post(`/apps/${appId}/releases/${id}`).result(),
        list: () => r.get(`/apps/${appId}/releases`).result(),
        rollback: (data) => r.post(`/apps/${appId}/releases/rollback`).send(data).result(),
      }),
      containers: (appId) => ({
        list: (type, num) => {
          if (num) {
            return r.get(`/apps/${appId}/containers/${type}/${num}`).result();
          } else if (type) {
            return r.get(`/apps/${appId}/containers/${type}`).result();
          }
          return r.get(`/apps/${appId}/containers`).result();
        },
      }),
      domains: (appId) => ({
        list: () => r.get(`/apps/${appId}/domains`).result(),
        del: (hostname) => r.del(`/apps/${appId}/domains/${hostname}`).result(),
        create: (data) => r.post(`/apps/${appId}/domains`).send(data).result(),
      }),
      scale: (appId, data) => r.post(`/apps/${appId}/scale`).send(data).result(),
      logs: (appId) => r.get(`/apps/${appId}/logs`).result(),
      run: (appId, data) => r.post(`/apps/${appId}/run`).send(data).result(),
      calculate: (appId, data) => r.post(`/apps/${appId}/calculate`).send(data).result(),
      perms: (appId) => ({
        list: () => r.get(`/apps/${appId}/perms`).result(),
        create: (data) => r.post(`/apps/${appId}/perms`).send(data).result(),
        del: (username) => r.del(`/apps/${appId}/perms/${username}`).result(),
      }),
    },
    clusters: {
      get: (id) => r.get(`/clusters/${id}`).result(),
      del: (id) => r.del(`/clusters/${id}`).result(),
      list: () => r.get(`/clusters`).result(),
      create: (data) => r.post(`/clusters`).send(data).result(),
    },
    keys: {
      get: (id) => r.get(`/keys/${id}`).result(),
      del: (id) => r.del(`/keys/${id}`).result(),
      list: () => r.get(`/keys`).result(),
      create: (data) => r.post(`/keys`).send(data).result(),
    },
    auth: {
      register: (data) => r.post(`/auth/register`).send(data).result(),
      del: () => r.det(`/auth/register`).result(),
      login: (data) => r.post(`/auth/login/`).send(data).result().then(({ token }) => {
        user.token = token;
        return token;
      }),
      logout: (data) => r.post(`/auth/logout`).send(data).result().then(() => {
        delete user.token;
      }),
      apiKey: () => r.get(`/auth/generate-api-key`).result(),
    },
    admin: {
      list: () => r.get(`/admin/perms`).result(),
      del: (username) => r.del(`/admin/perms/${username}`).result(),
      create: (data) => r.post(`/admin/perms`).send(data).result(),
    },
  };
};
