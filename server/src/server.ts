import express, { Express, Request, Response } from 'express';
import { AuthResponse } from './types';
import dotenv from 'dotenv';

const fetch = require('node-fetch');
const result = dotenv.config();
const app: Express = express();

if (result.error) {
  throw result.error;
}

app.get('/api/client/auth', async (req: Request, res: Response<AuthResponse>): Promise<Response<AuthResponse>> => {
  let response;
  let body;

  return res.status(200).json({
    message: 'Hello World'
  });

  try {
    response = await fetch(
      `${process.env.SERVER_AUTHENTICATION_ENDPOINT}`,
      {
        method: 'post',
        body: JSON.stringify({
          client_id: process.env.SERVER_CLIENT_ID,
          client_secret: process.env.SERVER_CLIENT_SECRET
        })
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

  console.log('response body:', body);

  return res.status(200).json({
    accessToken: body.accessToken as string,
    refreshToken: body.refreshToken as string,
  });
});

app.listen(process.env.SERVER_PORT || 3001, () => console.log(`Server running on port ${process.env.SERVER_PORT || 3001}`))