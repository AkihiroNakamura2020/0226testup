import Twitter from 'twitter-lite';
import { getSession } from 'next-auth/react'
import { getToken } from 'next-auth/jwt';

export default async (req, res) => {//APIのルートの一つ/stream
  //const body = JSON.parse(req.body);
  const { query } = 'hi';

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
    //const params = {screen_name: 'naki_road',count:10};//screen_nameは要確認

    const results = await client.get("statuses/home_timeline");
    //console.log(JSON.stringify(results, null, 2));
    //console.log('results');
   
    
    // const results = await client.get('search/tweets', {
    //     q: query
    //   });

    // const rateLimits = await client.get("statuses/show", {
    //     id: "1496488763308281859"
    //   });

    // const results = await client.get('stream/home_timeline');

    // console.log(`Rate: ${tweets._headers.get('x-rate-limit-remaining')} / ${tweets._headers.get('x-rate-limit-limit')}`);
    // const delta = (tweets._headers.get('x-rate-limit-reset') * 1000) - Date.now()
    // console.log(`Reset: ${Math.ceil(delta / 1000 / 60)} minutes`);


    return res.status(200).json({
      status: 'Ok',
      data: results//results.statuses
    });

  } catch(e) {
    return res.status(400).json({
      status: e.message
    });
  }
}