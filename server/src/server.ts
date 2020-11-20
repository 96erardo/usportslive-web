import express, { Express, Request, Response } from 'express';
import { ClientAuthResponse, RefreshTokenResponse } from './types';
import dotenv from 'dotenv';
import { Buffer } from 'buffer';
import { URLSearchParams } from 'url';

const fetch = require('node-fetch');
const result = dotenv.config();
const app: Express = express();

if (result.error) {
  throw result.error;
}

app.use(express.json())

const auth = Buffer.from(
  `${process.env.SERVER_CLIENT_ID}:${process.env.SERVER_CLIENT_SECRET}`
).toString('base64');

app.post('/api/client/authenticate', async (req: Request, res: Response<ClientAuthResponse>): Promise<Response> => {
  let response;
  let body;

  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', process.env.SERVER_CLIENT_ID as string);
  params.append('client_secret', process.env.SERVER_CLIENT_SECRET as string);

  try {
    response = await fetch(
      process.env.SERVER_AUTHENTICATION_ENDPOINT,
      {
        method: 'post',
        body: params,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

  } catch (e) {
    return res.status(500).json({
      message: e.message
    });
  }

  try {
    body = await response.json();

  } catch (e) {
    return res.status(500).json({
      message: e.message
    });
  }

  console.log('authenticate client:', body);

  return res.status(200).json({
    accessToken: body.accessToken as string,
  });
});

app.post('/api/token/refresh', async (req: Request, res: Response<RefreshTokenResponse>): Promise<Response> => {
  let response;
  let body;

  const params = new URLSearchParams();
  params.append('grant_type', 'refresh_token');
  params.append('refresh_token', req.body.refreshToken);

  try {
    response = await fetch(
      process.env.SERVER_AUTHENTICATION_ENDPOINT,
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${auth}`
        },
        body: params
      }
    )
  } catch (e) {
    return res.status(500).json({
      message: e.message
    });
  }

  try {
    body = await response.json();

  } catch (e) {
    return res.status(500).json({
      message: e.message
    });
  }

  console.log('refresh token:', body);

  return res.status(200).json({
    accessToken: body.accessToken as string,
    refreshToken: body.refreshToken as string,
  });
})

app.listen(process.env.SERVER_PORT || 3001, () => console.log(`Server running on port ${process.env.SERVER_PORT || 3001}`))