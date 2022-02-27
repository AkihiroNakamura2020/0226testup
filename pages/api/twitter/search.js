import Twitter from 'twitter-lite';
import { getSession } from 'next-auth/react'
import { getToken } from 'next-auth/jwt';

export default async (req, res) => {//APIのルートの一つ/search
  const body = JSON.parse(req.body);
  //console.log(body);
  const { query } = body;

  const session = await getSession({ req });
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET
  });

  const client = new Twitter({
    subdomain: 'api',
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: token.twitter.accessToken,
    access_token_secret: token.twitter.refreshToken
  });

  try {
    const results = await client.get('search/tweets', {
      q: query
    });
    //console.log('results');
    //console.log(results.statuses);

    return res.status(200).json({
      status: 'Ok',
      data: results.statuses
      
    });
  } catch(e) {
    return res.status(400).json({
      status: e.message
    });
  }
}